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
// @timeout = -1


function exec() {
	
	var Test = Banana.Test;
	var expectedDate = new Date();
	
	
	//------------------------------------
	//Generate the expected (correct) file
	//------------------------------------
	
	//Open the banana document
   var banDoc1 = Banana.application.openDocument("2015_Buchhaltung_example.ac2");
	
	Test.logger.addSection("Example 1");
	report_test(banDoc1, "2015-01-01", "2015-12-31", "Whole year report");
	report_test(banDoc1, "2015-04-01", "2015-06-30", "Second trimester report");
	report_test(banDoc1, "2015-01-01", "2015-01-31", "January report");
	table_test(banDoc1, "Vat codes table");

	//-----------------------------
	//Generate the file with errors
	//-----------------------------
	
	//Open the banana document
   var banDoc2 = Banana.application.openDocument("2015_Buchhaltung_test_error.ac2");
	
   Test.logger.addSection("Example with errors");
	report_test(banDoc2, "2015-01-01", "2015-12-31", "Whole year report");
	report_test(banDoc2, "2015-04-01", "2015-06-30", "Second trimester report");
	report_test(banDoc2, "2015-01-01", "2015-01-31", "January report");
	table_test(banDoc2, "Vat codes table");
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
