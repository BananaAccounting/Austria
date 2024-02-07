// Copyright [2024] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.a.app.vatreportaustria2024.test
// @api = 1.0
// @pubdate = 2024-02-07
// @publisher = Banana.ch SA
// @description = Test Vat Report Austria 2024
// @task = app.command
// @doctype = nodocument
// @docproperties = austria
// @outputformat = none
// @inputdatasource = none
// @includejs = ../ch.banana.a.app.vatreportaustria2024.js
// @timeout = -1

// Register this test case to be executed
Test.registerTestCase(new TestVatReport2024());

// Define the test class, the name of the class is not important
function TestVatReport2024() {

}

// This method will be called at the beginning of the test case
TestVatReport2024.prototype.initTestCase = function() {
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestVatReport2024.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
TestVatReport2024.prototype.init = function() {

}

// This method will be called after every test method is executed
TestVatReport2024.prototype.cleanup = function() {

}

// Every method with the prefix 'test' are executed automatically as test method
// You can defiend as many test methods as you need

// Generate the expected (correct) file
TestVatReport2024.prototype.testExample1 = function() {
   //Open the banana document
   var banDoc1 = Banana.application.openDocument("file:script/testcases/2024_Buchhaltung_Example.ac2");
   Test.assert(banDoc1);

   this.report_test(banDoc1, "2024-01-01", "2024-12-31", "Whole year report");
   this.report_test(banDoc1, "2024-04-01", "2024-06-30", "Second trimester report");
   this.report_test(banDoc1, "2024-01-01", "2024-01-31", "January report");
   this.table_test(banDoc1, "Vat codes table");
}

//Function that create the report for the test
TestVatReport2024.prototype.report_test = function (banDoc, startDate, endDate, reportName) {
	//Variable used by the create_vat_report() function to define the kind of report to create: "normal-report" or "test-report".
	//The reports are differents: on test-report we don't want to display any dialog boxes.
   var isTest = true;
   var vatReport = createVatReport(banDoc, startDate, endDate, isTest);
	Test.logger.addReport(reportName, vatReport);
}

//Function that create the table for the test
TestVatReport2024.prototype.table_test = function(banDoc, tableName) {
	if (banDoc)	{
		var table = banDoc.table("VatCodes");
		Test.logger.addTable(tableName, table, ["Group","VatCode","Description","Gr","Gr1","IsDue","AmountType","VatRate","VatRateOnGross","VatAccount"]);
	}
}
