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
// @id = ch.banana.addon.zm
// @api = 1.0
// @pubdate = 2015-09-18
// @publisher = Banana.ch SA
// @description = Zusammenfassende Meldung (ZM)
// @task = app.command
// @doctype = 100.110
// @docproperties = austria
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



var scriptVersion = "script v. 2016-10-12";


//Main function
function exec(string) {

	//Check if we are on an opened document
	if (!Banana.document) {
		return;
	}

	//Function call to manage and save user settings about the period date
	var dateform = getPeriodSettings(Banana.document);

	if (dateform) {

		//Function call to create the report
		var report = createReport(Banana.document, dateform.selectionStartDate, dateform.selectionEndDate);

		//Print the report
		var stylesheet = createStyleSheet();
		Banana.Report.preview(report, stylesheet);
	}
}



//------------------------------------------------------------------------------//
// FUNCTIONS
//------------------------------------------------------------------------------//

//The purpose of this function is return an object containing the VAT number informations
function getVatNumberInfo(banDoc, startDate, endDate, vatNumberForm) {

	//Create a table with all transactions
	var journal = banDoc.journal(banDoc.ORIGINTYPE_CURRENT, banDoc.ACCOUNTTYPE_NORMAL);

	//Read the table and save some values
	for (var rowNumber = 0; rowNumber < journal.rowCount; rowNumber++) {
		var tRow = journal.row(rowNumber);
		
		var jdate = tRow.value("JDate");

		//We get only data for the period choosen
		if (jdate >= startDate && jdate <= endDate) {

			var doc = tRow.value("Doc");
			var jvatcodevithoutsign = tRow.value("JVatCodeWithoutSign");
			var jvattaxable = tRow.value("JVatTaxable");
			var vatnumber = tRow.value("VatNumber");
			var jaccount = tRow.value("JAccount");

			if (jvatcodevithoutsign === "U-IGLI" || jvatcodevithoutsign === "U-IGLE") {
				
				vatNumberForm.push({
					"Doc":doc,
					"Jvatcodevithoutsign":jvatcodevithoutsign,
					"Jvattaxable":jvattaxable,
					"Vatnumber":vatnumber,
					"Jaccount":jaccount
				});
			}
		}
	}

	//Removing duplicates from the form. We check "Doc" and "Vatnumber" properties
	for (var i = 0; i < vatNumberForm.length; i++) {
		for (var x = i+1; x < vatNumberForm.length; x++) {
			if (vatNumberForm[x]["Vatnumber"] === vatNumberForm[i]["Vatnumber"] && vatNumberForm[x]["Doc"] === vatNumberForm[i]["Doc"]) {
				vatNumberForm.splice(x,1);
				--x;
			}
		}
	}

	return vatNumberForm;
}


function getVatNumberList(vatNumberForm) {

	var vatNumberList = [];

	for (var i = 0; i < vatNumberForm.length; i++) {
		vatNumberList.push(vatNumberForm[i]["Vatnumber"]);
	}

	//Removing duplicates
	for (var i = 0; i < vatNumberList.length; i++) {
		for (var x = i+1; x < vatNumberList.length; x++) {
			if (vatNumberList[x] === vatNumberList[i]) {
				vatNumberList.splice(x,1);
				--x;
			}
		}
	}

	return vatNumberList;
}


function regroup(vatNumberForm, vatCode1, vatCode2) {

	//Take all the vat number removing the duplicates
	var vatNumberList = getVatNumberList(vatNumberForm);

	var regroupedForm = [];
	var sum1 = 0;
	var sum2 = 0;

	for (var j = 0; j < vatNumberList.length; j++) {

		for (var i = 0; i < vatNumberForm.length; i++) {

			if (vatNumberForm[i]['Vatnumber'] === vatNumberList[j] && vatNumberForm[i]['Jvatcodevithoutsign'] === vatCode1) { //"U-IGLI"

				var vatTaxable1;

				if (Banana.SDecimal.sign(vatNumberForm[i]["Jvattaxable"]) < 0) {
					vatTaxable1 = Banana.SDecimal.invert(vatNumberForm[i]["Jvattaxable"]);
				} else {
					vatTaxable1 = vatNumberForm[i]["Jvattaxable"];
				}
				sum1 = Banana.SDecimal.add(sum1,vatTaxable1);
			}
		}

		regroupedForm.push({
			"Vatnumber":vatNumberList[j],
			"Jvattaxable":sum1,
			"Lieferung":"1",
			"Leistung":""
		});

		sum1 = 0;



		for (var i = 0; i < vatNumberForm.length; i++) {

			if (vatNumberForm[i]['Vatnumber'] === vatNumberList[j] && vatNumberForm[i]['Jvatcodevithoutsign'] === vatCode2) { //"U-IGLE"
					
				var vatTaxable2;

				if (Banana.SDecimal.sign(vatNumberForm[i]["Jvattaxable"]) < 0) {
					vatTaxable2 = Banana.SDecimal.invert(vatNumberForm[i]["Jvattaxable"]);
				} else {
					vatTaxable2 = vatNumberForm[i]["Jvattaxable"];
				}
				sum2 = Banana.SDecimal.add(sum2,vatTaxable2);
			}
		}

		regroupedForm.push({
			"Vatnumber":vatNumberList[j],
			"Jvattaxable":sum2,
			"Lieferung":"",
			"Leistung":"1"
		});

		sum2 = 0;
	}

	return regroupedForm;
}



//The purpose of this function is to check if the given VAT number is real or not
function checkVATNumber(vatNumber) {
	if (vatNumber.length == 11) {
		return true;
	} else {
		return false;
	}
}


//The purpose of this function is to print the report
function createReport(banDoc, startDate, endDate) {

	var report = Banana.Report.newReport("VAT list details");

	report.addParagraph("Zusammenfassende Meldung", "heading1");
	report.addParagraph(" ", "");
	report.addParagraph("Meldezeitraum: " + Banana.Converter.toLocaleDateFormat(startDate) + " bis " + Banana.Converter.toLocaleDateFormat(endDate), "heading3");
	report.addParagraph(" ");

	//Create the table
	var table = report.addTable("table");

	//Add columns header
	var tableHeader = table.getHeader();
	tableRow = tableHeader.addRow();
	tableRow.addCell("Zeile", "valueTitle", 1);
	tableRow.addCell("Umsatzsteuer-Identifikationsnummer", "valueTitle", 1);
	tableRow.addCell("Summe der Bemessungsgrundlagen " + "(" + banDoc.info("AccountingDataBase", "BasicCurrency") + ")", "valueTitle", 1);
	tableRow.addCell("Lieferung", "valueTitle", 1);
	tableRow.addCell("Leistung", "valueTitle", 1);

	//Create the form that contains the data
	var vatNumberForm = [];
	vatNumberForm = getVatNumberInfo(banDoc, startDate, endDate, vatNumberForm);

	//Create the form that contains the data
	var regroupedForm = regroup(vatNumberForm, "U-IGLI", "U-IGLE");
	var r = 1;
	for (var i = 0; i < regroupedForm.length; i++) {

		if (regroupedForm[i]["Jvattaxable"] && regroupedForm[i]["Jvattaxable"] != 0) {

			/* ROW NUMBER */
			tableRow = table.addRow();
			tableRow.addCell(r, "valueText", 1);
		
			/* VAT NUMBER */
			//We check if the VAT number is real
			if (checkVATNumber(regroupedForm[i]["Vatnumber"])) {
				tableRow.addCell(regroupedForm[i]["Vatnumber"], "valueVatNumber", 1);
			} else {
				//If it is not real we print it with a warning message
				tableRow.addCell("Invalid VAT Number <" + regroupedForm[i]["Vatnumber"] + "> ", "valueVatNumber warningMsg", 1);
			}
			
			/* VAT TAXABLE */
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(Banana.SDecimal.round(regroupedForm[i]["Jvattaxable"], {'decimals':0})), "valueAmount", 1);

			/* LIEFERUNG */
			tableRow.addCell(regroupedForm[i]["Lieferung"], "valueText", 1);

			/* LEISTUNG */
			tableRow.addCell(regroupedForm[i]["Leistung"], "valueText", 1);
		
			r++;
		}
	}


	//Add a footer to the report
	addFooter(banDoc, report);

	return report;
}


//The purpose of this function is to get the period choosen from the user
function getPeriodSettings(banDoc) {
	
	//The parameters of the period that we need
	var scriptform = {
	   "selectionStartDate": "",
	   "selectionEndDate": "",
	   "selectionChecked": "false"
	};

	//Read script settings
	var data = banDoc.scriptReadSettings();
	
	//Check if there are previously saved settings and read them
	if (data.length > 0) {
		try {
			var readSettings = JSON.parse(data);
			
			//We check if "readSettings" is not null, then we fill the parameters with the values just read
			if (readSettings) {
				scriptform = readSettings;
			}
		} catch (e){}
	}
	
	//We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
	var docStartDate = banDoc.startPeriod();
	var docEndDate = banDoc.endPeriod();	
	
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
		var value = banDoc.scriptSaveSettings(formToString);		
    } else {
		//User clicked cancel
		return;
	}
	return scriptform;
}


//The purpose of this function is add a footer to the report
function addFooter(banDoc, report) {
	report.getFooter().addClass("footer");
	report.getFooter().addText("Banana Accounting, v. " + banDoc.info("Base", "ProgramVersion") + ", " + scriptVersion + " (TEST VERSION)", "footer");
}


//The main purpose of this function is to create styles for the report print
function createStyleSheet() {
	var stylesheet = Banana.Report.newStyleSheet();

    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "10mm 20mm 10mm 20mm");
	
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

	style = stylesheet.addStyle(".valueAmount");
	style.setAttribute("font-size", "9px");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("text-align", "right");

	style = stylesheet.addStyle(".valueVatNumber");
	style.setAttribute("font-size", "9px");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("text-align", "left");
	
	style = stylesheet.addStyle(".valueText");
	style.setAttribute("font-size", "9px");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("text-align", "center");
	
	style = stylesheet.addStyle(".valueTitle");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#000000");
	style.setAttribute("color", "#fff");
	
	style = stylesheet.addStyle("table");
	style.setAttribute("width", "100%");
	style.setAttribute("font-size", "8px");
	stylesheet.addStyle("table.table td", "border: thin solid black");

	style = stylesheet.addStyle(".warningMsg");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("color", "red");
	style.setAttribute("font-size", "9");

	return stylesheet;
}
