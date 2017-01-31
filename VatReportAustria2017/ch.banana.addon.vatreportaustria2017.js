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
// @id = ch.banana.addon.vatreportaustria2017
// @api = 1.0
// @pubdate = 2017-01-30
// @publisher = Banana.ch SA
// @description = VAT report Austria 2017
// @task = app.command
// @doctype = 100.110;100.130
// @docproperties = austria
// @outputformat = none
// @inputdataform = none
// @timeout = -1




//Global variables
var form = [];
var param = {};



function loadParam(banDoc, startDate, endDate) {
	param = {
		"reportName":"VAT report Austria 2017",												//Save the report's name
		"bananaVersion":"Banana Accounting 8", 												//Save the version of Banana Accounting used
		"scriptVersion":"script v. 2017-01-30",				 								//Save the version of the script
		"fiscalNumber":banDoc.info("AccountingDataBase","FiscalNumber"),					//Save the fiscal number
		"startDate":startDate,																//Save the startDate that will be used to specify the accounting period starting date
		"endDate":endDate, 																	//Save the endDate that will be used to specify the accounting period ending date		
		"company":banDoc.info("AccountingDataBase","Company"), 								//Save the company name
		"address":banDoc.info("AccountingDataBase","Address1"), 							//Save the address
		"hausnummer":"", 																	//Save details
		"stiege":"",				 														//Save details
		"tuernummer":"", 																	//Save details
		"nation":banDoc.info("AccountingDataBase","Country"), 								//Save the country
		"telephone":banDoc.info("AccountingDataBase","Phone"), 								//Save the phone number
		"zip":banDoc.info("AccountingDataBase","Zip"), 										//Save the zip code
		"city":banDoc.info("AccountingDataBase","City"),									//Save the city
		"pageCounterText":"Seite",															//Save the text for the page counter
		"grColumn" : "Gr1",																	//Save the GR column (Gr1 or Gr2)
		"rounding" : 2,																		//Speficy the rounding type		
		"formatNumber":true 																//Choose if format number or not
	};
}


//This is the function that loads our parameterized structure.
//We create objects by adding some parameters that will be used to extract informations from Banana and to determine their behavior and purpose.
//The parameters are:
// - id: this is a UNIQUE id for each object contained in the structure
// - gr: this is the GR1 or GR2 contained in Banana (only for objects that will have an amount - totals excluded);
// - vatClass: 1 = Vorsteuer vatTaxable; 2 = Umsatzsteur vatTaxable; 3 = Vorsteuer vatPosted; 4 = Umsatzsteur vatPosted  
// - description: used to insert the desired text-description of the objects
// - sum: used to sum/subtract the amounts of the objects to calculate totals
function loadForm() {

	form.push({"id":"1.1", "description":"Finanzamtsnummer - Steuernummer"});	
	form.push({"id":"2.1", "description":"für den Kalendermonat"});		
	form.push({"id":"2.2", "description":""});	
	form.push({"id":"3.1", "description":"BEZEICHNUNG DES UNTERNEHMENS (BLOCKSCHRIFT)"});
	form.push({"id":"3.2", "description":"STRASSE (BLOCKSCHRIFT)"});
	form.push({"id":"3.3", "description":"Hausnummer"});
	form.push({"id":"3.4", "description":"Stiege"});
	form.push({"id":"3.5", "description":"Türnummer"});
	form.push({"id":"3.6", "description":"Land"});
	form.push({"id":"3.7", "description":"Telefonnummer"});
	form.push({"id":"3.8", "description":"Postleitzahl"});
	form.push({"id":"3.9", "description":"ORT (BLOCKSCHRIFT)"});

	form.push({"id":"4.1", "gr":"000", "vatClass":"2", "description":"Gesamtbetrag der Bemessungsgrundlage für Lieferungen und sonstige Leistungen (ohne den nachstehend angeführten Eigenverbrauch) einschließlich Anzahlungen (jeweils ohne Umsatzsteuer)"});	
	form.push({"id":"4.2", "gr":"001", "vatClass":"2", "description":"zuzüglich Eigenverbrauch (§ 1 Abs. 1 Z 2, § 3 Abs. 2 und § 3a Abs. 1a)"});
	form.push({"id":"4.3", "gr":"021", "vatClass":"2", "description":"abzüglich Umsätze, für die die Steuerschuld gemäß § 19 Abs. 1 zweiter Satz sowie gemäß § 19 Abs. 1a, 1b, 1c, 1d und 1e auf den Leistungsempfänger übergegangen ist."});
	form.push({"id":"4.4", "description":"SUMME", "sum":"4.1;4.2;-4.3"});
	form.push({"id":"4.5", "gr":"011", "vatClass":"2", "description":"§ 6 Abs. 1 Z 1 iVm § 7 (Ausfuhrlieferungen)"});
	form.push({"id":"4.6", "gr":"012", "vatClass":"2", "description":"§ 6 Abs. 1 Z 1 iVm § 8 (Lohnveredelungen)"});
	form.push({"id":"4.7", "gr":"015", "vatClass":"2", "description":"§ 6 Abs. 1 Z 2 bis 6 sowie § 23 Abs. 5 (Seeschifffahrt, Luftfahrt, grenzüberschreitende Personenbeförderung, Diplomaten, Reisevorleistungen im Drittlandsgebiet usw.)."});
	form.push({"id":"4.8", "gr":"017", "vatClass":"2", "description":"Art. 6 Abs. 1 (innergemeinschaftliche Lieferungen ohne die nachstehend gesondert anzuführenden Fahrzeuglieferungen)"});
	form.push({"id":"4.9", "gr":"018", "vatClass":"2", "description":"Art. 6 Abs. 1, sofern Lieferungen neuer Fahrzeuge an Abnehmer ohne UID-Nummer bzw. durch Fahrzeuglieferer gemäß Art. 2 erfolgten."});
	form.push({"id":"4.10", "gr":"019", "vatClass":"2", "description":"§ 6 Abs. 1 Z 9 lit. a (Grundstücksumsätze)"});
	form.push({"id":"4.11", "gr":"016", "vatClass":"2", "description":"§ 6 Abs. 1 Z 27 (Kleinunternehmer)"});		
	form.push({"id":"4.12", "gr":"020", "vatClass":"2", "description":"§ 6 Abs. 1 Z (übrige steuerfreie Umsätze ohne Vorsteuerabzug)"});
	form.push({"id":"4.13", "description":"Gesamtbetrag der steuerpflichtigen Lieferungen, sonstigen Leistungen und Eigenverbrauch (einschließlich steuerpflichtiger Anzahlungen)", "sum":"4.4;-4.5;-4.6;-4.7;-4.8;-4.9;-4.10;-4.11;-4.12"});
	
	form.push({"id":"4.14.1", "gr":"022", "vatClass":"2", "description":"20% Normalsteuersatz"});
	form.push({"id":"4.14.2", "gr":"022", "vatClass":"4", "description":"20% Normalsteuersatz"});
	form.push({"id":"4.15.1", "gr":"029", "vatClass":"2", "description":"10% ermäßigter Steuersatz"});
	form.push({"id":"4.15.2", "gr":"029", "vatClass":"4", "description":"10% ermäßigter Steuersatz"});		
	form.push({"id":"4.16.1", "gr":"006", "vatClass":"2", "description":"13% ermäßigter Steuersatz"});
	form.push({"id":"4.16.2", "gr":"006", "vatClass":"4", "description":"13% ermäßigter Steuersatz"});
	form.push({"id":"4.17.1", "gr":"037", "vatClass":"2", "description":"19% für Jungholz und Mittelberg"});
	form.push({"id":"4.17.2", "gr":"037", "vatClass":"4", "description":"19% für Jungholz und Mittelberg"});	
	form.push({"id":"4.18.1", "gr":"052", "vatClass":"2", "description":"10% Zusatzsteuer für pauschalierte land- und forstwirtschaftliche Betriebe"});
	form.push({"id":"4.18.2", "gr":"052", "vatClass":"4", "description":"10% Zusatzsteuer für pauschalierte land- und forstwirtschaftliche Betriebe"});
	form.push({"id":"4.19.1", "gr":"007", "vatClass":"2", "description":"7% Zusatzsteuer für pauschalierte land- und forstwirtschaftliche Betriebe"});
	form.push({"id":"4.19.2", "gr":"007", "vatClass":"4", "description":"7% Zusatzsteuer für pauschalierte land- und forstwirtschaftliche Betriebe"});
	form.push({"id":"4.20", "gr":"056", "vatClass":"4", "description":"Steuerschuld gemäß § 11 Abs. 12 und 14, § 16 Abs. 2 sowie gemäß Art. 7 Abs. 4"});
	form.push({"id":"4.21", "gr":"057", "vatClass":"4", "description":"Steuerschuld gemäß § 19 Abs. 1 zweiter Satz, § 19 Abs. 1c, 1e sowie gemäß Art. 25 Abs. 5"});		
	form.push({"id":"4.22", "gr":"048", "vatClass":"4", "description":"Steuerschuld gemäß § 19 Abs. 1a (Bauleistungen)"});			
	form.push({"id":"4.23", "gr":"044", "vatClass":"4", "description":"Steuerschuld gemäß § 19 Abs. 1b (Sicherungseigentum, Vorbehaltseigentum und Grundstücke im Zwangsversteigerungsverfahren)"});			
	form.push({"id":"4.24", "gr":"032", "vatClass":"4", "description":"Steuerschuld gemäß § 19 Abs. 1d (Schrott und Abfallstoffe)"});			
	form.push({"id":"4.25", "gr":"070", "vatClass":"2", "description":"Gesamtbetrag der Bemessungsgrundlagen für innergemeinschaftliche Erwerbe"});
	form.push({"id":"4.26", "gr":"071", "vatClass":"2", "description":"Davon steuerfrei gemäß Art. 6 Abs. 2"});
	form.push({"id":"4.27", "description":"Gesamtbetrag der steuerpflichtigen innergemeinschaftlichen Erwerbe", "sum":"4.25;-4.26"});		
	
	form.push({"id":"4.28.1", "gr":"072", "vatClass":"2", "description":"20% Normalsteuersatz"});
	form.push({"id":"4.28.2", "gr":"072", "vatClass":"4", "description":"20% Normalsteuersatz"});
	form.push({"id":"4.29.1", "gr":"073", "vatClass":"2", "description":"10% ermäßigter Steuersatz"});
	form.push({"id":"4.29.2", "gr":"073", "vatClass":"4", "description":"10% ermäßigter Steuersatz"});
	form.push({"id":"4.30.1", "gr":"008", "vatClass":"2", "description":"13% ermäßigter Steuersatz"});
	form.push({"id":"4.30.2", "gr":"008", "vatClass":"4", "description":"13% ermäßigter Steuersatz"});
	form.push({"id":"4.31.1", "gr":"088", "vatClass":"2", "description":"19% für Jungholz und Mittelberg"});
	form.push({"id":"4.31.2", "gr":"088", "vatClass":"4", "description":"19% für Jungholz und Mittelberg"});

	form.push({"id":"4.32", "gr":"076", "vatClass":"2", "description":"Erwerbe gemäß Art. 3 Abs. 8 zweiter Satz, die im Mitgliedstaat des Bestimmungslandes besteuert worden sind"});			
	form.push({"id":"4.33", "gr":"077", "vatClass":"2", "description":"Erwerbe gemäß Art. 3 Abs. 8 zweiter Satz, die gemäß Art. 25 Abs. 2 im Inland als besteuert gelten"});
	
	form.push({"id":"5.1", "gr":"060", "vatClass":"3", "description":"Gesamtbetrag der Vorsteuern (ohne die nachstehend gesondert anzuführenden Beträge)"});
	form.push({"id":"5.2", "gr":"061", "vatClass":"3", "description":"Vorsteuern betreffend die entrichtete Einfuhrumsatzsteuer (§ 12 Abs. 1 Z 2 lit. a)"});
	form.push({"id":"5.3", "gr":"083", "vatClass":"3", "description":"Vorsteuern betreffend die geschuldete, auf dem Abgabenkonto verbuchte Einfuhrumsatzsteuer (§ 12 Abs. 1 Z 2 lit. b)"});	
	form.push({"id":"5.4", "gr":"065", "vatClass":"3", "description":"Vorsteuern aus dem innergemeinschaftlichen Erwerb"});
	form.push({"id":"5.5", "gr":"066", "vatClass":"3", "description":"Vorsteuern betreffend die Steuerschuld gemäß § 19 Abs. 1 zweiter Satz, § 19 Abs. 1c, 1e sowie gemäß Art. 25 Abs. 5"});		
	form.push({"id":"5.6", "gr":"082", "vatClass":"3", "description":"Vorsteuern betreffend die Steuerschuld gemäß § 19 Abs. 1a (Bauleistungen)"});
	form.push({"id":"5.7", "gr":"087", "vatClass":"3", "description":"Vorsteuern betreffend die Steuerschuld gemäß § 19 Abs. 1b (Sicherungseigentum, Vorbehaltseigentum und Grundstücke im Zwangsversteigerungsverfahren)"});			
	form.push({"id":"5.8", "gr":"089", "vatClass":"3", "description":"Vorsteuern betreffend die Steuerschuld gemäß § 19 Abs. 1d (Schrott und Abfallstoffe)"});
	form.push({"id":"5.9", "gr":"064", "vatClass":"3", "description":"Vorsteuern für innergemeinschaftliche Lieferungen neuer Fahrzeuge von Fahrzeuglieferern gemäß Art. 2"});		
	form.push({"id":"5.10", "gr":"062", "vatClass":"4", "description":"Davon nicht abzugsfähig gemäß § 12 Abs. 3 iVm Abs. 4 und 5"});
	form.push({"id":"5.11", "gr":"063", "vatClass":"3", "description":"Berichtigung gemäß § 12 Abs. 10 und 11"});
	form.push({"id":"5.12", "gr":"067", "vatClass":"3", "description":"Berichtigung gemäß § 16"});
	form.push({"id":"5.13", "description":"Gesamtbetrag der abziehbaren Vorsteuer", "sum":"-5.1;-5.2;-5.3;-5.4;-5.5;-5.6;-5.7;-5.8;-5.9;5.10;-5.11;-5.12"});
	
	form.push({"id":"6.1", "gr":"090", "vatClass":"3", "description":""});
	form.push({"id":"7", "gr":"095", "description":"", "sum":"4.14.2;4.15.2;4.16.2;4.17.2;4.18.2;4.19.2;4.20;4.21;4.22;4.23;4.24;4.28.2;4.29.2;4.30.2;4.31.2;5.13;6.1"});
}



//------------------------------------------------------------------------------//
// FUNCTIONS
//------------------------------------------------------------------------------//

//Main function
function exec(string) {
	//Check if we are on an opened document
	if (!Banana.document) {
		return;
	}

	//Every time the script is executed we clear the messages in banana
	Banana.document.clearMessages();
	
	//Function call to manage and save user settings about the period date
	var dateform = getPeriodSettings();

	//Check if user has entered a period date.
	//If yes, we can get all the informations we need, process them and finally create the report.
	//If not, the script execution will be stopped immediately.
	if (dateform) {

		//Variable by checkTotals() and checkBalance() functions to check if use them to create the "normal-report" or to create the "test-report".
		//The reports are differents: on test-report we don't want to display any dialog boxes.
		var isTest = false;
		
		//Function call to create the report
		var report = createVatReport(Banana.document, dateform.selectionStartDate, dateform.selectionEndDate, isTest);
		
		//Print the report
		var stylesheet = createStylesheet();
		Banana.Report.preview(report, stylesheet);	
	}
}


//The purpose of this function is to do some operations before the values are converted
function postProcessAmounts(banDoc, isTest) {

	//Invert the 5.13 total if negative
	if (Banana.SDecimal.sign(getValue(form, "5.13", "amount")) == -1) { //amount < 0
		getObject(form, "5.13").sign = -1;
		getObject(form, "5.13").amount = Banana.SDecimal.invert(getValue(form, "5.13", "amount"));
	}

	//Invert the 7. total if negative
	if (Banana.SDecimal.sign(getValue(form, "7", "amount")) == -1) { //amount < 0
		getObject(form, "7").sign = -1;
		getObject(form, "7").amount = Banana.SDecimal.invert(getValue(form, "7", "amount"));
	}

	//Verification of some total values
	checkTotals("4.13", "4.14.1;4.15.1;4.16.1;4.17.1;4.18.1;4.19.1", isTest);
	checkTotals("4.27", "4.28.1;4.29.1;4.30.1;4.31.1", isTest);
	
	//Verification of the balance values
	checkBalance(banDoc, isTest);
}


//Function that create the report
function createVatReport(banDoc, startDate, endDate, isTest) {

	/** 1. CREATE AND LOAD THE PARAMETERS AND THE FORM */
	loadParam(banDoc, startDate, endDate);
	loadForm();
	
	/** 2. EXTRACT THE DATA, CALCULATE AND LOAD THE BALANCES */
	loadBalances();
	
	/** 3. CALCULATE THE TOTALS */
	calcFormTotals(["amount"]);
	
	/** 4. DO SOME OPERATIONS BEFORE CONVERTING THE VALUES */
	postProcessAmounts(banDoc, isTest);
	
	/** 5. CONVERT ALL THE VALUES */
	formatValues(["amount"]);
	


	/** START PRINT... */
	/** ------------------------------------------------------------------------------------------------------------- */

	//Create a report.
	var report = Banana.Report.newReport(param.reportName);

	//Variable used for the difference in months between the opening date and the closure date
	var monthsNumber = getMonthDiff(Banana.Converter.toDate(param.startDate), Banana.Converter.toDate(param.endDate));
		
	//Title
	report.addParagraph("[  ] Umsatzsteuervoranmeldung 2017", "heading1");		
	report.addParagraph("[  ] Berichtige Umsatzsteuervoranmeldung 2017", "heading1");
		
	//Table with basic informations
	var table1 = report.addTable("table");		
		
	//Printing of the objects with ID 1-2
	tableRow = table1.addRow();
	tableRow.addCell("1. Abgabenkontonummer", "valueTitle");
	tableRow.addCell("2. Zeitraum", "valueTitle", 3);

	//Set the period text
	setPeriodText(monthsNumber);

	if (monthsNumber == 1) {
		tableRow = table1.addRow();
		tableRow.addCell("1.1 " + getValue(form, "1.1", "description"), "description", 1);
		tableRow.addCell("2.1 " + getValue(form, "2.1", "description"), "description", 3);
		
		tableRow = table1.addRow();
		tableRow.addCell(param.fiscalNumber, "valueText", 1);
		tableRow.addCell(getMonthName(Banana.Converter.toDate(param.startDate)), "valueText", 1);
		tableRow.addCell(Banana.Converter.toDate(param.startDate).getFullYear(), "valueText", 1);
		tableRow.addCell(" ", "valueText", 1);
	} else if (monthsNumber > 1) {
		tableRow = table1.addRow();
		tableRow.addCell("1.1 " + getValue(form, "1.1", "description"), "description", 1);
		tableRow.addCell("2.2 " + getValue(form, "2.2", "description"), "description", 3);
		
		tableRow = table1.addRow();
		tableRow.addCell(param.fiscalNumber, "valueText", 1);
		tableRow.addCell(Banana.Converter.toLocaleDateFormat(param.startDate), "valueText", 1);
		tableRow.addCell("bis ", "valueText", 1);
		tableRow.addCell(Banana.Converter.toLocaleDateFormat(param.endDate), "valueText", 1);
	}
		
	tableRow = table1.addRow();
	tableRow.addCell("1.2  [  ]  Steuernummer noch nicht vorhanden", "description");
	tableRow.addCell("", "", 3);
	
	//Printing of the objects with ID 3
	tableRow = table1.addRow();
	tableRow.addCell("3. Angaben zum Unternehmen", "valueTitle", 4);
	
	tableRow = table1.addRow();
	tableRow.addCell("3.1 " + getValue(form, "3.1", "description"), "description", 4);
	
	tableRow = table1.addRow();
	tableRow.addCell(param.company.toUpperCase(), "valueText", 4);
	
	tableRow = table1.addRow();
	tableRow.addCell("3.2 " + getValue(form, "3.2", "description"), "description", 3);
	tableRow.addCell("3.3 " + getValue(form, "3.3", "description"), "description", 1);
	
	tableRow = table1.addRow();
	tableRow.addCell(param.address.toUpperCase(), "valueText", 3);
	tableRow.addCell(param.hausnummer.toUpperCase(), "valueText", 1);
	
	tableRow = table1.addRow();
	tableRow.addCell("3.4 " + getValue(form, "3.4", "description"), "description", 1);
	tableRow.addCell("3.5 " + getValue(form, "3.5", "description"), "description", 1);
	tableRow.addCell("3.6 " + getValue(form, "3.6", "description"), "description", 1);
	tableRow.addCell("3.7 " + getValue(form, "3.7", "description"), "description", 1);
	
	tableRow = table1.addRow();
	tableRow.addCell(param.stiege, "valueText", 1);
	tableRow.addCell(param.tuernummer, "valueText", 1);
	tableRow.addCell(param.nation, "valueText", 1);
	tableRow.addCell(param.telephone, "valueText", 1);
	
	tableRow = table1.addRow();
	tableRow.addCell("3.8 " + getValue(form, "3.8", "description"), "description", 1);
	tableRow.addCell("3.9 " + getValue(form, "3.9", "description"), "description", 3);
	
	tableRow = table1.addRow();
	tableRow.addCell(param.zip, "valueText", 1);
	tableRow.addCell(param.city.toUpperCase(), "valueText", 3);
	
	//Create new table for the data
	var table = report.addTable("table");
	
	tableRow = table.addRow();
	tableRow.addCell("", "", 7);
	
	//Printing of the objects with ID 4
	tableRow = table.addRow();
	tableRow.addCell("4.", "valueTitle", 1);
	tableRow.addCell("Berechnung der Umsatzsteuer:", "valueTitle", 5);
	tableRow.addCell("Bemessungsgrundlage", "valueTitle1", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("Lieferungen, sonstige Leistungen und Eigenverbrauch:", "descriptionBold", 7);
	
	tableRow = table.addRow();
	tableRow.addCell("4.1", "", 1);
	tableRow.addCell(getValue(form, "4.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.1", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.1", "amount"), "valueAmount", 1);
	tableRow = table.addRow();
	
	tableRow.addCell("4.2", "", 1);
	tableRow.addCell(getValue(form, "4.2", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.2", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.2", "amount"), "valueAmount", 1);

	tableRow = table.addRow();
	tableRow.addCell("4.3", "", 1);
	tableRow.addCell(getValue(form, "4.3", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.3", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "4.3", "amount"), "valueAmount", 1);

	//Printing of the total with ID 4.4
	tableRow = table.addRow();
	tableRow.addCell("4.4", "", 1);
	tableRow.addCell(getValue(form, "4.4", "description"), "description", 4);
	tableRow.addCell("", "", 1);
	if (getValue(form, "4.4", "vatTaxable") != 0) {
		tableRow.addCell(getValue(form, "4.4", "amount"), "valueTotal", 1);
	} else {
		tableRow.addCell("", "valueTotal", 1);
	}
	
	tableRow = table.addRow();
	tableRow.addCell("Davon steuerfrei MIT Vorsteuerabzug gemäß", "horizontalLine descriptionBold", 7);
	
	tableRow = table.addRow();
	tableRow.addCell("4.5", "", 1);
	tableRow.addCell(getValue(form, "4.5", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.5", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "4.5", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("4.6", "", 1);
	tableRow.addCell(getValue(form, "4.6", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.6", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "4.6", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("4.7", "", 1);
	tableRow.addCell(getValue(form, "4.7", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.7", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "4.7", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("4.8", "", 1);
	tableRow.addCell(getValue(form, "4.8", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.8", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "4.8", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("4.9", "", 1);
	tableRow.addCell(getValue(form, "4.9", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.9", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "4.9", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("Davon steuerfrei OHNE Vorsteuerabzug gemäß", "horizontalLine descriptionBold", 7);
	
	tableRow = table.addRow();
	tableRow.addCell("4.10", "", 1);
	tableRow.addCell(getValue(form, "4.10", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.10", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "4.10", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("4.11", "", 1);
	tableRow.addCell(getValue(form, "4.11", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.11", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "4.11", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("4.12", "", 1);
	tableRow.addCell(getValue(form, "4.12", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.12", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "4.12", "amount"), "valueAmount", 1);
	
	//Printing of the total with ID 4.13
	tableRow = table.addRow();
	tableRow.addCell("4.13", "", 1);
	tableRow.addCell(getValue(form, "4.13", "description"), "description", 4);
	tableRow.addCell("", "", 1);
	if (getValue(form, "4.13", "amount") != 0) {
		tableRow.addCell(getValue(form, "4.13", "amount"), "valueTotal", 1);
	} else {
		tableRow.addCell("", "valueTotal", 1);	
	}
		
	tableRow = table.addRow();
	tableRow.addCell("Davon sind zu versteuern mit:", "horizontalLine descriptionBold", 4);
	tableRow.addCell("Bemessungsgrundlage", "description1 horizontalLine", 1);
	tableRow.addCell("", "horizontalLine", 1);
	tableRow.addCell("Umsatzsteuer", "description1 horizontalLine", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("4.14", "", 1);
	tableRow.addCell(getValue(form, "4.14.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.14.1", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.14.1", "amount"), "valueAmount", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.14.2", "amount"), "valueAmount", 1);

	tableRow = table.addRow();
	tableRow.addCell("4.15", "", 1);
	tableRow.addCell(getValue(form, "4.15.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.15.1", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.15.1", "amount"), "valueAmount", 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.15.2", "amount"), "valueAmount", 1);

	tableRow = table.addRow();
	tableRow.addCell("4.16", "", 1);
	tableRow.addCell(getValue(form, "4.16.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.16.1", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.16.1", "amount"), "valueAmount", 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.16.2", "amount"), "valueAmount", 1);

	tableRow = table.addRow();
	tableRow.addCell("4.17", "", 1);
	tableRow.addCell(getValue(form, "4.17.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.17.1", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.17.1", "amount"), "valueAmount", 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.17.2", "amount"), "valueAmount", 1);

	tableRow = table.addRow();
	tableRow.addCell("4.18", "", 1);
	tableRow.addCell(getValue(form, "4.18.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.18.1", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.18.1", "amount"), "valueAmount", 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.18.2", "amount"), "valueAmount", 1);

	tableRow = table.addRow();
	tableRow.addCell("4.19", "", 1);
	tableRow.addCell(getValue(form, "4.19.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.19.1", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.19.1", "amount"), "valueAmount", 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.19.2", "amount"), "valueAmount", 1);

	tableRow = table.addRow();
	tableRow.addCell("Weiters zu versteuern:", "horizontalLine descriptionBold", 7);
	
	tableRow = table.addRow();
	tableRow.addCell("4.20", "", 1);
	tableRow.addCell(getValue(form, "4.20", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.20", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.20", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("4.21", "", 1);
	tableRow.addCell(getValue(form, "4.21", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.21", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.21", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("4.22", "", 1);
	tableRow.addCell(getValue(form, "4.22", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.22", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.22", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("4.23", "", 1);
	tableRow.addCell(getValue(form, "4.23", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.23", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.23", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("4.24", "", 1);
	tableRow.addCell(getValue(form, "4.24", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.24", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.24", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("Innergemeinschaftliche Erwerbe:", "horizontalLine descriptionBold", 4);
	tableRow.addCell("Bemessungsgrundlage", "description1 horizontalLine", 1);
	tableRow.addCell("", "horizontalLine", 2);
	
	tableRow = table.addRow();
	tableRow.addCell("4.25", "", 1);
	tableRow.addCell(getValue(form, "4.25", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.25", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.25", "amount"), "valueAmount", 1);
	tableRow.addCell("", "", 2);
	
	tableRow = table.addRow();
	tableRow.addCell("4.26", "", 1);
	tableRow.addCell(getValue(form, "4.26", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.26", "gr"), "description", 1);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "4.26", "amount"), "valueAmount", 1);
	tableRow.addCell("", "", 2);
	
	//Printing of the total with ID 4.27
	tableRow = table.addRow();
	tableRow.addCell("4.27", "", 1);
	tableRow.addCell(getValue(form, "4.27", "description"), "description", 2);
	tableRow.addCell("", "", 1);
	if (getValue(form, "4.27", "amount") != 0) {
		tableRow.addCell(getValue(form, "4.27", "amount"), "valueTotal", 1);
	} else {
		tableRow.addCell("", "valueTotal", 1);
	}
	tableRow.addCell("", "", 2);
	
	tableRow = table.addRow();
	tableRow.addCell("Davon sind zu versteuern mit:", "horizontalLine descriptionBold", 7);
	
	tableRow = table.addRow();
	tableRow.addCell("4.28", "", 1);
	tableRow.addCell(getValue(form, "4.28.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.28.1", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.28.1", "amount"), "valueAmount", 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.28.2", "amount"), "valueAmount", 1);

	tableRow = table.addRow();
	tableRow.addCell("4.29", "", 1);
	tableRow.addCell(getValue(form, "4.29.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.29.1", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.29.1", "amount"), "valueAmount", 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.29.2", "amount"), "valueAmount", 1);

	tableRow = table.addRow();
	tableRow.addCell("4.30", "", 1);
	tableRow.addCell(getValue(form, "4.30.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.30.1", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.30.1", "amount"), "valueAmount", 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.30.2", "amount"), "valueAmount", 1);

	tableRow = table.addRow();
	tableRow.addCell("4.31", "", 1);
	tableRow.addCell(getValue(form, "4.31.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.31.1", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.31.1", "amount"), "valueAmount", 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "4.31.2", "amount"), "valueAmount", 1);

	tableRow = table.addRow();
	tableRow.addCell("Nicht zu versteuernde Erwerbe:", "horizontalLine descriptionBold", 7);
	
	tableRow = table.addRow();
	tableRow.addCell("4.32", "", 1);
	tableRow.addCell(getValue(form, "4.32", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.32", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.32", "amount"), "valueAmount", 1);
	tableRow.addCell("", "", 2);
	
	tableRow = table.addRow();
	tableRow.addCell("4.33", "", 1);
	tableRow.addCell(getValue(form, "4.33", "description"), "description", 1);
	tableRow.addCell(getValue(form, "4.33", "gr"), "description", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "4.33", "amount"), "valueAmount", 1);
	tableRow.addCell("", "", 2);
	
	//Printing of the objects with ID 5
	tableRow = table.addRow();
	tableRow.addCell("5.", "valueTitle", 1);
	tableRow.addCell("Berechnung der abziehbaren Vorsteuer:", "valueTitle", 6);
	
	tableRow = table.addRow();
	tableRow.addCell("5.1", "", 1);
	tableRow.addCell(getValue(form, "5.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "5.1", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "5.1", "amount"), "valueAmount", 1);

	tableRow = table.addRow();
	tableRow.addCell("5.2", "", 1);
	tableRow.addCell(getValue(form, "5.2", "description"), "description", 1);
	tableRow.addCell(getValue(form, "5.2", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "5.2", "amount"), "valueAmount", 1);		
	
	tableRow = table.addRow();
	tableRow.addCell("5.3", "", 1);
	tableRow.addCell(getValue(form, "5.3", "description"), "description", 1);
	tableRow.addCell(getValue(form, "5.3", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "5.3", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("5.4", "", 1);
	tableRow.addCell(getValue(form, "5.4", "description"), "description", 1);
	tableRow.addCell(getValue(form, "5.4", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "5.4", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("5.5", "", 1);
	tableRow.addCell(getValue(form, "5.5", "description"), "description", 1);
	tableRow.addCell(getValue(form, "5.5", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "5.5", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("5.6", "", 1);
	tableRow.addCell(getValue(form, "5.6", "description"), "description", 1);
	tableRow.addCell(getValue(form, "5.6", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "5.6", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("5.7", "", 1);
	tableRow.addCell(getValue(form, "5.7", "description"), "description", 1);
	tableRow.addCell(getValue(form, "5.7", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "5.7", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("5.8", "", 1);
	tableRow.addCell(getValue(form, "5.8", "description"), "description", 1);
	tableRow.addCell(getValue(form, "5.8", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "5.8", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("5.9", "", 1);
	tableRow.addCell(getValue(form, "5.9", "description"), "description", 1);
	tableRow.addCell(getValue(form, "5.9", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(getValue(form, "5.9", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("5.10", "", 1);
	tableRow.addCell(getValue(form, "5.10", "description"), "description", 1);
	tableRow.addCell(getValue(form, "5.10", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(getValue(form, "5.10", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("5.11", "", 1);
	tableRow.addCell(getValue(form, "5.11", "description"), "description", 1);
	tableRow.addCell(getValue(form, "5.11", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+/-", "", 1);
	tableRow.addCell(getValue(form, "5.11", "amount"), "valueAmount", 1);
	
	tableRow = table.addRow();
	tableRow.addCell("5.12", "", 1);
	tableRow.addCell(getValue(form, "5.12", "description"), "description", 1);
	tableRow.addCell(getValue(form, "5.12", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+/-", "", 1);
	tableRow.addCell(getValue(form, "5.12", "amount"), "valueAmount", 1);
	
	//Printing of the total with ID 5.13
	tableRow = table.addRow();
	tableRow.addCell("5.13", "", 1);
	tableRow.addCell(getValue(form, "5.13", "description"), "description", 4);
	
	if (getValue(form, "5.13", "sign") == -1) { //value < 0
		tableRow.addCell("-", "", 1);
		tableRow.addCell(getValue(form, "5.13", "amount"), "valueTotal", 1);
	} else {
		if (Banana.SDecimal.sign(getValue(form, "5.13", "amount")) == 1) { //value > 0
			tableRow.addCell("", "", 1);
			tableRow.addCell(getValue(form, "5.13", "amount"), "valueTotal", 1);
		} else if (Banana.SDecimal.sign(getValue(form, "5.13", "amount")) == 0) { //value = 0
			tableRow.addCell("", "", 1);
			tableRow.addCell("", "valueTotal", 1);
		}
	}

	//Printing of the objects with ID 6
	tableRow = table.addRow();
	tableRow.addCell("6.", "valueTitle", 1);
	tableRow.addCell("Sonstige Berichtigungen:", "valueTitle", 6);
	
	tableRow = table.addRow();
	tableRow.addCell("", "", 1);
	tableRow.addCell(getValue(form, "6.1", "description"), "description", 1);
	tableRow.addCell(getValue(form, "6.1", "gr"), "description", 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+/-", "", 1);
	tableRow.addCell(getValue(form, "6.1", "amount"), "valueAmount", 1);
	
	//Printing of the objects with ID 7
	//We check if the final total value is positive or negative because we have to use different descriptions.
	if (getValue(form, "7", "sign") == -1) { //value < 0
		tableRow = table.addRow();
		tableRow.addCell("7.2", "", 1);
		tableRow.addCell("Überschuss (Gutschrift)", "description", 1);
		tableRow.addCell(getValue(form, "7", "gr"), "description", 1);
		tableRow.addCell("", "", 2);
		tableRow.addCell("-", "", 1);
		tableRow.addCell(getValue(form, "7", "amount"), "valueTotal", 1);
	} else {
		if (Banana.SDecimal.sign(getValue(form, "7", "amount")) == 1) { //value > 0
			tableRow = table.addRow();
			tableRow.addCell("7.1", "", 1);
			tableRow.addCell("Vorauszahlung (Zahllast)", "description", 1);
			tableRow.addCell(getValue(form, "7", "gr"), "description", 1);
			tableRow.addCell("", "", 2);
			tableRow.addCell("", "", 1);
			tableRow.addCell(getValue(form, "7", "amount"), "valueTotal", 1);
		} else if (Banana.SDecimal.sign(getValue(form, "7", "amount")) == 0) { //value = 0
			tableRow = table.addRow();
			tableRow.addCell("7.1 / 7.2", "", 1);
			tableRow.addCell("Vorauszahlung (Zahllast) / Überschuss (Gutschrift)", "description", 1);
			tableRow.addCell(getValue(form, "7", "gr"), "description", 1);
			tableRow.addCell("", "", 2);
			tableRow.addCell("", "", 1);
			tableRow.addCell("", "valueTotal", 1);
		}
	}

	
	//Add all the warning messages to the report
	for (var i = 0; i < form.length; i++) {
		if (form[i]["warningMessage"]) {
			report.addParagraph(form[i]["warningMessage"], "warningMsg");
		}
	}

	//Add a footer to the report
	addFooter(report, param);


	/** END PRINT ... */
	/** ------------------------------------------------------------------------------------------------------------- */

	//Return the final report
	return report;
}


//The purpose of this function is to convert all the values from the given list to local format
function formatValues(fields) {
	if (param["formatNumber"] === true) {
		for (i = 0; i < form.length; i++) {
			var valueObj = getObject(form, form[i].id);

			for (var j = 0; j < fields.length; j++) {
				valueObj[fields[j]] = Banana.Converter.toLocaleNumberFormat(valueObj[fields[j]]);
			}
		}
	}
}


//The purpose of this function is to verify two sums.
//Given two lists of values divided by the character ";" the function creates two totals and compares them.
//It is also possible to compare directly single values, instead of a list of values.
function checkTotals(valuesList1, valuesList2, isTest) {
	//Calculate the first total
	if (valuesList1) {
		var total1 = 0;
		var arr1 = valuesList1.split(";");
		for (var i = 0; i < arr1.length; i++) {
			total1 = Banana.SDecimal.add(total1, getValue(form, arr1[i], "amount"), {'decimals':param.rounding});
		}
	}
	
	//Calculate the second total
	if (valuesList2) {
		var total2 = 0;
		var arr2 = valuesList2.split(";");
		for (var i = 0; i < arr2.length; i++) {
			total2 = Banana.SDecimal.add(total2, getValue(form, arr2[i], "amount"), {'decimals':param.rounding});
		}
	}
	
	//Finally, compare the two totals.
	//If there are differences, a message and a dialog box warns the user
	if (Banana.SDecimal.compare(total1, total2) !== 0) {
		if (!isTest) {
			//Add an information dialog.
			Banana.Ui.showInformation("Warning!", "Different values: Total " + valuesList1 + " <" + Banana.Converter.toLocaleNumberFormat(total1) + 
			">, Total " + valuesList2 + " <" + Banana.Converter.toLocaleNumberFormat(total2) + ">");
		}
		
		//Add to the form an object containing a warning message that will be added at the end of the report
		var warningStringMsg = "Warning! Different values: Total " + valuesList1 + " <" + Banana.Converter.toLocaleNumberFormat(total1) + 
							">, Total " + valuesList2 + " <" + Banana.Converter.toLocaleNumberFormat(total2) + ">";
		
		form.push({"warningMessage" : warningStringMsg});
	}
}


//The purpose of this function is to verify if the balance from Banana euquals the report total
function checkBalance(banDoc, isTest) {
	//First, we get the total from the report, specifying the correct id total 
	var totalFromReport = getValue(form, "7", "amount");

	//Second, we get the VAT balance table from Banana using the function Banana.document.vatReport([startDate, endDate]).
	//The two dates are taken directly from the structure. 
	var vatReportTable = banDoc.vatReport(param.startDate, param.endDate);
	
	//Now we can read the table rows values
	for (var i = 0; i < vatReportTable.rowCount; i++) {
		var tRow = vatReportTable.row(i);
		var group = tRow.value("Group");
		var vatBalance = tRow.value("VatBalance");
		
		//Since we know that the balance is summed in group named "_tot_", we check if that value equals the total from the report
		if (group === "_tot_") {

			//In order to compare correctly the values we have to invert the sign of the result from Banana (if negative), using the Banana.SDecimal.invert() function.
			if (Banana.SDecimal.sign(vatBalance) == -1) {
				vatBalance = Banana.SDecimal.invert(vatBalance);
			}

			//Now we can compare the two values using the Banana.SDecimal.compare() function and return a message if they are different.
			if (Banana.SDecimal.compare(totalFromReport, vatBalance) !== 0) {
				if (!isTest) {
					//Add an information dialog
					Banana.Ui.showInformation("Warning!", "Different values: " + 
					"Total from Banana <" + Banana.Converter.toLocaleNumberFormat(vatBalance) + 
					">, Total from report <" + Banana.Converter.toLocaleNumberFormat(totalFromReport) + ">");
				}

				//Add to the form an object containing a warning message that will be added at the end of the report
				var warningStringMsg =	"Warning! Different values: " + "Total from Banana <" + Banana.Converter.toLocaleNumberFormat(vatBalance) + 
										">, Total from report <" + Banana.Converter.toLocaleNumberFormat(totalFromReport) + ">";
				
				form.push({"warningMessage" : warningStringMsg});
			}
		}
	}
}


//The main purpose of this function is to create an array with all the values of a given column of the table (codeColumn) belonging to the same group (grText)
function getColumnListForGr(table, grText, codeColumn, grColumn) {

	if (table === undefined || !table) {
		return str;
	}

	if (!grColumn) {
		grColumn = "Gr1";
	}

	var str = [];

	//Loop to take the values of each rows of the table
	for (var i = 0; i < table.rowCount; i++) {
		var tRow = table.row(i);
		var grRow = tRow.value(grColumn);

		//If Gr1 column contains other characters (in this case ";") we know there are more values
		//We have to split them and take all values separately
		//If there are only alphanumeric characters in Gr1 column we know there is only one value
		var codeString = grRow;
		var arrCodeString = codeString.split(";");
		for (var j = 0; j < arrCodeString.length; j++) {
			var codeString1 = arrCodeString[j];
			if (codeString1 === grText) {
				str.push(tRow.value(codeColumn));
			}
		}
	}

	//Removing duplicates
	for (var i = 0; i < str.length; i++) {
		for (var x = i+1; x < str.length; x++) {
			if (str[x] === str[i]) {
				str.splice(x,1);
				--x;
			}
		}
	}

	//Return the array
	return str;
}


//The purpose of this function is to load all the balances and save the values into the form
function loadBalances() {

	for (var i in form) {

		//Check if there are "vatClass" properties, then load VAT balances
		if (form[i]["vatClass"]) {
			if (form[i]["gr"]) {
				form[i]["amount"] = calculateVatGr1Balance(form[i]["gr"], form[i]["vatClass"], param["grColumn"], param["startDate"], param["endDate"]);
			}
		}

		//Check if there are "bClass" properties, then load balances
		if (form[i]["bClass"]) {
			if (form[i]["gr"]) {
				form[i]["amount"] = calculateAccountGr1Balance(form[i]["gr"], form[i]["bClass"], param["grColumn"], param["startDate"], param["endDate"]);
			}
		}
	}
}


//The purpose of this function is to calculate all the balances of the accounts belonging to the same group (grText)
function calculateAccountGr1Balance(grText, bClass, grColumn, startDate, endDate) {
	
	var accounts = getColumnListForGr(Banana.document.table("Accounts"), grText, "Account", grColumn);
	accounts = accounts.join("|");
	
	//Sum the amounts of opening, debit, credit, total and balance for all transactions for this accounts
	var currentBal = Banana.document.currentBalance(accounts, startDate, endDate);
	
	//The "bClass" decides which value to use
	if (bClass === "0") {
		return currentBal.amount;
	}
	else if (bClass === "1") {
		return currentBal.balance;
	}
	else if (bClass === "2") {
		return Banana.SDecimal.invert(currentBal.balance);
	}
	else if (bClass === "3") {
		return currentBal.total;
	}
	else if (bClass === "4") {
		return Banana.SDecimal.invert(currentBal.total);
	}
}


//The purpose of this function is to calculate all the VAT balances of the accounts belonging to the same group (grText)
function calculateVatGr1Balance(grText, vatClass, grColumn, startDate, endDate) {
	
	var grCodes = getColumnListForGr(Banana.document.table("VatCodes"), grText, "VatCode", grColumn);
	grCodes = grCodes.join("|");

	//Sum the vat amounts for the specified vat code and period
	var currentBal = Banana.document.vatCurrentBalance(grCodes, startDate, endDate);

	//The "vatClass" decides which value to use
	if (vatClass === "1") {
		if (currentBal.vatTaxable != 0) {
			return currentBal.vatTaxable;
		}
	}
	else if (vatClass === "2") {
		if (currentBal.vatTaxable != 0) {
			return Banana.SDecimal.invert(currentBal.vatTaxable);
		}
	}
	else if (vatClass === "3") {
		if (currentBal.vatPosted != 0) {
			return currentBal.vatPosted;
		}
	}
	else if (vatClass === "4") {
		if (currentBal.vatPosted != 0) {
			return Banana.SDecimal.invert(currentBal.vatPosted);
		}
	}
}


//The purpose of this function is to insert the right period description
function setPeriodText(numberOfMonths) {
	if (numberOfMonths == 12) { //year
		getObject(form, "2.2").description = "Kalenderjahr";
	} else if (numberOfMonths == 6) { //semester
		getObject(form, "2.2").description = "Kalenderhalbjahr";
	} else if (numberOfMonths == 3) { //quarter
		getObject(form, "2.2").description = "Kalenderquartal";
	}
}


//This function return the difference in months between two dates
function getMonthDiff(d1, d2) {	
	var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    //months -= d1.getMonth() + 1;
	months -= d1.getMonth();
    months += d2.getMonth();
    //Increment months if d2 comes later in its month than d1 in its month
    if (d2.getDate() >= d1.getDate()) {
        months++;
    }
	return months <= 0 ? 0 : months;
}


//Function to get the name of the months (German)
function getMonthName(date) {
	var month = [];
	month[0] = "Januar";
	month[1] = "Februar";
	month[2] = "März";
	month[3] = "April";
	month[4] = "Mai";
	month[5] = "Juni";
	month[6] = "Juli";
	month[7] = "August";
	month[8] = "September";
	month[9] = "Oktober";
	month[10] = "November";
	month[11] = "Dezember";
	var monthName = month[date.getMonth()];
	return monthName;
}


//Calculate all totals of the form
function calcFormTotals(fields) {
	for (var i = 0; i < form.length; i++) {
		calcTotal(form[i].id, fields);
	}
}


//Calculate a total of the form
function calcTotal(id, fields) {
	
	var valueObj = getObject(form, id);
	
	if (valueObj[fields[0]]) { //first field is present
		return; //calc already done, return
	}
	
	if (valueObj.sum) {
		var sumElements = valueObj.sum.split(";");	
		
		for (var k = 0; k < sumElements.length; k++) {
			var entry = sumElements[k].trim();
			if (entry.length <= 0) {
				return true;
			}
			
			var isNegative = false;
			if (entry.indexOf("-") >= 0) {
				isNegative = true;
				entry = entry.substring(1);
			}
			
			//Calulate recursively
			calcTotal(entry, fields);  
			
		    for (var j = 0; j < fields.length; j++) {
				var fieldName = fields[j];
				var fieldValue = getValue(form, entry, fieldName);
				if (fieldValue) {
					if (isNegative) {
						//Invert sign
						fieldValue = Banana.SDecimal.invert(fieldValue);
					}
					valueObj[fieldName] = Banana.SDecimal.add(valueObj[fieldName], fieldValue, {'decimals':param.rounding});
				}
			}
		}
	} else if (valueObj.gr) {
		//Already calculated in loadFormBalances()
	}
}


//The purpose of this function is to return a specific field value from the object.
//When calling this function, it's necessary to speficy the form (the structure), the object ID, and the field (parameter) needed.
function getValue(form, id, field) {
	var searchId = id.trim();
	for (var i = 0; i < form.length; i++) {
		if (form[i].id === searchId) {
			return form[i][field];
		}
	}
	Banana.document.addMessage("Couldn't find object with id:" + id);
}


//This function is very similar to the getValue() function.
//Instead of returning a specific field from an object, this function return the whole object.
function getObject(form, id) {
	for (var i = 0; i < form.length; i++) {
		if (form[i]["id"] === id) {
			return form[i];
		}
	}
	Banana.document.addMessage("Couldn't find object with id: " + id);
}


//The main purpose of this function is to allow the user to enter the accounting period desired and saving it for the next time the script is run.
//Every time the user runs of the script he has the possibility to change the date of the accounting period.
function getPeriodSettings() {
	
	//The formeters of the period that we need
	var scriptform = {
	   "selectionStartDate": "",
	   "selectionEndDate": "",
	   "selectionChecked": "false"
	};

	//Read script settings
	var data = Banana.document.scriptReadSettings();
	
	//Check if there are previously saved settings and read them
	if (data.length > 0) {
		try {
			var readSettings = JSON.parse(data);
			
			//We check if "readSettings" is not null, then we fill the formeters with the values just read
			if (readSettings) {
				scriptform = readSettings;
			}
		} catch (e){}
	}
	
	//We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
	var docStartDate = Banana.document.startPeriod();
	var docEndDate = Banana.document.endPeriod();	
	
	//A dialog window is opened asking the user to insert the desired period. By default is the accounting period
	var selectedDates = Banana.Ui.getPeriod("Period", docStartDate, docEndDate, 
		scriptform.selectionStartDate, scriptform.selectionEndDate, scriptform.selectionChecked);
		
	//We take the values entered by the user and save them as "new default" values.
	//This because the next time the script will be executed, the dialog window will contains the new values.
	if (selectedDates) {
		scriptform["selectionStartDate"] = selectedDates.startDate;
		scriptform["selectionEndDate"] = selectedDates.endDate;
		scriptform["selectionChecked"] = selectedDates.hasSelection;

		//Save script settings
		var formToString = JSON.stringify(scriptform);
		var value = Banana.document.scriptSaveSettings(formToString);		
    } else {
		//User clicked cancel
		return;
	}
	return scriptform;
}


//This function adds a Footer to the report
function addFooter(report, param) {
   report.getFooter().addClass("footer");
   var versionLine = report.getFooter().addText(param.bananaVersion + ", " + param.scriptVersion + ", ", "description");
   //versionLine.excludeFromTest();
   report.getFooter().addText(param.pageCounterText + " ", "description");
   report.getFooter().addFieldPageNr();
}


//The main purpose of this function is to create styles for the report print
function createStylesheet() {
	var stylesheet = Banana.Report.newStyleSheet();

    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "10mm 20mm 10mm 20mm");

	var style = stylesheet.addStyle(".description");
	style.setAttribute("font-size", "8px");
	
	style = stylesheet.addStyle(".description1");
	style.setAttribute("font-size", "7px");
	style.setAttribute("text-align", "center");

	style = stylesheet.addStyle(".descriptionBold");
	style.setAttribute("font-size", "8px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".footer");
	style.setAttribute("text-align", "right");
	style.setAttribute("font-size", "8px");
	style.setAttribute("font-family", "Courier New");

	style = stylesheet.addStyle(".heading1");
	style.setAttribute("font-size", "16px");
	style.setAttribute("font-weight", "bold");
	
	style = stylesheet.addStyle(".heading2");
	style.setAttribute("font-size", "14px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".heading3");
	style.setAttribute("font-size", "11px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".heading4");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".horizontalLine");
	style.setAttribute("border-top", "1px solid black");

	style = stylesheet.addStyle(".rowNumber");
	style.setAttribute("font-size", "9px");

	style = stylesheet.addStyle(".valueAmount");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#eeeeee"); 
	style.setAttribute("text-align", "right");
	
	style = stylesheet.addStyle(".valueDate");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#eeeeee"); 

	style = stylesheet.addStyle(".valueText");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#eeeeee"); 
	
	style = stylesheet.addStyle(".valueTitle");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#000000");
	style.setAttribute("color", "#fff");
	
	style = stylesheet.addStyle(".valueTitle1");
	style.setAttribute("font-size", "7px");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#000000");
	style.setAttribute("color", "#fff");
	
	style = stylesheet.addStyle(".valueTotal");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#eeeeee"); 
	style.setAttribute("text-align", "right");
	style.setAttribute("border-bottom", "1px double black");

	style = stylesheet.addStyle("table");
	style.setAttribute("width", "100%");
	style.setAttribute("font-size", "8px");	
	
	//Warning message.
	style = stylesheet.addStyle(".warningMsg");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("color", "red");
	style.setAttribute("font-size", "10");

	return stylesheet;
}
