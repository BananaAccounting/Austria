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
// @id = ch.banana.addon.vatreportaustria2015
// @api = 1.0
// @pubdate = 2015-08-14
// @publisher = Banana.ch SA
// @description = VAT report Austria 2015
// @task = app.command
// @doctype = 100.110;100.130
// @docproperties = austria
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



//This is the function that loads our parameterized structure.
//We create objects by adding some parameters that will be used to extract informations from Banana and to determine their behavior and purpose.
//The parameters are:
// - id		 	 : this is a UNIQUE id for each object contained in the structure
// - type 	     : used to differentiate the TYPE of object (text, umsatzsteuer, summe, vorsteuer, sonstige);
// - vatClass    : 1 = Vorsteuer vatTaxable
//                 2 = Umsatzsteur vatTaxable  
//                 3 = Vorsteuer vatPosted  
//                 4 = Umsatzsteur vatPosted  
// - description : used to specify the description text of the object
// - value       : (ONLY for type "text") this will contain the information values taken from Banana -> File Properties
// - code		 : (ONLY for type "umsatzsteuer/vorsteuer/summe") this is the GR1 code contained in Banana;
// - sum		 : (ONLY for type "summe") used to sum/subtract objects amounts (vatTaxable/vatAmount) to calculate totals.
function load_form(param) {

	var form = [];
	form.push({"id":"1.1", "type":"text", "description":"Finanzamtsnummer - Steuernummer", "value":param.fiscalNumber});	
	form.push({"id":"2.1", "type":"text", "description":"für den Kalendermonat", "month":get_month_name(Banana.Converter.toDate(param.startDate)), "year":Banana.Converter.toDate(param.startDate).getFullYear()});		
	form.push({"id":"2.2", "type":"text", "description":"für das Kalendervierteljahr", "openingDate":param.startDate, "closureDate":param.endDate});	
	form.push({"id":"3.1", "type":"text", "description":"BEZEICHNUNG DES UNTERNEHMENS (BLOCKSCHRIFT)", "value":param.company});
	form.push({"id":"3.2", "type":"text", "description":"STRASSE (BLOCKSCHRIFT)", "value":param.address});
	form.push({"id":"3.3", "type":"text", "description":"Hausnummer", "value":param.hausnummer});
	form.push({"id":"3.4", "type":"text", "description":"Stiege", "value":param.stiege});
	form.push({"id":"3.5", "type":"text", "description":"Türnummer", "value":param.tuernummer});
	form.push({"id":"3.6", "type":"text", "description":"Land", "value":param.nation});
	form.push({"id":"3.7", "type":"text", "description":"Telefonnummer", "value":param.telephone});
	form.push({"id":"3.8", "type":"text", "description":"Postleitzahl", "value":param.zip});
	form.push({"id":"3.9", "type":"text", "description":"ORT (BLOCKSCHRIFT)", "value":param.city});
	
	form.push({"id": "4.2", , "gr": "001", "vatClass": "2", "description": "zuzüglich Eigenverbrauch (§ 1 Abs. 1 Z 2, § 3 Abs. 2 und § 3a Abs. 1a)"});
	form.push({"id": "4.17", , "gr": "037", "vatClass": "4", "description": "19% für Jungholz und Mittelberg"});	
	
	form.push({"id": "4.1", "type": "umsatzsteuer", "description": "Gesamtbetrag der Bemessungsgrundlage für Lieferungen und sonstige Leistungen (ohne den nachstehend angeführten Eigenverbrauch) einschließlich Anzahlungen (jeweils ohne Umsatzsteuer)", "code": "000"});	
	form.push({"id": "4.2", "type": "umsatzsteuer", "description": "zuzüglich Eigenverbrauch (§ 1 Abs. 1 Z 2, § 3 Abs. 2 und § 3a Abs. 1a)", "code": "001"});
	form.push({"id": "4.3", "type": "umsatzsteuer", "description": "abzüglich Umsätze, für die die Steuerschuld gemäß § 19 Abs. 1 zweiter Satz sowie gemäß § 19 Abs. 1a, 1b, 1c, 1d und 1e auf den Leistungsempfänger übergegangen ist.", "code": "021"});
	form.push({"id": "4.4", "type": "summe", "description": "SUMME", "code": "", "sum":"4.1;4.2;-4.3"});
	form.push({"id": "4.5", "type": "umsatzsteuer", "description": "§ 6 Abs. 1 Z 1 iVm § 7 (Ausfuhrlieferungen)", "code": "011"});
	form.push({"id": "4.6", "type": "umsatzsteuer", "description": "§ 6 Abs. 1 Z 1 iVm § 8 (Lohnveredelungen)", "code": "012"});
	form.push({"id": "4.7", "type": "umsatzsteuer", "description": "§ 6 Abs. 1 Z 2 bis 6 sowie § 23 Abs. 5 (Seeschifffahrt, Luftfahrt, grenzüberschreitende Personenbeförderung, Diplomaten, Reisevorleistungen im Drittlandsgebiet usw.).", "code": "015"});
	form.push({"id": "4.8", "type": "umsatzsteuer", "description": "Art. 6 Abs. 1 (innergemeinschaftliche Lieferungen ohne die nachstehend gesondert anzuführenden Fahrzeuglieferungen)", "code": "017"});
	form.push({"id": "4.9", "type": "umsatzsteuer", "description": "Art. 6 Abs. 1, sofern Lieferungen neuer Fahrzeuge an Abnehmer ohne UID-Nummer bzw. durch Fahrzeuglieferer gemäß Art. 2 erfolgten.", "code": "018"});
	form.push({"id": "4.10", "type": "umsatzsteuer", "description": "§ 6 Abs. 1 Z 9 lit. a (Grundstücksumsätze)", "code": "019"});
	form.push({"id": "4.11", "type": "umsatzsteuer", "description": "§ 6 Abs. 1 Z 27 (Kleinunternehmer)", "code": "016"});		
	form.push({"id": "4.12", "type": "umsatzsteuer", "description": "§ 6 Abs. 1 Z (übrige steuerfreie Umsätze ohne Vorsteuerabzug)", "code": "020"});
	form.push({"id": "4.13", "type": "summe", "description": "Gesamtbetrag der steuerpflichtigen Lieferungen, sonstigen Leistungen und Eigenverbrauch (einschließlich steuerpflichtiger Anzahlungen)", "code": "", "sum":"4.4;-4.5;-4.6;-4.7;-4.8;-4.9;-4.10;-4.11;-4.12"});
	form.push({"id": "4.14", "type": "umsatzsteuer", "description": "20% Normalsteuersatz", "code": "022"});
	form.push({"id": "4.15", "type": "umsatzsteuer", "description": "10% ermäßigter Steuersatz", "code": "029"});
	form.push({"id": "4.16", "type": "umsatzsteuer", "description": "12% für Weinumsätze durch landwirtschaftliche Betriebe", "code": "025"});	
	form.push({"id": "4.17", "type": "umsatzsteuer", "description": "19% für Jungholz und Mittelberg", "code": "037"});	
	form.push({"id": "4.18", "type": "umsatzsteuer", "description": "10% Zusatzsteuer für pauschalierte land- und forstwirtschaftliche Betriebe", "code": "052"});
	form.push({"id": "4.19", "type": "umsatzsteuer", "description": "8% Zusatzsteuer für pauschalierte land- und forstwirtschaftliche Betriebe", "code": "038"});		
	form.push({"id": "4.20", "type": "umsatzsteuer", "description": "Steuerschuld gemäß § 11 Abs. 12 und 14, § 16 Abs. 2 sowie gemäß Art. 7 Abs. 4", "code": "056"});
	form.push({"id": "4.21", "type": "umsatzsteuer", "description": "Steuerschuld gemäß § 19 Abs. 1 zweiter Satz, § 19 Abs. 1c, 1e sowie gemäß Art. 25 Abs. 5", "code": "057"});		
	form.push({"id": "4.22", "type": "umsatzsteuer", "description": "Steuerschuld gemäß § 19 Abs. 1a (Bauleistungen)", "code": "048"});			
	form.push({"id": "4.23", "type": "umsatzsteuer", "description": "Steuerschuld gemäß § 19 Abs. 1b (Sicherungseigentum, Vorbehaltseigentum und Grundstücke im Zwangsversteigerungsverfahren)","code": "044"});			
	form.push({"id": "4.24", "type": "umsatzsteuer", "description": "Steuerschuld gemäß § 19 Abs. 1d (Schrott und Abfallstoffe)", "code": "032"});			
	form.push({"id": "4.25", "type": "umsatzsteuer", "description": "Gesamtbetrag der Bemessungsgrundlagen für innergemeinschaftliche Erwerbe", "code": "070"});
	form.push({"id": "4.26", "type": "umsatzsteuer", "description": "Davon steuerfrei gemäß Art. 6 Abs. 2", "code": "071"});
	form.push({"id": "4.27", "type": "summe", "description": "Gesamtbetrag der steuerpflichtigen innergemeinschaftlichen Erwerbe", "code": "", "sum":"4.25;-4.26"});		
	form.push({"id": "4.28", "type": "umsatzsteuer", "description": "20% Normalsteuersatz", "code": "072"});
	form.push({"id": "4.29", "type": "umsatzsteuer", "description": "10% ermäßigter Steuersatz", "code": "073"});	
	form.push({"id": "4.30", "type": "umsatzsteuer", "description": "19% für Jungholz und Mittelberg", "code": "088"});		
	form.push({"id": "4.31", "type": "umsatzsteuer", "description": "Erwerbe gemäß Art. 3 Abs. 8 zweiter Satz, die im Mitgliedstaat des Bestimmungslandes besteuert worden sind", "code": "076"});			
	form.push({"id": "4.32", "type": "umsatzsteuer", "description": "Erwerbe gemäß Art. 3 Abs. 8 zweiter Satz, die gemäß Art. 25 Abs. 2 im Inland als besteuert gelten", "code": "077"});
	
	form.push({"id": "5.1", "type": "vorsteuer", "description": "Gesamtbetrag der Vorsteuern (ohne die nachstehend gesondert anzuführenden Beträge)", "code": "060"});
	form.push({"id": "5.2", "type": "vorsteuer", "description": "Vorsteuern betreffend die entrichtete Einfuhrumsatzsteuer (§ 12 Abs. 1 Z 2 lit. a)", "code": "061"});
	form.push({"id": "5.3", "type": "vorsteuer", "description": "Vorsteuern betreffend die geschuldete, auf dem Abgabenkonto verbuchte Einfuhrumsatzsteuer (§ 12 Abs. 1 Z 2 lit. b)", "code": "083"});	
	form.push({"id": "5.4", "type": "vorsteuer", "description": "Vorsteuern aus dem innergemeinschaftlichen Erwerb", "code": "065"});
	form.push({"id": "5.5", "type": "vorsteuer", "description": "Vorsteuern betreffend die Steuerschuld gemäß § 19 Abs. 1 zweiter Satz, § 19 Abs. 1c, 1e sowie gemäß Art. 25 Abs. 5", "code": "066"});		
	form.push({"id": "5.6", "type": "vorsteuer", "description": "Vorsteuern betreffend die Steuerschuld gemäß § 19 Abs. 1a (Bauleistungen)", "code": "082"});
	form.push({"id": "5.7", "type": "vorsteuer", "description": "Vorsteuern betreffend die Steuerschuld gemäß § 19 Abs. 1b (Sicherungseigentum, Vorbehaltseigentum und Grundstücke im Zwangsversteigerungsverfahren)", "code": "087"});			
	form.push({"id": "5.8", "type": "vorsteuer", "description": "Vorsteuern betreffend die Steuerschuld gemäß § 19 Abs. 1d (Schrott und Abfallstoffe)", "code": "089"});
	form.push({"id": "5.9", "type": "vorsteuer", "description": "Vorsteuern für innergemeinschaftliche Lieferungen neuer Fahrzeuge von Fahrzeuglieferern gemäß Art. 2", "code": "064"});		
	form.push({"id": "5.10", "type": "vorsteuer", "description": "Davon nicht abzugsfähig gemäß § 12 Abs. 3 iVm Abs. 4 und 5", "code": "062"});
	form.push({"id": "5.11", "type": "vorsteuer", "description": "Berichtigung gemäß § 12 Abs. 10 und 11", "code": "063"});
	form.push({"id": "5.12", "type": "vorsteuer", "description": "Berichtigung gemäß § 16", "code": "067"});
	form.push({"id": "5.13", "type": "summe", "description": "Gesamtbetrag der abziehbaren Vorsteuer", "code": "", "sum":"-5.1;-5.2;-5.3;-5.4;-5.5;-5.6;-5.7;-5.8;-5.9;5.10;-5.11;-5.12"});
	
	form.push({"id": "6.1", "type": "sonstige", "description": "", "code": "090"});
	form.push({"id": "7", "type": "summe", "description": "", "code": "095", "sum":"4.14;4.15;4.16;4.17;4.18;4.19;4.20;4.21;4.22;4.23;4.24;4.28;4.29;4.30;5.13;6.1"});

	param.form = form;
}


//Variable used to speficy the rounding type
var rounding = 2;


//Main function
function exec(string) {
	//Check if we are on an opened document
	if (!Banana.document) {
		return;
	}
	
	//Function call to manage and save user settings about the period date
	var dateform = get_period_settings();

	//Check if user has entered a period date.
	//If yes, we can get all the informations we need, process them and finally create the report.
	//If no, the script execution will be stopped immediately.
	if (dateform) {
		//Variable by check_totals() and check_balance() functions to check if use them to create the "normal-report" or to create the "test-report".
		//The reports are differents: on test-report we don't want to display any dialog boxes.
		var isTest = false;
		
		//Function call to create the report
		var report = create_vat_report(Banana.document, dateform.selectionStartDate, dateform.selectionEndDate, isTest);
		
		//Print the report
		var stylesheet = create_styleSheet();
		Banana.Report.preview(report, stylesheet);	

	}
}



//------------------------------------------------------------------------------//
// FUNCTIONS
//------------------------------------------------------------------------------//

//Function that create the report
function create_vat_report(banDoc, startDate, endDate, isTest) {

	var param = {
		"reportName":"VAT report Austria 2015",												//Save the report's name
		"bananaVersion":"Banana Accounting, v. " + banDoc.info("Base", "ProgramVersion"), 	//Save the version of Banana Accounting used
		"scriptVersion":"script v. 2015-08-14 (TEST VERSION)", 											//Save the version of the script
		"fiscalNumber":banDoc.info("AccountingDataBase","FiscalNumber"),					//Save the fiscal number
		"startDate":startDate,																//Save the openingDate that will be used to specify the accounting period starting date
		"endDate":endDate, 																	//Save the closureDate that will be used to specify the accounting period ending date		
		"company":banDoc.info("AccountingDataBase","Company"), 								//Save the company name
		"address":banDoc.info("AccountingDataBase","Address1"), 							//Save the address
		"hausnummer":"", 																	//Save details
		"stiege":"",				 														//Save details
		"tuernummer":"", 																	//Save details
		"nation":banDoc.info("AccountingDataBase","Country"), 								//Save the country
		"telephone":banDoc.info("AccountingDataBase","Phone"), 								//Save the phone number
		"zip":banDoc.info("AccountingDataBase","Zip"), 										//Save the zip code
		"city":banDoc.info("AccountingDataBase","City") 									//Save the city
	};

	//Loading data and calculate the totals
	load_form(param);
	load_vat_balances(banDoc, param.form);
	calc_form_totals(param.form, ["vatAmount"]);
	// format amounts toLocaleNumberFormat
	
	//Create a report.
	var report = Banana.Report.newReport(param.reportName);
	
	//Adding a footer.
	add_footer(report, param);
	
	//Variables used for the report's style.
	var styleCellBlack = "black";
	var styleCellTextAlignRight = "right";
	var styleDescription = "description";
	var styleDescriptionBold = "descriptionBold";
	var styleExpanding = "expanding";
	var styleHeading1 = "heading1";
	var styleHeading2 = "heading2";
	var styleHeading3 = "heading3";
	var styleHeading4 = "heading4";
	var styleHorizontalLine = "horizontalLine";
	var styleRowNumber = "rowNumber";
	var styleValueAmount = "valueAmount";
	var styleValueDate = "valueDate";
	var styleValueText = "valueText";
	var styleValueTotal = "valueTotal";
	var styleValueTitle = "valueTitle";
	var styleValueTitle1 = "valueTitle1";
	
	//Variable used for the difference in months between the opening date and the closure date
	var monthsNumber = get_month_diff(Banana.Converter.toDate(get_value(param.form, "2.2", "openingDate")), Banana.Converter.toDate(get_value(param.form, "2.2", "closureDate")));
		
	//Begin printing the report...
	
	//Title
	report.addParagraph("[  ] Umsatzsteuervoranmeldung 2015", styleHeading1);		
	report.addParagraph("[  ] Berichtige Umsatzsteuervoranmeldung 2015", styleHeading1);
		
	//Table with basic informations
	var table = report.addTable("table");		
		
	//Printing of the objects with ID 1-2
	tableRow = table.addRow();
	tableRow.addCell("1. Abgabenkontonummer", styleValueTitle);
	tableRow.addCell("2. Zeitraum", styleValueTitle, 3);

	if (monthsNumber == 1) {
		tableRow = table.addRow();
		tableRow.addCell("1.1 " + get_value(param.form, "1.1", "description"), styleDescription, 1);
		tableRow.addCell("2.1 " + get_value(param.form, "2.1", "description"), styleDescription, 3);
		
		tableRow = table.addRow();
		tableRow.addCell(get_value(param.form, "1.1", "value"), styleValueText, 1);
		tableRow.addCell(get_value(param.form, "2.1", "month"), styleValueText, 1);
		tableRow.addCell(get_value(param.form, "2.1", "year"), styleValueText, 1);
		tableRow.addCell(" ", styleValueText, 1);
	} else if (monthsNumber > 1) {
		tableRow = table.addRow();
		tableRow.addCell("1.1 " + get_value(param.form, "1.1", "description"), styleDescription, 1);
		tableRow.addCell("2.2 " + get_value(param.form, "2.2", "description"), styleDescription, 3);
		
		tableRow = table.addRow();
		tableRow.addCell(get_value(param.form, "1.1", "value"), styleValueText, 1);
		tableRow.addCell(Banana.Converter.toLocaleDateFormat(get_value(param.form, "2.2", "openingDate")), styleValueText, 1);
		tableRow.addCell("bis ", styleValueText, 1);
		tableRow.addCell(Banana.Converter.toLocaleDateFormat(get_value(param.form, "2.2", "closureDate")), styleValueText, 1);
	}
		
	tableRow = table.addRow();
	tableRow.addCell("1.2 Steuernummer noch nicht vorhanden", styleDescription);
	tableRow.addCell("", "", 3);
	
	//Printing of the objects with ID 3
	tableRow = table.addRow();
	tableRow.addCell("3. Angaben zum Unternehmen", styleValueTitle, 4);
	
	tableRow = table.addRow();
	tableRow.addCell("3.1 " + get_value(param.form, "3.1", "description"), styleDescription, 4);
	
	tableRow = table.addRow();
	tableRow.addCell(get_value(param.form, "3.1", "value").toUpperCase(), styleValueText, 4);
	
	tableRow = table.addRow();
	tableRow.addCell("3.2 " + get_value(param.form, "3.2", "description"), styleDescription, 3);
	tableRow.addCell("3.3 " + get_value(param.form, "3.3", "description"), styleDescription, 1);
	
	tableRow = table.addRow();
	tableRow.addCell(get_value(param.form, "3.2", "value").toUpperCase(), styleValueText, 3);
	tableRow.addCell(get_value(param.form, "3.3", "value").toUpperCase(), styleValueText, 1);
	
	tableRow = table.addRow();
	tableRow.addCell("3.4 " + get_value(param.form, "3.4", "description"), styleDescription, 1);
	tableRow.addCell("3.5 " + get_value(param.form, "3.5", "description"), styleDescription, 1);
	tableRow.addCell("3.6 " + get_value(param.form, "3.6", "description"), styleDescription, 1);
	tableRow.addCell("3.7 " + get_value(param.form, "3.7", "description"), styleDescription, 1);
	
	tableRow = table.addRow();
	tableRow.addCell(get_value(param.form, "3.4", "value"), styleValueText, 1);
	tableRow.addCell(get_value(param.form, "3.5", "value"), styleValueText, 1);
	tableRow.addCell(get_value(param.form, "3.6", "value"), styleValueText, 1);
	tableRow.addCell(get_value(param.form, "3.7", "value"), styleValueText, 1);
	
	tableRow = table.addRow();
	tableRow.addCell("3.8 " + get_value(param.form, "3.8", "description"), styleDescription, 1);
	tableRow.addCell("3.9 " + get_value(param.form, "3.9", "description"), styleDescription, 3);
	
	tableRow = table.addRow();
	tableRow.addCell(get_value(param.form, "3.8", "value"), styleValueText, 1);
	tableRow.addCell(get_value(param.form, "3.9", "value").toUpperCase(), styleValueText, 3);
	
	//Create new table for the data
	var table_1 = report.addTable("table");
	
	tableRow = table_1.addRow();
	tableRow.addCell("", "", 7);
	
	//Printing of the objects with ID 4
	tableRow = table_1.addRow();
	tableRow.addCell("4.", styleValueTitle, 1);
	tableRow.addCell("Berechnung der Umsatzsteuer:", styleValueTitle, 5);
	tableRow.addCell("Bemessungsgrundlage", styleValueTitle1, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("Lieferungen, sonstige Leistungen und Eigenverbrauch:", "descriptionBold", 7);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.1", "", 1);
	tableRow.addCell(get_value(param.form, "4.1", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.1", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.1", "vatTaxable")), styleValueAmount, 1);
	tableRow = table_1.addRow();
	tableRow.addCell("4.2", "", 1);
	tableRow.addCell(get_value(param.form, "4.2", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.2", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.2", "vatTaxable")), styleValueAmount, 1);

	tableRow = table_1.addRow();
	tableRow.addCell("4.3", "", 1);
	tableRow.addCell(get_value(param.form, "4.3", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.3", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.3", "vatTaxable")), styleValueAmount, 1);

	//Printing of the total with ID 4.4
	tableRow = table_1.addRow();
	tableRow.addCell("4.4", "", 1);
	tableRow.addCell(get_value(param.form, "4.4", "description"), styleDescription, 4);
	tableRow.addCell("", "", 1);
	if (get_value(param.form, "4.4", "vatTaxable") != 0) {
		tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.4", "vatTaxable")), styleValueTotal, 1);
	} else {
		tableRow.addCell("", styleValueTotal, 1);
	}
	
	tableRow = table_1.addRow();
	tableRow.addCell("Davon steuerfrei MIT Vorsteuerabzug gemäß", "horizontalLine descriptionBold", 7);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.5", "", 1);
	tableRow.addCell(get_value(param.form, "4.5", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.5", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.5", "vatTaxable")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.6", "", 1);
	tableRow.addCell(get_value(param.form, "4.6", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.6", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.6", "vatTaxable")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.7", "", 1);
	tableRow.addCell(get_value(param.form, "4.7", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.7", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.7", "vatTaxable")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.8", "", 1);
	tableRow.addCell(get_value(param.form, "4.8", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.8", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.8", "vatTaxable")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.9", "", 1);
	tableRow.addCell(get_value(param.form, "4.9", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.9", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.9", "vatTaxable")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("Davon steuerfrei OHNE Vorsteuerabzug gemäß", "horizontalLine descriptionBold", 7);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.10", "", 1);
	tableRow.addCell(get_value(param.form, "4.10", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.10", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.10", "vatTaxable")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.11", "", 1);
	tableRow.addCell(get_value(param.form, "4.11", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.11", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.11", "vatTaxable")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.12", "", 1);
	tableRow.addCell(get_value(param.form, "4.12", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.12", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.12", "vatTaxable")), styleValueAmount, 1);
	
	//Printing of the total with ID 4.13
	tableRow = table_1.addRow();
	tableRow.addCell("4.13", "", 1);
	tableRow.addCell(get_value(param.form, "4.13", "description"), styleDescription, 4);
	tableRow.addCell("", "", 1);
	if (get_value(param.form, "4.13", "vatTaxable") != 0) {
		tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.13", "vatTaxable")), styleValueTotal, 1);
	} else {
		tableRow.addCell("", styleValueTotal, 1);	
	}
		
	tableRow = table_1.addRow();
	tableRow.addCell("Davon sind zu versteuern mit:", "horizontalLine descriptionBold", 4);
	tableRow.addCell("Bemessungsgrundlage", "description1 horizontalLine", 1);
	tableRow.addCell("", "horizontalLine", 1);
	tableRow.addCell("Umsatzsteuer", "description1 horizontalLine", 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.14", "", 1);
	tableRow.addCell(get_value(param.form, "4.14", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.14", "code"), styleDescription, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.14", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.14", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.15", "", 1);
	tableRow.addCell(get_value(param.form, "4.15", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.15", "code"), styleDescription, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.15", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.15", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.16", "", 1);
	tableRow.addCell(get_value(param.form, "4.16", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.16", "code"), styleDescription, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.16", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.16", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.17", "", 1);
	tableRow.addCell(get_value(param.form, "4.17", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.17", "code"), styleDescription, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.17", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.17", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.18", "", 1);
	tableRow.addCell(get_value(param.form, "4.18", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.18", "code"), styleDescription, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.18", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.18", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.19", "", 1);
	tableRow.addCell(get_value(param.form, "4.19", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.19", "code"), styleDescription, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.19", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.19", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("Weiters zu versteuern:", "horizontalLine descriptionBold", 7);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.20", "", 1);
	tableRow.addCell(get_value(param.form, "4.20", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.20", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.20", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.21", "", 1);
	tableRow.addCell(get_value(param.form, "4.21", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.21", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.21", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.22", "", 1);
	tableRow.addCell(get_value(param.form, "4.22", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.22", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.22", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.23", "", 1);
	tableRow.addCell(get_value(param.form, "4.23", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.23", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.23", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.24", "", 1);
	tableRow.addCell(get_value(param.form, "4.24", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.24", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.24", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("Innergemeinschaftliche Erwerbe:", "horizontalLine descriptionBold", 4);
	tableRow.addCell("Bemessungsgrundlage", "description1 horizontalLine", 1);
	tableRow.addCell("", "horizontalLine", 2);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.25", "", 1);
	tableRow.addCell(get_value(param.form, "4.25", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.25", "code"), styleDescription, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.25", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("", "", 2);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.26", "", 1);
	tableRow.addCell(get_value(param.form, "4.26", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.26", "code"), styleDescription, 1);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.26", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("", "", 2);
	
	//Printing of the total with ID 4.27
	tableRow = table_1.addRow();
	tableRow.addCell("4.27", "", 1);
	tableRow.addCell(get_value(param.form, "4.27", "description"), styleDescription, 2);
	tableRow.addCell("", "", 1);
	if (get_value(param.form, "4.27", "vatTaxable") != 0) {
		tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.27", "vatTaxable")), styleValueTotal, 1);
	} else {
		tableRow.addCell("", styleValueTotal, 1);
	}
	tableRow.addCell("", "", 2);
	
	tableRow = table_1.addRow();
	tableRow.addCell("Davon sind zu versteuern mit:", "horizontalLine descriptionBold", 7);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.28", "", 1);
	tableRow.addCell(get_value(param.form, "4.28", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.28", "code"), styleDescription, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.28", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.28", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.29", "", 1);
	tableRow.addCell(get_value(param.form, "4.29", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.29", "code"), styleDescription, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.29", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.29", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.30", "", 1);
	tableRow.addCell(get_value(param.form, "4.30", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.30", "code"), styleDescription, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.30", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.30", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("Nicht zu versteuernde Erwerbe:", "horizontalLine descriptionBold", 7);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.31", "", 1);
	tableRow.addCell(get_value(param.form, "4.31", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.31", "code"), styleDescription, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.31", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("", "", 2);
	
	tableRow = table_1.addRow();
	tableRow.addCell("4.32", "", 1);
	tableRow.addCell(get_value(param.form, "4.32", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "4.32", "code"), styleDescription, 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "4.32", "vatTaxable")), styleValueAmount, 1);
	tableRow.addCell("", "", 2);
	
	//Printing of the objects with ID 5
	tableRow = table_1.addRow();
	tableRow.addCell("5.", styleValueTitle, 1);
	tableRow.addCell("Berechnung der abziehbaren Vorsteuer:", styleValueTitle, 6);
	
	tableRow = table_1.addRow();
	tableRow.addCell("5.1", "", 1);
	tableRow.addCell(get_value(param.form, "5.1", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "5.1", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.1", "vatAmount")), styleValueAmount, 1);

	tableRow = table_1.addRow();
	tableRow.addCell("5.2", "", 1);
	tableRow.addCell(get_value(param.form, "5.2", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "5.2", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.2", "vatAmount")), styleValueAmount, 1);		
	
	tableRow = table_1.addRow();
	tableRow.addCell("5.3", "", 1);
	tableRow.addCell(get_value(param.form, "5.3", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "5.3", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.3", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("5.4", "", 1);
	tableRow.addCell(get_value(param.form, "5.4", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "5.4", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.4", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("5.5", "", 1);
	tableRow.addCell(get_value(param.form, "5.5", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "5.5", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.5", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("5.6", "", 1);
	tableRow.addCell(get_value(param.form, "5.6", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "5.6", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.6", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("5.7", "", 1);
	tableRow.addCell(get_value(param.form, "5.7", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "5.7", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.7", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("5.8", "", 1);
	tableRow.addCell(get_value(param.form, "5.8", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "5.8", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.8", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("5.9", "", 1);
	tableRow.addCell(get_value(param.form, "5.9", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "5.9", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.9", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("5.10", "", 1);
	tableRow.addCell(get_value(param.form, "5.10", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "5.10", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.10", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("5.11", "", 1);
	tableRow.addCell(get_value(param.form, "5.11", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "5.11", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+/-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.11", "vatAmount")), styleValueAmount, 1);
	
	tableRow = table_1.addRow();
	tableRow.addCell("5.12", "", 1);
	tableRow.addCell(get_value(param.form, "5.12", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "5.12", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+/-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.12", "vatAmount")), styleValueAmount, 1);
	
	//Printing of the total with ID 5.13
	tableRow = table_1.addRow();
	tableRow.addCell("5.13", "", 1);
	tableRow.addCell(get_value(param.form, "5.13", "description"), styleDescription, 4);
	if (get_value(param.form, "5.13", "vatAmount") < 0) {
		tableRow.addCell("-", "", 1);
		tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.13", "vatAmount")*-1), styleValueTotal, 1);
	} else if (get_value(param.form, "5.13", "vatAmount") > 0) {
		tableRow.addCell("", "", 1);
		tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "5.13", "vatAmount")), styleValueTotal, 1);
	} else {
		tableRow.addCell("", "", 1);
		tableRow.addCell("", styleValueTotal, 1);
	}
	
	//Printing of the objects with ID 6
	tableRow = table_1.addRow();
	tableRow.addCell("6.", styleValueTitle, 1);
	tableRow.addCell("Sonstige Berichtigungen:", styleValueTitle, 6);
	
	tableRow = table_1.addRow();
	tableRow.addCell("6.1", "", 1);
	tableRow.addCell(get_value(param.form, "6.1", "description"), styleDescription, 1);
	tableRow.addCell(get_value(param.form, "6.1", "code"), styleDescription, 1);
	tableRow.addCell("", "", 2);
	tableRow.addCell("+/-", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "6.1", "vatAmount")), styleValueAmount, 1);
	
	//Printing of the objects with ID 7
	//We check if the final total value is positive or negative because we have to use different descriptions.
	//If negative we invert the sign
	if (get_value(param.form, "7", "vatAmount") > 0) {
		tableRow = table_1.addRow();
		tableRow.addCell("7.1", "", 1);
		tableRow.addCell("Vorauszahlung (Zahllast)", styleDescription, 1);
		tableRow.addCell(get_value(param.form, "7", "code"), styleDescription, 1);
		tableRow.addCell("", "", 2);
		tableRow.addCell("", "", 1);
		tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "7", "vatAmount")), styleValueTotal, 1);
	} else if (get_value(param.form, "7", "vatAmount") < 0) {
		tableRow = table_1.addRow();
		tableRow.addCell("7.2", "", 1);
		tableRow.addCell("Überschuss (Gutschrift)", styleDescription, 1);
		tableRow.addCell(get_value(param.form, "7", "code"), styleDescription, 1);
		tableRow.addCell("", "", 2);
		tableRow.addCell("-", "", 1);
		tableRow.addCell(Banana.Converter.toLocaleNumberFormat(get_value(param.form, "7", "vatAmount")*-1), styleValueTotal, 1);
	} else {
		tableRow = table_1.addRow();
		tableRow.addCell("7.1 / 7.2", "", 1);
		tableRow.addCell("Vorauszahlung (Zahllast) / Überschuss (Gutschrift)", styleDescription, 1);
		tableRow.addCell(get_value(param.form, "7", "code"), styleDescription, 1);
		tableRow.addCell("", "", 2);
		tableRow.addCell("", "", 1);
		tableRow.addCell("", styleValueTotal, 1);
	}
	
	//Verification of some total values
	check_totals(param.form, "4.13", "4.14;4.15;4.16;4.17;4.18;4.19", report, isTest);
	check_totals(param.form, "4.27", "4.28;4.29;4.30", report, isTest);
	
	//Verification of the balance values
	check_balance(banDoc, param.form, report, isTest);
		
	return report;
}




//The purpose of this function is to verify two sums.
//Given two lists of values divided by the character ";" the function creates two totals and compares them.
//It is also possible to compare directly single values, instead of a list of values.
function check_totals(source, valuesList1, valuesList2, report, isTest) {
	//Calculate the first total
	if (valuesList1) {
		var total1 = 0;
		var arr1 = valuesList1.split(";");
		for (var i = 0; i < arr1.length; i++) {
			total1 = Banana.SDecimal.add(total1, get_value(source, arr1[i], "vatTaxable"), {'decimals':rounding});
		}
	}
	
	//Calculate the second total
	if (valuesList2) {
		var total2 = 0;
		var arr2 = valuesList2.split(";");
		for (var i = 0; i < arr2.length; i++) {
			total2 = Banana.SDecimal.add(total2, get_value(source, arr2[i], "vatTaxable"), {'decimals':rounding});
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
		
		//Add a message on the report.
		report.addParagraph("Warning! Different values: Total " + valuesList1 + " <" + Banana.Converter.toLocaleNumberFormat(total1) + 
		">, Total " + valuesList2 + " <" + Banana.Converter.toLocaleNumberFormat(total2) + ">", "warningMsg");
	}
}




//The purpose of this function is to verify if the balance from Banana euquals the report total
function check_balance(banDoc, form, report, isTest) {
	//First, we get the total from the report, specifying the correct id total 
	var totalFromReport = get_value(form, "7", "vatAmount");

	//Second, we get the VAT balance table from Banana using the function Banana.document.vatReport([startDate, endDate]).
	//The two dates are taken directly from the structure. 
	var vatReportTable = banDoc.vatReport(get_value(form, "2.2", "openingDate"), get_value(form, "2.2", "closureDate"));
	
	//Now we can read the table rows values
	for (var i = 0; i < vatReportTable.rowCount; i++) {
		var tRow = vatReportTable.row(i);
		var group = tRow.value("Group");
		var vatBalance = tRow.value("VatBalance");
		
		//Since we know that the balance is summed in group named "_tot_", we check if that value equals the total from the report
		if (group === "_tot_") {
			//Now we can compare the two values using the Banana.SDecimal.compare() function and return a message if they are different.
			//In order to compare correctly the values we have to invert the sign of the result from Banana, using the Banana.SDecimal.invert() function.
			if (Banana.SDecimal.compare(totalFromReport, Banana.SDecimal.invert(vatBalance)) !== 0) {
				if (!isTest) {
					//Add an information dialog
					Banana.Ui.showInformation("Warning!", "Different values: " + 
					"Total from Banana <" + Banana.Converter.toLocaleNumberFormat(vatBalance) + 
					">, Total from report <" + Banana.Converter.toLocaleNumberFormat(totalFromReport) + ">");
				}

				//Add a message on the report
				report.addParagraph("Warning! Different values: " + 
				"Total from Banana <" + Banana.Converter.toLocaleNumberFormat(vatBalance) + 
				">, Total from report <" + Banana.Converter.toLocaleNumberFormat(totalFromReport) + ">", "warningMsg");
			}
		}
	}
}




//The purpose of this function is to calculate the vatTaxable and vatAmount balances, then load these values into the structure
function load_vat_balances(banDoc, form) {

	var vatCodes = banDoc.table("VatCodes");
	if (vatCodes === undefined || !vatCodes) {
		return;
	}
	
	for (var i in form) {
		//We use the Banana.document.vatCurrentBalance() function to calculate VAT taxable and VAT amount values
		var objVatCurrentBalance = banDoc.vatCurrentBalance(get_vat_codes(vatCodes, get_object(form, form[i]["id"]).code), get_value(form, "2.2", "openingDate"), get_value(form, "2.2", "closureDate"));
		form[i]["vatAmount"]  = 0;
		//vatClass decide the value to use
		if (form[i]["vatClass"] === "1") {
			form[i]["vatAmount"]  = objVatCurrentBalance.vatTaxable;
		}
		else if (form[i]["vatClass"] === "2") {
			form[i]["vatAmount"]  = Banana.SDecimal.invert(objVatCurrentBalance.vatTaxable);
		}
		else if (form[i]["vatClass"] === "3") {
			form[i]["vatAmount"]  = objVatCurrentBalance.vatPosted;
		}
		else if (form[i]["vatClass"] === "4") {
			form[i]["vatAmount"]  = Banana.SDecimal.invert(objVatCurrentBalance.vatPosted);
		}
	}
}


//This function return the difference in months between two dates
function get_month_diff(d1, d2) {	
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
function get_month_name(date) {
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
function calc_form_totals(form, fields) {
	for (var i = 0; i < form.length; i++) {
		calc_form_total(form, form[i].id, fields);
	}
}


//Calculate a total of the form
function calc_form_total(form, id, fields) {
	
	var valueObj = get_object(form, id);
	
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
			calc_form_total(form, entry, fields);  
			
		    for (var j = 0; j < fields.length; j++) {
				var fieldName = fields[j];
				var fieldValue = get_value(form, entry, fieldName);
				if (fieldValue) {
					if (isNegative) {
						//Invert sign
						fieldValue = Banana.SDecimal.invert(fieldValue);
					}
					valueObj[fieldName] = Banana.SDecimal.add(valueObj[fieldName], fieldValue, {'decimals':rounding});
				}
			}
		}
	} else if (valueObj.code) {
		//Already calculated in load_form_balances()
	}
}


//The purpose of this function is to return a specific field value from the object.
//When calling this function, it's necessary to speficy the source (the structure), the object ID, and the field (parameter) needed.
function get_value(source, id, field) {
	var searchId = id.trim();
	for (var i = 0; i < source.length; i++) {
		if (source[i].id === searchId) {
			return source[i][field];
		}
	}
	throw "Couldn't find object with id:" + id;
}


//This function is very similar to the get_value() function.
//Instead of returning a specific field from an object, this function return the whole object.
function get_object(source, id) {
	for (var i = 0; i < source.length; i++) {
		if (source[i]["id"] === id) {
			return source[i];
		}
	}
	throw "Couldn't find object with id: " + id;
}


//This function adds a Footer to the report
function add_footer(report, param) {
   report.getFooter().addClass("footer");
   var versionLine = report.getFooter().addText(param.bananaVersion + ", " + param.scriptVersion + ", ", "description");
   //versionLine.excludeFromTest();
   report.getFooter().addText("Seite ", "description");
   report.getFooter().addFieldPageNr();
}


//The main purpose of this function is to allow the user to enter the accounting period desired and saving it for the next time the script is run.
//Every time the user runs of the script he has the possibility to change the date of the accounting period.
function get_period_settings() {
	
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


//The main purpose of this function is to get all VAT codes of the same group and create a string with them, using the character "|" as separator
function get_vat_codes(vatCodesTable, codeStr) {

	var str = [];

	//Loop to take the values of each rows of the table
	for (var i = 0; i < vatCodesTable.rowCount; i++) {
		var tRow = vatCodesTable.row(i);
		var gr1 = tRow.value("Gr1");
		var vatCode = tRow.value("VatCode");

		//Check if there are Gr1 and VatCode values
		if (gr1 && vatCode) {

			//If Gr1 column contains other characters (in this case ";") we know there are more values.
			//We have to split them and take all values separately.
			//If there are only alphanumeric characters in Gr1 column we know there is only one value and we take it.
			var vatCodeString = gr1;
			var arrVatCodeString = vatCodeString.split(";");
			for (var j = 0; j < arrVatCodeString.length; j++) {
				var vatCodeString1 = arrVatCodeString[j];
				if (vatCodeString1 === codeStr) {
					str.push(vatCode);
				}
			}
		}
	}
	//We return the array adding a separator between elements
	return str.join("|");
}



//The main purpose of this function is to create styles for the report print
function create_styleSheet() {
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
