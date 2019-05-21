// Copyright [2015] [Banana.ch SA - Lugano Switzerland]
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// @id = ch.banana.at.app.auditfile_v1.01
// @api = 1.0
// @pubdate = 2019-04-29
// @publisher = Banana.ch SA
// @description = [DEV] Export to Austria Financial Auditfile v1.01 (BETA)
// @task = app.command
// @doctype = 100.*;110.*
// @encoding = utf-8
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = 


/*
*	SUMMARY
*   =======
*
*	This BananaApp creates an XML file containing Banana Accounting data.
*   The structure of the file and its content follows the Auditfile v1.01 for Austria specifications.
*
*	- Works only with double-entry accounting
*	- No cost centers
*	- No multi currency accounting
*   - 
*
*/


/* Main function */
function exec() {

    //Check the version of Banana. If < than 9.0.3 the script does not start
    var requiredVersion = '9.0.3';
    if (Banana.compareVersion && Banana.compareVersion(Banana.application.version, requiredVersion) >= 0) {

		// Opend a dialog. User must choose a period
        var dateform = null;
        if (options && options.useLastSettings) {
            dateform = getScriptSettings();
        } else {
            dateform = settingsDialog();
        }
        if (!dateform) {
            return;
        }

        var startDate = dateform.selectionStartDate;
        var endDate = dateform.selectionEndDate;

        /* 2) Create the xml document */
        var output = createXml(Banana.document, startDate, endDate);
        saveData(output, startDate, endDate);
    }
    else {
		Banana.document.addMessage('Banana Accounting ' + requiredVersion + ' is required.');	
    }
}

/* Creates the XML document */
function createXml(banDoc, startDate, endDate) {

    var xmlDocument = Banana.Xml.newDocument("AuditFile");
    
    var auditfile = addSchemaAndNamespaces(xmlDocument);
    var header = addHeader(auditfile, banDoc, startDate, endDate);
    var masterFiles = addMasterFiles(auditfile, banDoc, startDate, endDate);
    var generalLedgerEntries = addGeneralLedgerEntries(auditfile, banDoc, startDate, endDate);

    ////var inventoryStockLevels = addInventoryStockLevels(auditfile, banDoc, startDate, endDate); // >= 0
    //var sourceDocuments = addSourceDocuments(auditfile, banDoc, startDate, endDate);
    //var assetStatement = addAssetStatement(auditfile, banDoc, startDate, endDate);

    var output = Banana.Xml.save(xmlDocument);

	return output;
}



/********************************** 
	xml schema and namespaces
**********************************/
/* Initialize the xml schema */
function initSchemarefs(param) {
    param.schemaRefs = [
        'urn:OECD:StandardAuditFile-Tax:1.00_01 ../schemas/SAF-T.xsd'
    ];
}

/* Initialize the xml namespaces */
function initNamespaces(param) {
    param.namespaces = [
        {
          'namespace' : 'urn:OECD:StandardAuditFile-Taxation:AT_1.01',
          'prefix' : 'xmlns'
        },
        {
          'namespace' : 'http://www.w3.org/2001/XMLSchema',
          'prefix' : 'xmlns:xs'
        },
        {
          'namespace' : 'urn:schemas-OECD:schema-extensions:documentation',
          'prefix' : 'xmlns:doc'
        }
    ];
}

/* Function that adds xml schema and namespaces */
function addSchemaAndNamespaces(xml) {
	var param = {};
    var auditfile = xml.addElement("AuditFile");
    //initSchemarefs(param);
    initNamespaces(param);

    var attrsSchemaLocation = '';
    for (var i in param.schemaRefs) {
        var schema = param.schemaRefs[i];
        if (schema.length > 0) {
            attrsSchemaLocation += schema;
        }
    }
    if (attrsSchemaLocation.length > 0) {
        auditfile.setAttribute("xsi:schemaLocation", attrsSchemaLocation);
    }

    for (var i in param.namespaces) {
        var prefix = param.namespaces[i]['prefix'];
        var namespace = param.namespaces[i]['namespace'];
        auditfile.setAttribute(prefix, namespace);
    }
    return auditfile;
}



/********************************** 
	<Header> xml tag
**********************************/
/* Function that creates the <Header> element of the xml file */
function addHeader(xml, banDoc, startDate, endDate) {

	/*
		<header>
			<TaxID>
				<FA></FA>
				<TaxRegistrationNumber></TaxRegistrationNumber>
				<VATNumber></VATNumber>
			</TaxID>
			<CompanyName></CompanyName>
			<CompanyAddress>
				<BuildingNumber></BuildingNumber>
				<StreetName></StreetName>
				<AddressDetail></AddressDetail>
				<City></City>
				<PostalCode></PostalCode>
				<Region></Region>
				<Country></Country>
			</CompanyAddress>
			<CompanyID></CompanyID>
			<ContactInformation>
				<Contact></Contact>
				<Telephone></Telephone>
				<Fax></Fax>
				<Email></Email>
				<Website></Website>
			</ContactInformation>
			<TaxAccountingBasis></TaxAccountingBasis>
			<TaxEntity></TaxEntity>
			<FiscalYear></FiscalYear>
			<StartDate></StartDate>
			<EndDate></EndDate>
			<Kleinunternehmer_AT></Kleinunternehmer_AT>
			<Taxonomy></Taxonomy>
			<CurrencyCode></CurrencyCode>
			<AuditFileVersion></AuditFileVersion>
			<DateCreated></DateCreated>
			<ProductID></ProductID>
			<ProductVersion></ProductVersion>
			<SelectionCriteria>
				<TaxReportingJurisdiction></TaxReportingJurisdiction>
				<CompanyEntity></CompanyEntity>
				<SelectionStartDate></SelectionStartDate>
				<SelectionEndDate></SelectionEndDate>
				<PeriodStart></PeriodStart>
				<PeriodEnd></PeriodEnd>
				<DocumentType></DocumentType>
			</SelectionCriteria>
			<HeaderComment></HeaderComment>
		</header>
	*/

	// Fiscal registration number of the entity
	var fa = banDoc.info("AccountingDataBase", "FiscalNumber");

	// Eingabe der der Steuernummer (bei österreichischer Steuernummer Format: 123/4567)
	var taxregistrationnumber = banDoc.info("AccountingDataBase", "VatNumber");
	
	// Eingabe der UID-Nummer (inkl. Landeskennung)
	//var vatnumber = '';

	// Company name
	var companyname = banDoc.info("AccountingDataBase", "Company");
    
	// Company address
    var buildingnumber = '';
    var streetname = '';
    var addressdetail = '';
    if (banDoc.info("AccountingDataBase", "Address1")) {
    	streetname = banDoc.info("AccountingDataBase", "Address1");
    }
    if (banDoc.info("AccountingDataBase", "Address2")) {
    	streetname += ", " + banDoc.info("AccountingDataBase", "Address2");
    }
    var city = '';
    if (banDoc.info("AccountingDataBase", "City")) {
    	city = banDoc.info("AccountingDataBase", "City");
    }
    var postalcode = '';
    if (banDoc.info("AccountingDataBase", "Zip")) {
    	postalCode = banDoc.info("AccountingDataBase", "Zip");
    }
    var region = '';
    if (banDoc.info("AccountingDataBase", "State")) {
    	region = banDoc.info("AccountingDataBase", "State");
    }
    var country = '';
    if (banDoc.info("AccountingDataBase", "Country")) {
    	country = banDoc.info("AccountingDataBase", "Country");
    }

    // Registration number of the Company
    //var companyid = '';

    // Company contact
    var contact = '';
    if (banDoc.info("AccountingDataBase", "Name") && banDoc.info("AccountingDataBase", "FamilyName")) {
    	contact = banDoc.info("AccountingDataBase", "Name") + " " + banDoc.info("AccountingDataBase", "FamilyName");
    }
    var telephone = banDoc.info("AccountingDataBase", "Phone");
    var fax = banDoc.info("AccountingDataBase", "Fax");
    var email = banDoc.info("AccountingDataBase", "Email");
    var website = banDoc.info("AccountingDataBase", "Web");

    // Invoice Accounting, Cash Accounting, Delivery, other ...
    // § 4(1) EStG, § 4(3) EStG, § 5 EStG, etc.
    var taxaccountingbasis = '';
    
    // Company / Division / Branch reference
    var taxentity = '';
    
    // Company financial year, start-date and end-date
    var fiscalyear = Banana.Converter.toDate(banDoc.info('AccountingDataBase','OpeningDate')).getFullYear();
    var startdate = banDoc.info('AccountingDataBase','OpeningDate');
    var enddate = banDoc.info('AccountingDataBase','ClosureDate');

    // Eingabe einer Kennzeichnung, ob Kleinunternehmer gem. § 6 Abs. 1 Z 27 UStG ja oder nein;
    // 1 = ja; 0 = nein (oder Verzichtserklärung gem. § 6 Abs. 3)
    var kleinunternehmerat = '1';
    
    // XBRL Taxonomy being referred to in LeadCode
    var taxonomy = '';

    // Currency Code (3 Char ISO) or local currency which accounts are audited in
    var currencycode = banDoc.info("AccountingDataBase", "BasicCurrency");

    // Identification of the Standard Audit File SAF-T version being used
    var auditfileversion = 'Version 1.01';
    
    // Date of production of SAF-T
    var datecreated = '';
    var date = new Date();
    var year = date.getFullYear();
    day = date.getDate().toString();
    if (day.length < 2) {
        day = "0" + day;
    }
    month = (date.getMonth() + 1).toString();
    if (month.length < 2) {
        month = "0" + month;
    }
	datecreated = year + '-' + month + '-' + day; // YYYY-MM-DD

    // Software that generated the SAF-T
    var productid = 'Banana Accounting';

    // Software Version
    var productversion = banDoc.info("Base","ProgramVersion");

 	// // Tax Reporting Jurisdiction
	// var TaxReportingJurisdiction = '';

	// // Gruppenzugehörigkeit (Gruppenbesteuerung)
	// var CompanyEntity = '';

	// // Start date and end date of the selection criteria
	// var SelectionStartDate = startDate;
	// var SelectionEndDate = endDate;

	// // Zeitraum Beginn ende
	// var PeriodStart = startDate;
	// var PeriodEnd = endDate;

	// // Type of documents selected
	// var DocumentType = '';

	// // Comments on header file
	// var headercomment = '';


	var headerNode = xml.addElement('Header');
	var taxidNode = headerNode.addElement('TaxID');

	if (fa) {
		var faNode = taxidNode.addElement('FA').addTextNode(fa);
	}
	var taxregistrationnumberNode = taxidNode.addElement('TaxRegistrationNumber').addTextNode(taxregistrationnumber);
	// var vatnumberNode = taxidNode.addElement('VATNumber').addTextNode(vatnumber);
	var companynameNode = headerNode.addElement('CompanyName').addTextNode(companyname);
	var companyaddressNode = headerNode.addElement('CompanyAddress');
	var buildingnumberNode = companyaddressNode.addElement('BuildingNumber').addTextNode(buildingnumber);
	var streetnameNode = companyaddressNode.addElement('StreetName').addTextNode(streetname);
	var addressdetailNode = companyaddressNode.addElement('AddressDetail').addTextNode(addressdetail);
	var cityNode = companyaddressNode.addElement('City').addTextNode(city);
	var postalcodeNode = companyaddressNode.addElement('PostalCode').addTextNode(postalcode);
	var regionNode = companyaddressNode.addElement('Region').addTextNode(region);
	var countryNode = companyaddressNode.addElement('Country').addTextNode(country);
	//var companyidNode = headerNode.addElement('CompanyID').addTextNode(companyid);
	var contactinformationNode = headerNode.addElement('ContactInformation');
	var contactNode = contactinformationNode.addElement('Contact').addTextNode(contact);
	var telephoneNode = contactinformationNode.addElement('Telephone').addTextNode(telephone);
	var faxNode = contactinformationNode.addElement('Fax').addTextNode(fax);
	var emailNode = contactinformationNode.addElement('Email').addTextNode(email);
	var websiteNode = contactinformationNode.addElement('Website').addTextNode(website);
	var taxaccountingbasisNode = headerNode.addElement('TaxAccountingBasis').addTextNode(taxaccountingbasis);
	var taxentityNode = headerNode.addElement('TaxEntity').addTextNode(taxentity);
	var fiscalyearNode = headerNode.addElement('FiscalYear').addTextNode(fiscalyear);
	var startdateNode = headerNode.addElement('StartDate').addTextNode(startdate);
	var enddateNode = headerNode.addElement('EndDate').addTextNode(enddate);
	var kleinunternehmeratNode = headerNode.addElement('Kleinunternehmer_AT').addTextNode(kleinunternehmerat);
	var taxonomyNode = headerNode.addElement('Taxonomy').addTextNode(taxonomy);
	var currencycodeNode = headerNode.addElement('CurrencyCode').addTextNode(currencycode);
	var auditfileversionNode = headerNode.addElement('AuditFileVersion').addTextNode(auditfileversion);
	var datecreatedNode = headerNode.addElement('DateCreated').addTextNode(datecreated);
	var productidNode = headerNode.addElement('ProductID').addTextNode(productid);
	var productversionNode = headerNode.addElement('ProductVersion').addTextNode(productversion);
	// var selectioncriteriaNode = headerNode.addElement('SelectionCriteria');
	// var taxreportingjurisdictionNode = selectioncriteriaNode.addElement('TaxReportingJurisdiction').addTextNode(TaxReportingJurisdiction);
	// var companyentityNode = selectioncriteriaNode.addElement('CompanyEntity').addTextNode(CompanyEntity);
	// var selectionstartdateNode = selectioncriteriaNode.addElement('SelectionStartDate').addTextNode(SelectionStartDate);
	// var selectionenddateNode = selectioncriteriaNode.addElement('SelectionEndDate').addTextNode(SelectionEndDate);
	// var periodstartNode = selectioncriteriaNode.addElement('PeriodStart').addTextNode(PeriodStart);
	// var periodendNode = selectioncriteriaNode.addElement('PeriodEnd').addTextNode(PeriodEnd);
	// var documenttypeNode = selectioncriteriaNode.addElement('DocumentType').addTextNode(DocumentType);
	// var headercommentNode = headerNode.addElement('HeaderComment').addTextNode(headercomment);

    return headerNode;
}



/********************************** 
	<MasterFiles> xml tag
**********************************/
/* Function that adds the MasterFiles element */
function addMasterFiles(xml, banDoc, startDate, endDate) {

	/*
	<MasterFiles>
		<GeneralLedger></GeneralLedger>
		<Customer></Customer>
		<Supplier></Supplier>
		<TaxTable></TaxTable>
	</MasterFiles>
	*/

	var masterfilesNode = xml.addElement('MasterFiles');

	// Add GeneralLedger element
	var generalLedger = addGeneralLedger(masterfilesNode, banDoc);
	
	// Add Customer element
	var cusomer = addCustomer(masterfilesNode, banDoc);
    
	// Add Supplier element
    var supplier = addSupplier(masterfilesNode, banDoc);
    
    // Add TaxTable element
    var taxtable = addTaxTable(masterfilesNode, banDoc);

	return masterfilesNode;
}

/* Function that adds the GeneralLedger element */
function addGeneralLedger(xml, banDoc) {

	/*
	<GeneralLedger>
		<AccountID></AccountID>
		<AccountDescription></AccountDescription>
		<AccountType></AccountType>
		<AccountID_oeEKR></AccountID_oeEKR>
		<AccountDescription_oeEKR></AccountDescription_oeEKR>
		<BalanceSheetItemCode></BalanceSheetItemCode>
		<BalanceSheetItemDescription></BalanceSheetItemDescription>
		<LeadCode></LeadCode>
		<LeadDescription></LeadDescription>
		<OpeningDebitBalance></OpeningDebitBalance>
		<OpeningCreditBalance></OpeningCreditBalance>
	</GeneralLedger>
	*/

    //Get the customers and suppliers group to exclude them from the accounts to take
    var customersGroup = banDoc.info('AccountingDataBase','CustomersGroup');
    var suppliersGroup = banDoc.info('AccountingDataBase','SuppliersGroup');

    var accLen = banDoc.table('Accounts').rowCount;
	for (var i = 0; i < accLen; i++) {
		var tRow = banDoc.table('Accounts').row(i);

		// General Ledger account code, description and type (Asset/Liability/Sale/Expense)
		var accountID = '';
		var accountDescription = '';
		var accountType = '';
		
		// Assignment of the account number to the corresponding account of the Austrian standard account framework
		var accountID_oeEKR = '';
		
		var accountDescription_oeEKR = '';
		var balanceSheetItemCode = '';
		var balanceSheetItemDescription = '';
		
		// Information on the HGB taxonomy used (XBRL) - international data field (there is currently no XBRL taxonomy in Austria)
		var leadCode = '';
		var leadDescription = '';
		
		// Opening debit/credit balances
		var openingDebitBalance = '';
		var openingCreditBalance = '';

		//Take only accounts
		if (tRow.value('Account') && 
			tRow.value('Account').substring(0,1) !== '.' &&
			tRow.value('Account').substring(0,1) !== ',' && 
			tRow.value('Account').substring(0,1) !== ';' &&
			tRow.value('Account').substring(0,1) !== ':' &&
			tRow.value('Gr') !== customersGroup &&
			tRow.value('Gr') !== suppliersGroup)
		{

	        accountID = tRow.value('Account');
	    	accountDescription = tRow.value('Description');

	    	if (!banDoc.table('Categories')) {
	    		if (tRow.value('BClass')) {
	    			var bclass = tRow.value('BClass');
	    			if (bclass === '1') {
	    				accountType = 'Asset';
	    			} else if (bclass === '2') {
	    				accountType = 'Liability';
	    			} else if (bclass === '3') {
	    				accountType = 'Expense';
	    			} else if (bclass === '4') {
	    				accountType = 'Sale';
	    			}
	    		}
	    	}

			if (tRow.value('Opening')) {
	        	if (Banana.SDecimal.sign(tRow.value('Opening')) == 1) {
		        	openingDebitBalance = tRow.value('Opening');
		        } else if (Banana.SDecimal.sign(tRow.value('Opening')) == -1) {
		        	openingCreditBalance = Banana.SDecimal.invert(tRow.value('Opening'));
		        }
        	}

			var generalLedgerNode = xml.addElement('GeneralLedger');
			var accountIDNode = generalLedgerNode.addElement('AccountID').addTextNode(accountID);
			var accountDescriptionNode = generalLedgerNode.addElement('AccountDescription').addTextNode(accountDescription);
			var accountTypeNode = generalLedgerNode.addElement('AccountType').addTextNode(accountType);
			var accountID_oeEKRNode = generalLedgerNode.addElement('AccountID_oeEKR').addTextNode(accountID_oeEKR);
			var accountDescription_oeEKRNode = generalLedgerNode.addElement('AccountDescription_oeEKR').addTextNode(accountDescription_oeEKR);
			var balanceSheetItemCodeNode = generalLedgerNode.addElement('BalanceSheetItemCode').addTextNode(balanceSheetItemCode);
			var balanceSheetItemDescriptionNode = generalLedgerNode.addElement('BalanceSheetItemDescription').addTextNode(balanceSheetItemDescription);
			var leadCodeNode = generalLedgerNode.addElement('LeadCode').addTextNode(leadCode);
			var leadDescriptionNode = generalLedgerNode.addElement('LeadDescription').addTextNode(leadDescription);

			if (openingDebitBalance) {
				var openingDebitBalanceNode = generalLedgerNode.addElement('OpeningDebitBalance').addTextNode(openingDebitBalance);
			}
			else if (openingCreditBalance) {
				var openingCreditBalanceNode = generalLedgerNode.addElement('OpeningCreditBalance').addTextNode(openingCreditBalance);
			}
			else { //in case there are not opening balances we set debit opening 0.00
				var openingDebitBalanceNode = generalLedgerNode.addElement('OpeningDebitBalance').addTextNode('0.00');
			}
		}
	}

	return generalLedgerNode;
}

/* Function that adds the Customer element */
function addCustomer(xml, banDoc) {
	/*
	<Customer>
		<AccountID></AccountID>
		<CustomerID></CustomerID>
		<CustomerName></CustomerName>
		<CustomerTaxID>
			<TaxID></TaxID>
			<TaxType></TaxType>
			<TaxCode></TaxCode>
			<TaxVerificationDate></TaxVerificationDate>
		</CustomerTaxID>
		<ContactInformation>
			<Contact></Contact>
			<Telephone></Telephone>
			<Fax></Fax>
			<Email></Email>
			<Website></Website>
		</ContactInformation>
		<BillingAddress>
			<BuildingNumber></BuildingNumber>
			<StreetName></StreetName>
			<AddressDetail></AddressDetail>
			<City></City>
			<PostalCode></PostalCode>
			<Region></Region>
			<Country></Country>
		</BillingAddress>
		<ShipToAddress></ShipToAddress>
		<SelfBillingIndicator></SelfBillingIndicator>
	</Customer>
	*/

	var customersGroup = banDoc.info('AccountingDataBase','CustomersGroup');
	if (customersGroup) {

		var mapGroup = {};
		loadMapGroup(banDoc, mapGroup);

		var len = banDoc.table('Accounts').rowCount;
		for (var i = 0; i < len; i++) {

			var tRow = banDoc.table('Accounts').row(i);
			if (tRow.value('Gr') === customersGroup || groupBelongToGroup(mapGroup, tRow.value('Gr'), customersGroup)) {

				var accountID = '';
				var customerID = '';
				var customerName = '';
				var contactInformation = '';
				// var taxID = '';
				// var taxType = '';
				// var taxCode = '';
				// var taxVerificationDate = '';

				accountID = tRow.value('Account');

			    var contact = '';
			    if (tRow.value('FirstName') && tRow.value('FamilyName')) {
			    	customerName = tRow.value('FirstName') + " " + tRow.value('FamilyName');
			    	contact = tRow.value('FirstName') + " " + tRow.value('FamilyName');
			    } else if (tRow.value('OrganisationName')) {
			    	customerName = tRow.value('OrganisationName');
			    	contact = tRow.value('OrganisationName');
			    }
			    var telephone = '';
			    if (tRow.value('PhoneMain')) {
			    	telephone = tRow.value('PhoneMain');
			    }
			    var fax = '';
			    if (tRow.value('Fax')) {
			    	fax = tRow.value('Fax');
			    }
			    var email = '';
			    if (tRow.value('EmailWork')) {
			    	email = tRow.value('EmailWork');
			    }
			    var website = '';
			    if (tRow.value('Website')) {
			    	website = tRow.value('Website');
			    }

				// BillingAddress
			    var buildingnumber = '';
			    var streetname = '';
			    var addressdetail = '';
			    if (tRow.value('Street')) {
			    	streetname = tRow.value('Street');
			    }
			    if (tRow.value('AddressExtra')) {
			    	streetname += ", " + tRow.value('AddressExtra');
			    }
			    var city = '';
			    if (tRow.value('Locality')) {
			    	city = tRow.value('Locality');
			    }
			    var postalcode = '';
			    if (tRow.value('PostalCode')) {
			    	postalcode = tRow.value('PostalCode');
			    }
			    var region = '';
			    if (tRow.value('Region')) {
			    	region = tRow.value('Region');
			    }
			    var country = '';
			    if (tRow.value('Country')) {
			    	country = tRow.value('Country');
			    }

			    var selfBillingIndicator = '';

			    var customerNode = xml.addElement('Customer');
				var accountIDNode = customerNode.addElement('AccountID').addTextNode(accountID);
				var customerIDNode = customerNode.addElement('CustomerID').addTextNode(customerID);
				var customerNameNode = customerNode.addElement('CustomerName').addTextNode(customerName);
				// var customerTaxIDNode = customerNode.addElement('CustomerTaxID');
				// var taxIDNode = customerTaxIDNode.addElement('TaxID').addTextNode(taxID);
				// var taxTypeNode = customerTaxIDNode.addElement('TaxType').addTextNode(taxType);
				// var taxCodeNode = customerTaxIDNode.addElement('TaxCode').addTextNode(taxCode);
				// var taxVerificationDateNode = customerTaxIDNode.addElement('TaxVerificationDate').addTextNode(taxVerificationDate);
				var contactInformationNode = customerNode.addElement('ContactInformation');
				var contactNode = contactInformationNode.addElement('Contact').addTextNode(contact);
				var telephoneNode = contactInformationNode.addElement('Telephone').addTextNode(telephone);
				var faxNode = contactInformationNode.addElement('Fax').addTextNode(fax);
				var emailNode = contactInformationNode.addElement('Email').addTextNode(email);
				var websiteNode = contactInformationNode.addElement('Website').addTextNode(website);
				var billingAddressNode = customerNode.addElement('BillingAddress');
				var buildingNumberNode = billingAddressNode.addElement('BuildingNumber').addTextNode(buildingnumber);
				var streetNameNode = billingAddressNode.addElement('StreetName').addTextNode(streetname);
				var addressDetailNode = billingAddressNode.addElement('AddressDetail').addTextNode(addressdetail);
				var cityNode = billingAddressNode.addElement('City').addTextNode(city);
				var postalCodeNode = billingAddressNode.addElement('PostalCode').addTextNode(postalcode);
				var regionNode = billingAddressNode.addElement('Region').addTextNode(region);
				var countryNode = billingAddressNode.addElement('Country').addTextNode(country);
				//var shipToAddressNode = customerNode.addElement('ShipToAddress');
				var selfBillingIndicatorNode = customerNode.addElement('SelfBillingIndicator').addTextNode(selfBillingIndicator);
			}
		}
	
		return customerNode;
	}
	// No customers
	else {
		return;
	}
}

/* Function that adds the Supplier element */
function addSupplier(xml, banDoc) {
	/*
	<Supplier>
		<AccountID></AccountID>
		<SupplierID></SupplierID>
		<SupplierName></SupplierName>
		<SupplierTaxID>
			<TaxID></TaxID>
			<TaxType></TaxType>
			<TaxCode></TaxCode>
			<TaxVerificationDate></TaxVerificationDate>
		</SupplierTaxID>
		<ContactInformation>
			<Contact></Contact>
			<Telephone></Telephone>
			<Fax></Fax>
			<Email></Email>
			<Website></Website>
		</ContactInformation>
		<Address>
			<BuildingNumber></BuildingNumber>
			<StreetName></StreetName>
			<AddressDetail></AddressDetail>
			<City></City>
			<PostalCode></PostalCode>
			<Region></Region>
			<Country></Country>
		</Address>
		<ShipToAddress></ShipToAddress>
		<SelfBillingIndicator></SelfBillingIndicator>
	</Supplier>
	*/

	var suppliersGroup = banDoc.info('AccountingDataBase','SuppliersGroup');
	if (suppliersGroup) {

		var mapGroup = {};
		loadMapGroup(banDoc, mapGroup);

		var len = banDoc.table('Accounts').rowCount;
		for (var i = 0; i < len; i++) {

			var tRow = banDoc.table('Accounts').row(i);
			if (tRow.value('Gr') === suppliersGroup || groupBelongToGroup(mapGroup, tRow.value('Gr'), suppliersGroup)) {

				var accountID = '';
				var supplierID = '';
				var supplierName = '';
				var contactInformation = '';

				accountID = tRow.value('Account');

			    var contact = '';
			    if (tRow.value('FirstName') && tRow.value('FamilyName')) {
			    	supplierName = tRow.value('FirstName') + " " + tRow.value('FamilyName');
			    	contact = tRow.value('FirstName') + " " + tRow.value('FamilyName');
			    } else if (tRow.value('OrganisationName')) {
			    	supplierName = tRow.value('OrganisationName');
			    	contact = tRow.value('OrganisationName');
			    }
			    var telephone = '';
			    if (tRow.value('PhoneMain')) {
			    	telephone = tRow.value('PhoneMain');
			    }
			    var fax = '';
			    if (tRow.value('Fax')) {
			    	fax = tRow.value('Fax');
			    }
			    var email = '';
			    if (tRow.value('EmailWork')) {
			    	email = tRow.value('EmailWork');
			    }
			    var website = '';
			    if (tRow.value('Website')) {
			    	website = tRow.value('Website');
			    }

				// Address
			    var buildingnumber = '';
			    var streetname = '';
			    var addressdetail = '';
			    if (tRow.value('Street')) {
			    	streetname = tRow.value('Street');
			    }
			    if (tRow.value('AddressExtra')) {
			    	streetname += ", " + tRow.value('AddressExtra');
			    }
			    var city = '';
			    if (tRow.value('Locality')) {
			    	city = tRow.value('Locality');
			    }
			    var postalcode = '';
			    if (tRow.value('PostalCode')) {
			    	postalcode = tRow.value('PostalCode');
			    }
			    var region = '';
			    if (tRow.value('Region')) {
			    	region = tRow.value('Region');
			    }
			    var country = '';
			    if (tRow.value('Country')) {
			    	country = tRow.value('Country');
			    }

			    var selfBillingIndicator = '';

			    var supplierNode = xml.addElement('Supplier');
				var accountIDNode = supplierNode.addElement('AccountID').addTextNode(accountID);
				var supplierIDNode = supplierNode.addElement('SupplierID').addTextNode(supplierID);
				var supplierNameNode = supplierNode.addElement('SupplierName').addTextNode(supplierName);
				//var supplierTaxIDNode = supplierNode.addElement('SupplierTaxID');
				var contactInformationNode = supplierNode.addElement('ContactInformation');
				var contactNode = contactInformationNode.addElement('Contact').addTextNode(contact);
				var telephoneNode = contactInformationNode.addElement('Telephone').addTextNode(telephone);
				var faxNode = contactInformationNode.addElement('Fax').addTextNode(fax);
				var emailNode = contactInformationNode.addElement('Email').addTextNode(email);
				var websiteNode = contactInformationNode.addElement('Website').addTextNode(website);
				var addressNode = supplierNode.addElement('Address');
				var buildingNumberNode = addressNode.addElement('BuildingNumber').addTextNode(buildingnumber);
				var streetNameNode = addressNode.addElement('StreetName').addTextNode(streetname);
				var addressDetailNode = addressNode.addElement('AddressDetail').addTextNode(addressdetail);
				var cityNode = addressNode.addElement('City').addTextNode(city);
				var postalCodeNode = addressNode.addElement('PostalCode').addTextNode(postalcode);
				var regionNode = addressNode.addElement('Region').addTextNode(region);
				var countryNode = addressNode.addElement('Country').addTextNode(country);
				//var shipToAddressNode = supplierNode.addElement('ShipToAddress');
				var selfBillingIndicatorNode = supplierNode.addElement('SelfBillingIndicator').addTextNode(selfBillingIndicator);
			}
		}

		return supplierNode;
	}
	// No suppliers
	else {
		return;
	}
}

/* Function that checks the belonging of the groups */
function groupBelongToGroup(mapGroup, current, find, start) {

	if (!start) {
		start = current;
	}

	if (!current) {
		return false;
	}

	if (!find) {
		return false;
	}

	if (mapGroup[current].parent === find) {
		return true;
	}

	if (mapGroup[current].parent === start) {
		return false;
	}

	return groupBelongToGroup(mapGroup, mapGroup[current].parent, find, start);
}

/* The function creates an array of group values for the given group */
function loadMapGroup(banDoc, mapGroup) {
	var len = banDoc.table('Accounts').rowCount;
	for (var i = 0; i < len; i++) {
		var tRow = banDoc.table('Accounts').row(i);
		if (tRow.value('Group')) {
			//mapGroup[tRow.value('Group')].parent = tRow.value('Gr');
			mapGroup[tRow.value('Group')] = {'parent' : tRow.value('Gr')}
		}
	}
}

/* The function adds the TaxTable element */
function addTaxTable(xml, banDoc) {

	/*
	<TaxTable>
		<TaxType></TaxType>
		<Description></Description>
		<TaxCodeDetails>
			<TaxCode></TaxCode>
			<Description></Description>
			<TaxPercentage></TaxPercentage>
			<EffectiveDate></EffectiveDate>
		</TaxCodeDetails>
	</TaxTable>
	*/

	// Tax type for look-up in tables
	var taxType = '';
	var descriptionT = '';
	var taxCode = '';
	var descriptionD = '';
	var taxPercentage = '';
	//var effectiveDate = '';

    //If the table VatCodes exists we take the values
    if (banDoc.table("VatCodes")) {
    	var taxTableNode = xml.addElement('TaxTable');
    	var taxTypeNode = taxTableNode.addElement('TaxType').addTextNode(taxType);
		var descriptionT = taxTableNode.addElement('Description').addTextNode(descriptionT);

	    var vatCodesTable = banDoc.table("VatCodes");
	    for (var i = 0; i < vatCodesTable.rowCount; i++) {
	        var tRow = vatCodesTable.row(i);

	        if (tRow.value("VatCode")) {
		        taxCode = tRow.value("VatCode");
		        descriptionD = tRow.value("Description");
		        
		        if (tRow.value("VatRate")) {
		        	taxPercentage = tRow.value("VatRate");
		    	} else {
		    		taxPercentage = "0.00";
		    	}
		        
		        var taxCodeDetailsNode = taxTableNode.addElement('TaxCodeDetails');
		        var taxCodeNode = taxCodeDetailsNode.addElement('TaxCode').addTextNode(taxCode);
		        var descriptionDNode = taxCodeDetailsNode.addElement('Description').addTextNode(descriptionD);
		        var taxPercentageNode = taxCodeDetailsNode.addElement('TaxPercentage').addTextNode(taxPercentage);
		        //var effectiveDateNode = taxCodeDetailsNode.addElement('EffectiveDate').addTextNode(effectiveDate);
	    	}
	    }
	}

	return taxTableNode;
}



/********************************** 
	<GeneralLedgerEntries> xml tag
**********************************/
/* Function that adds the GeneralLedgerEntries element */
function addGeneralLedgerEntries(xml, banDoc, startDate, endDate) {

	/*
	<GeneralLedgerEntries>
		<NumberOfEntries></NumberOfEntries>
		<TotalDebit></TotalDebit>
		<TotalCredit></TotalCredit>
		<Journal>
			<JournalID></JournalID>
			<Description></Description>
			<Type></Type>
			<Transaction>
				<GLPostingDate></GLPostingDate>
				<TransactionDate></TransactionDate>
				<Period></Period>
				<TransactionCode></TransactionCode>
				<TransactionID></TransactionID>
				<Description></Description>
				<CompanyCode></CompanyCode>
				<CustomerID></CustomerID>
				<SupplierID></SupplierID>
				<BatchID></BatchID>
				<SourceID></SourceID>
				<SystemID></SystemID>
				<Line>
					...
				</Line>
			</Transaction>
		</Journal>
	</GeneralLedgerEntries>
	*/

	// Number of entries
	var numberOfEntries = '';
	
	// The total of all debit amounts
	var totalDebit = '';
	
	// The total of all credit amounts
	var totalCredit = '';

	numberOfEntries = getTotalRowsTransactions(banDoc, startDate, endDate);
	totalDebit = getTotalDebitTransactions(banDoc, startDate, endDate);
	totalCredit = getTotalCreditTransactions(banDoc, startDate, endDate);

	// Source GL journal identifier
	var journalID = '1';
	var descriptionJ = 'Journal 1';
	var type = 'Transaction';

	var generalLEdgerEntriesNode = xml.addElement('GeneralLedgerEntries');
	var numberOfEntriesNode = generalLEdgerEntriesNode.addElement('NumberOfEntries').addTextNode(numberOfEntries);
	var totalDebitNode = generalLEdgerEntriesNode.addElement('TotalDebit').addTextNode(totalDebit);
	var totalCreditNode = generalLEdgerEntriesNode.addElement('TotalCredit').addTextNode(totalCredit);
	var journalNode = generalLEdgerEntriesNode.addElement('Journal');
	var journalIDNode = journalNode.addElement('JournalID').addTextNode(journalID);
	var descriptionJNode = journalNode.addElement('Description').addTextNode(descriptionJ);
	var typeNode = journalNode.addElement('Type').addTextNode(type);


	/* Create transaction element */
	var journal = banDoc.journal(banDoc.ORIGINTYPE_CURRENT, banDoc.ACCOUNTTYPE_NORMAL);
	var transactionNode = '';
	var trLineNode = '';
	var tmpTransactionGroup = '';
	var len = journal.rowCount;
	var transactionCreated = false;

	//Read each row of the table
	for (var i = 0; i < len; i++) {
		var tRow = journal.row(i);

		//From the journal we take only transactions rows between the period
		if (tRow.value('JOperationType') == banDoc.OPERATIONTYPE_TRANSACTION && tRow.value('JDate') >= startDate && tRow.value('JDate') <= endDate) {

			//The row doesn't belongs to any previous transaction
			//In this case we have to create a new transaction with all the lines belonging to it
			if (tmpTransactionGroup !== tRow.value('JContraAccountGroup')) {

				//transaction element has not been created yet, so we create it
				if (!transactionCreated) {

					var gLPostingDate = '';   // Posting date
					var transactionDate = ''; // Document date
					var period = '';		  // Posting date period
					//var transactionCode = ''; // Document Number Range
					var transactionID = '';	  // Transaction number
					var descriptionT = '';	  // Transaction description
					// var companyCode = '';	  // Company code, payroll area
					// var customerID = '';	  // Unique code for the customer
					// var supplierID = '';	  // Unique code for the supplier
					// var batchID = '';		  // Systems generated ID for batch
					// var sourceID = '';		  // Details of person or application entered the transaction
					// var systemID = '';		  // Unique number created by the system for the document

					transactionID = tRow.value('JRowOrigin');
					descriptionT = tRow.value('JDescription');
					gLPostingDate = tRow.value('JDate');
					transactionDate = tRow.value('JDate');

					if (transactionDate.substring(5,7) === '01') {
						period = '1';
					} else if (transactionDate.substring(5,7) === '02') {
						period = '2';
					} else if (transactionDate.substring(5,7) === '03') {
						period = '3';
					} else if (transactionDate.substring(5,7) === '04') {
						period = '4';
					} else if (transactionDate.substring(5,7) === '05') {
						period = '5';
					} else if (transactionDate.substring(5,7) === '06') {
						period = '6';
					} else if (transactionDate.substring(5,7) === '07') {
						period = '7';
					} else if (transactionDate.substring(5,7) === '08') {
						period = '8';
					} else if (transactionDate.substring(5,7) === '09') {
						period = '9';
					} else if (transactionDate.substring(5,7) === '10') {
						period = '10';
					} else if (transactionDate.substring(5,7) === '11') {
						period = '11';
					} else if (transactionDate.substring(5,7) === '12') {
						period = '12';
					}

					transactionNode = journalNode.addElement('Transaction');
					var gLPostingDateNode = transactionNode.addElement('GLPostingDate').addTextNode(gLPostingDate);
					var transactionDateNode = transactionNode.addElement('TransactionDate').addTextNode(transactionDate);
					var periodNode = transactionNode.addElement('Period').addTextNode(period);
					//var transactionCodeNode = transactionNode.addElement('TransactionCode').addTextNode(transactionCode);
					var transactionIDNode = transactionNode.addElement('TransactionID').addTextNode(transactionID);
					var descriptionTNode = transactionNode.addElement('Description').addTextNode(descriptionT);
					// var companyCodeNode = transactionNode.addElement('CompanyCode').addTextNode(companyCode);
					// var customerIDNode = transactionNode.addElement('CustomerID').addTextNode(customerID);
					// var supplierIDNode = transactionNode.addElement('SupplierID').addTextNode(supplierID);
					// var batchIDNode = transactionNode.addElement('BatchID').addTextNode(batchID);
					// var sourceIDNode = transactionNode.addElement('SourceID').addTextNode(sourceID);
					// var systemIDNode = transactionNode.addElement('SystemID').addTextNode(systemID);

					//Reset value of the lines text
					trLineNode = '';

					//transaction element now has been created
					transactionCreated = true;
				}

				//Everytime there is a new transaction, we save the new JContraAccountGroup value.
				//We will use it to determine if the next row belongs to the same transaction or not.
				tmpTransactionGroup = tRow.value('JContraAccountGroup');
			}

			//The row belongs to the same (previous) transaction
			else if (tmpTransactionGroup === tRow.value('JContraAccountGroup')) {
				//We set the value of the variable to false, to indicate that the transaction <element> could be created:
				//this only if the JContraAccountGroup value of the next row is different from the current one
				transactionCreated = false;
			}

			//In every case, independently from the 'If...Else Statements', for each transactions rows we create the <Line> element
			trLineNode = createTransactionLine(tRow, transactionNode, banDoc, startDate, endDate);
		}
	}

	return generalLEdgerEntriesNode;
}

/* Function that creates the trLine xml element */
function createTransactionLine(tRow, transactionNode, banDoc, startDate, endDate) {
	
	/*
	<Line>
		<RecordID></RecordID>
		<AccountID></AccountID>
		<ValutaDate></ValutaDate>
		<PostingText></PostingText>
		<Analysis></Analysis>
		<SourceDocumentID></SourceDocumentID>
		<SystemEntryDate></SystemEntryDate>
		or <DebitAmount></DebitAmount>
		or <CreditAmount></CreditAmount>
		<Tax>
			<TaxType></TaxType>
			<TaxCode></TaxCode>
			
			<Currency>
				<CurrencyCode></CurrencyCode>
				or <ExchangeRate></ExchangeRate>
				or <CurrencyDebitAmount></CurrencyDebitAmount>
				or <CurrencyCreditAmount></CurrencyCreditAmount>
			</Currency>

			<TaxPercentage></TaxPercentage>
			<TaxAmount></TaxAmount>
			<TaxExemptionReason></TaxExemptionReason>
			<SysInfo></SysInfo>
		</Tax>
		<Currency></Currency>
		<CostAccounting>
			<CostCenter></CostCenter>
			<CostUnit></CostUnit>
			<CostType></CostType>
			<Amount></Amount>
			
			<Currency>
				<CurrencyCode></CurrencyCode>
				or <ExchangeRate></ExchangeRate>
				or <CurrencyDebitAmount></CurrencyDebitAmount>
				or <CurrencyCreditAmount></CurrencyCreditAmount>
			</Currency>

		</CostAccounting>
	</Line>
	*/

	var recordID = '';         // Identifier to trace entry to journal line or posting reference
	var accountID = '';		   // General ledger account code
	var sourceDocumentID = ''; // Source document number to which line relates
	//var valutaDate = '';       // Enter value date, if deviation from document date
	var postingText = '';	   // Booking text
	var systemEntryDate = '';  // Date captured by system
	var debitAmount = '';      // Debit amount for transaction
	var creditAmount = '';     // Credit amount for transaction

	var recordID = tRow.value('JRowOrigin');
	var accountID = tRow.value('JAccount');
	var sourceDocumentID = tRow.value('Doc');
	var postingText = tRow.value('JAccountDescription');
	var systemEntryDate = tRow.value('JDate');

    //Get values vat element
    if (tRow.value('VatCode')) {

		var taxType = '';              // Tax type for look-up in tables
		var taxCode = '';			   // Tax Code for lookup in tables
		var currency = '';			   // Tax Currency - no entry means local currency
		var taxPercentage = '';        // Tax percentage
		var taxAmount = '';            // Tax amount
		var taxExemptionReason = '';   // Tax exemption or reduction reason or rationale
		var sysInfo = '';			   // System Information and controls - generic holder for information on above
		var currencyCode = '';         // Currency Code (3 Char ISO) or local currency which accounts are audited in
		var exchangeRate = '';         // Exchange rate where applicable. Attribute CalculationType D=Divide, M=Multiply
		var currencyDebitAmount = '';  // Amount in foreign currency (instead of exchange rate)
		var currencyCreditAmount = ''; // Amount in foreign currency (instead of exchange rate)

	    taxCode = tRow.value('VatCode');

		if (tRow.value('VatRate')) {
			taxPercentage = Banana.SDecimal.abs(tRow.value('VatRate'));
		} else {
			taxPercentage = '0.00';
		}

		if (tRow.value('VatPosted')) {
			taxAmount = tRow.value('VatPosted');
		} else {
			taxAmount = '0.00';
		}

		// If not local currency
		if (tRow.value('JTransactionCurrency') !== banDoc.info("AccountingDataBase", "BasicCurrency")) {
			currencyCode = tRow.value('JTransactionCurrency');
		}
	}
	
	var amnt = tRow.value('JAmount');
	Banana.console.log(amnt);

	//If the transaction line has an Amount, then we retrieve the data
	if (amnt) {
		
		if (Banana.SDecimal.sign(amnt) >= 0) {
			debitAmount = amnt;
		} else if (Banana.SDecimal.sign(amnt) < 0) {
			creditAmount = Banana.SDecimal.invert(amnt);
		}

		var lineNode = transactionNode.addElement('Line');
		var recordIDNode = lineNode.addElement('RecordID').addTextNode(recordID);
		var accountIDNode = lineNode.addElement('AccountID').addTextNode(accountID);
		//var valutaDateNode = lineNode.addElement('ValutaDate').addTextNode(valutaDate);
		var postingTextNode = lineNode.addElement('PostingText').addTextNode(postingText);
		var analysisNode = lineNode.addElement('Analysis');
		var sourceDocumentIDNode = lineNode.addElement('SourceDocumentID').addTextNode(sourceDocumentID);
		var systemEntryDateNode = lineNode.addElement('SystemEntryDate').addTextNode(systemEntryDate);
		
		if (debitAmount) {
			var debitAmountNode = lineNode.addElement('DebitAmount').addTextNode(debitAmount);
		} else if (creditAmount) {
			var creditAmountNode = lineNode.addElement('CreditAmount').addTextNode(creditAmount);
		}

		//vat element only if there is a vat code (taxCode) on the transaction
		if (taxCode) {
			var taxNode = lineNode.addElement('Tax');
			var taxTypeNode = taxNode.addElement('TaxType').addTextNode(taxType);
			var taxCodeNode = taxNode.addElement('TaxCode').addTextNode(taxCode);

			// // If not local currency
			// if (tRow.value('JTransactionCurrency') !== banDoc.info("AccountingDataBase", "BasicCurrency")) {
			// 	var currencyNode = taxNode.addElement('Currency');
			// 	var currencyCodeNode = currencyNode.addElement('CurrencyCode').addTextNode(currencyCode);
			// 	var exchangeRateNode = currencyNode.addElement('ExchangeRate').addTextNode(exchangeRate);
			// 	var currencyDebitAmountNode = currencyNode.addElement('CurrencyDebitAmount').addTextNode(currencyDebitAmount);
			// 	var currencyCreditAmountNode = currencyNode.addElement('CurrencyCreditAmount').addTextNode(currencyCreditAmount);
			// }
			
			var taxPercentageNode = taxNode.addElement('TaxPercentage').addTextNode(taxPercentage);
			var taxAmountNode = taxNode.addElement('TaxAmount').addTextNode(Banana.SDecimal.abs(taxAmount));
			var taxExemptionReasonNode = taxNode.addElement('TaxExemptionReason').addTextNode(taxExemptionReason);
			var sysInfoNode = taxNode.addElement('SysInfo').addTextNode(sysInfo);
		}

		// // If not local currency
		if (tRow.value('JTransactionCurrency') !== banDoc.info("AccountingDataBase", "BasicCurrency")) {
			
			var currencyNode = lineNode.addElement('Currency');
			var currencyCodeNode = currencyNode.addElement('CurrencyCode').addTextNode(tRow.value('JTransactionCurrency'));
			

			// or exchangerate or currencyDebitAmount or currencyCreditAmount
			
			//var exchangeRateNode = currencyNode.addElement('ExchangeRate').addTextNode(tRow.value(ExchangeRate));
		 	var jAmountTransactionCurrency = tRow.value('JAmountTransactionCurrency');
			if (jAmountTransactionCurrency >= 0) {
				var currencyDebitAmount = jAmountTransactionCurrency;
				var currencyDebitAmountNode = currencyNode.addElement('CurrencyDebitAmount').addTextNode(currencyDebitAmount);
			} else {
				var currencyCreditAmount = Banana.SDecimal.abs(jAmountTransactionCurrency);
				var currencyCreditAmountNode = currencyNode.addElement('CurrencyCreditAmount').addTextNode(currencyCreditAmount);
			} 
		}

		// Cost centers??
		// var costAccountingNode = lineNode.addElement('CostAccounting');
		// var costCenterNode = costAccountingNode.addElement('CostCenter').addTextNode('');
		// var costUnitNode = costAccountingNode.addElement('CostUnit').addTextNode('');
		// var costTypeNode = costAccountingNode.addElement('CostType').addTextNode('');
		// var amountNode = costAccountingNode.addElement('Amount').addTextNode('');
		
		// // If not local currency
		// if (tRow.value('JTransactionCurrency') !== banDoc.info("AccountingDataBase", "BasicCurrency")) {
		// 	var currencyNode = costAccountingNode.addElement('Currency');
		//	...
		// }

	}
	
	//return trLine element
	return lineNode;
}

/* Function that gets the total rows used for the transactions */
function getTotalRowsTransactions(banDoc, startDate, endDate) {
	var journal = banDoc.journal(banDoc.ORIGINTYPE_CURRENT, banDoc.ACCOUNTTYPE_NORMAL);
	var len = journal.rowCount;
	var rows = 0;
	var tmpGroup;

	for (var i = 0; i < len; i++) {
		var tRow = journal.row(i);

		//Transactions between the defined period
		if (tRow.value('JOperationType') == banDoc.OPERATIONTYPE_TRANSACTION && tRow.value('JDate') >= startDate && tRow.value('JDate') <= endDate) {
			
			//The row doesn't belongs to any previous transaction
			//In this case we have to create a new transaction with all the lines belonging to it
			if (tmpGroup != tRow.value('JContraAccountGroup')) {
							
				//Increase the transaction's counter
				rows++;

				//Save the new JContraAccountGroup value, and use it to determine if the next row belongs to the same transaction or not
				tmpGroup = tRow.value('JContraAccountGroup');
			}
			//else, the row belongs to the same (previous) transaction
		}
	}
	return rows;
}

/* Function that retrieves the total debit amount of the transactions */
function getTotalDebitTransactions(banDoc, startDate, endDate) {
	var journal = banDoc.journal(banDoc.ORIGINTYPE_CURRENT, banDoc.ACCOUNTTYPE_NORMAL);
	var len = journal.rowCount;
	var totDebit ='';

	for (var i = 0; i < len; i++) {
		var tRow = journal.row(i);

		//Transactions between the defined period
		if (tRow.value('JOperationType') == banDoc.OPERATIONTYPE_TRANSACTION && tRow.value('JDate') >= startDate && tRow.value('JDate') <= endDate) {
			
            // Debit
            if (Banana.SDecimal.sign(tRow.value('JAmount')) > 0 ) {
                totDebit = Banana.SDecimal.add(totDebit, tRow.value('JDebitAmount'), {'decimals':2});
            }
		}
	}

	return totDebit;
}

/* Function that retrieves the total credit amount of the transactions */
function getTotalCreditTransactions(banDoc, startDate, endDate) {
	var journal = banDoc.journal(banDoc.ORIGINTYPE_CURRENT, banDoc.ACCOUNTTYPE_NORMAL);
	var len = journal.rowCount;
	var totCredit = '';

	for (var i = 0; i < len; i++) {
		var tRow = journal.row(i);

		//Transactions between the defined period
		if (tRow.value('JOperationType') == banDoc.OPERATIONTYPE_TRANSACTION && tRow.value('JDate') >= startDate && tRow.value('JDate') <= endDate) {
			
            // Credit
            if (Banana.SDecimal.sign(tRow.value('JAmount')) < 0 ) {
                totCredit = Banana.SDecimal.add(totCredit, tRow.value('JCreditAmount'), {'decimals':2});
            }
		}
	}

	return totCredit;
}



/************************* 
	Other functions
*************************/
/* Create the name of the xml file using startDate and endDate (ex. "auditfile_nl_20180101_20180131.xml") */
function createFileName(startDate, endDate) {
    
    var fileName = "auditfile_at_";
    var currentDateString = "";
    var sDate = "";
    var yearStartDate = "";
    var monthStartDate = "";
    var dayStartDate = "";
    var eDate = "";
    var yearEndDate = "";
    var monthEndDate = "";
    var dayEndDate = "";

    //Start date string
    sDate = Banana.Converter.toDate(startDate.match(/\d/g).join(""));
    yearStartDate = sDate.getFullYear().toString();
    monthStartDate = (sDate.getMonth()+1).toString();
    if (monthStartDate.length < 2) {
        monthStartDate = "0"+monthStartDate;
    }
    dayStartDate = sDate.getDate().toString();
    if (dayStartDate.length < 2) {
        dayStartDate = "0"+dayStartDate;
    }

    //End date string
    eDate = Banana.Converter.toDate(endDate.match(/\d/g).join(""));
    yearEndDate = eDate.getFullYear().toString();
    monthEndDate = (eDate.getMonth()+1).toString();
    if (monthEndDate.length < 2) {
        monthEndDate = "0"+monthEndDate;
    }
    dayEndDate = eDate.getDate().toString();
    if (dayEndDate.length < 2) {
        dayEndDate = "0"+dayEndDate;
    }

    //Final date string
    currentDateString = yearStartDate+monthStartDate+dayStartDate+"_"+yearEndDate+monthEndDate+dayEndDate; 
    
    //Return the xml file name
    fileName += currentDateString;
    return fileName;
}

/* Save the xml file */
function saveData(output, startDate, endDate) {

    var fileName = createFileName(startDate, endDate);
    fileName = Banana.IO.getSaveFileName("Save as", fileName, "XML file (*.xml);;All files (*)");

    if (fileName.length) {
        var file = Banana.IO.getLocalFile(fileName);
        file.codecName = "UTF-8";
        file.write(output);
        if (file.errorString) {
            Banana.Ui.showInformation("Write error", file.errorString);
        }
        else {
        	var answer = Banana.Ui.showQuestion("XML Auditfile AT", "Show xml file?");
        	if (answer) {
        		Banana.IO.openUrl(fileName);
        	}
        }
    }
}

/* Get previously saved settings */
function getScriptSettings() {
   var data = Banana.document.getScriptSettings();
   //Check if there are previously saved settings and read them
   if (data.length > 0) {
       try {
           var readSettings = JSON.parse(data);
           //We check if "readSettings" is not null, then we fill the formeters with the values just read
           if (readSettings) {
               return readSettings;
           }
       } catch (e) {
       }
   }

   return {
      "selectionStartDate": "",
      "selectionEndDate": "",
      "selectionChecked": "false"
   }
}

/* The main purpose of this function is to allow the user to enter the accounting period desired and saving it for the next time the script is run
   Every time the user runs of the script he has the possibility to change the date of the accounting period */
function settingsDialog() {
    
    //The formeters of the period that we need
    var scriptform = getScriptSettings();
    
    //We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
    var docStartDate = Banana.document.startPeriod();
    var docEndDate = Banana.document.endPeriod();   
    
    //A dialog window is opened asking the user to insert the desired period. By default is the accounting period
    var selectedDates = Banana.Ui.getPeriod("Periode", docStartDate, docEndDate, 
        scriptform.selectionStartDate, scriptform.selectionEndDate, scriptform.selectionChecked);
        
    //We take the values entered by the user and save them as "new default" values.
    //This because the next time the script will be executed, the dialog window will contains the new values.
    if (selectedDates) {
        scriptform["selectionStartDate"] = selectedDates.startDate;
        scriptform["selectionEndDate"] = selectedDates.endDate;
        scriptform["selectionChecked"] = selectedDates.hasSelection;

        //Save script settings
        var formToString = JSON.stringify(scriptform);
        var value = Banana.document.setScriptSettings(formToString);       
    } else {
        //User clicked cancel
        return null;
    }
    return scriptform;
}

