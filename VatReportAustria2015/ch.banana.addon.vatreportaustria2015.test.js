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
// @id = ch.banana.addon.vatreportaustria2015.test
// @api = 1.0
// @pubdate = 2015-05-19
// @publisher = Banana.ch SA
// @description = Test Vat Report Austria 2015
// @task = app.command
// @doctype = 100.110;100.130
// @docproperties = austria
// @outputformat = none
// @inputdatasource = none
// @includejs = ch.banana.addon.vatreportaustria2015.js
// @includejs = ch.banana.addon.vatreportaustria2015.test.difftext.js
// @timeout = -1


function exec() {
	
	var Test = Banana.Test;
	var expectedDate = new Date();
	
	
	//------------------------------------
	//Generate the expected (correct) file
	//------------------------------------
	
	//Open the banana document
	var banDoc1 = Banana.application.openDocument("C:/Users/ivan/Documents/GitHub/Austria/VatReportAustria2015/2015_Buchhaltung_example.ac2");
	
	Test.logger.addSection("Example 1");

	Test.logger.addSubSection("Whole year report");
	report_test(banDoc1, "2015-01-01", "2015-12-31", "Whole year report");
	
	Test.logger.addSubSection("Second trimester report");
	report_test(banDoc1, "2015-04-01", "2015-06-30", "Second trimester report");
	
	Test.logger.addSubSection("January report");
	report_test(banDoc1, "2015-01-01", "2015-01-31", "January report");
	
	Test.logger.addSubSection("Vat codes table");
	table_test(banDoc1, "Vat codes table");


	//-----------------------------
	//Generate the file with errors
	//-----------------------------
	
	//Open the banana document
	var banDoc2 = Banana.application.openDocument("C:/Users/ivan/Documents/GitHub/Austria/VatReportAustria2015/2015_Buchhaltung_test_error.ac2");
	
	Test.logger.addSection("Example with errors");
	
	Test.logger.addSubSection("Whole year report");
	report_test(banDoc2, "2015-01-01", "2015-12-31", "Whole year report");
	
	Test.logger.addSubSection("Second trimester report");
	report_test(banDoc2, "2015-04-01", "2015-06-30", "Second trimester report");
	
	Test.logger.addSubSection("January report");
	report_test(banDoc2, "2015-01-01", "2015-01-31", "January report");
	
	Test.logger.addSubSection("Vat codes table 2");
	table_test(banDoc2, "Vat codes table");

	
	
	
	//-------------------------------
	//Informations / texts comparison
	//-------------------------------
	
	//Save all LaTex text of the expected and the current files in order to compare them.
	var expected = Test.expectedResults();
	var current = Test.currentResults();
	
	//Compare the two files and get some info
	var diffArray = [];
	var arrCnt = [];
	
	//Function call to compare the files and save the differences
	diffArray = diff_text(expected, current, arrCnt);
	
	//Get some info from the files to add them on the report
	var a = expected.split('\n'); //Expected file
	var expectedDate = "";
	var rows1 = 0;
	for (var i = 0; i < a.length; i++) {
		if (a[i].substring(0,16) === "%%info_test_date") {
			expectedDate = a[i].substring(16);
		}
		rows1++;
	}
	
	var b = current.split('\n'); //Current file
	var currentDate = "";
	var rows2 = 0;
	for (var i = 0; i < b.length; i++) {
		if (b[i].substring(0,16) === "%%info_test_date") {
			currentDate = b[i].substring(16);
		}
		rows2++;
	}
	
	//Add some informations to the report
	Test.logger.addSection("General informations");
	Test.logger.addComment("Expected file creation date: " + expectedDate);
	Test.logger.addComment("Current file creation date: " + currentDate);
	Test.logger.addComment("Number of rows compared: " + arrCnt[3]);
	Test.logger.addComment("Number of identical rows: " + arrCnt[0]);
	Test.logger.addComment("Number of added rows: " + arrCnt[1]);
	Test.logger.addComment("Number of deleted rows: " + arrCnt[2]);
	Test.logger.addComment("Total number rows Expected file: " + rows1);
	Test.logger.addComment("Total number rows Current file: " + rows2);

	//Add differences to the report
	Test.logger.addSection("Files differences");
	if (diffArray.length > 0) {
		for (var i = 0; i < diffArray.length; i++) {
			Test.logger.addComment(diffArray[i]);
		}
	} else {
		Test.logger.addComment("There are no differences.");
	}
	

}



//Function that create the report for the test
function report_test(banDoc, startDate, endDate, reportName) {
	var Test = Banana.Test;
	
	//Variable used by the create_vat_report() function to define the kind of report to create: "normal-report" or "test-report".
	//The reports are differents: on test-report we don't want to display any dialog boxes.
	var isTest = true;
	
	var vatReport = create_vat_report(banDoc, startDate, endDate, isTest);
	Test.logger.addReport(reportName, vatReport);
}


	
//Function that create the table for the test
function table_test(banDoc, tableName) {
	var Test = Banana.Test;
	if (banDoc)
	{
		var table = banDoc.table("VatCodes");
		Test.logger.addTable(tableName, table, ["Group","VatCode","Description","Gr","Gr1","IsDue","AmountType","VatRate","VatRateOnGross","VatAccount"]);
	}
}
