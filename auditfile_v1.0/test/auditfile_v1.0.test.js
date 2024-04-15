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


// @id = ch.banana.bananaapp.aut.auditfile.test
// @api = 1.0
// @pubdate = 2024-04-15
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.bananaapp.aut.auditfile.js>
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../auditfile_v1.0.js



// Register test case to be executed
Test.registerTestCase(new AuditfileAustria());

// Here we define the class, the name of the class is not important
function AuditfileAustria() {

}

// This method will be called at the beginning of the test case
AuditfileAustria.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
AuditfileAustria.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
AuditfileAustria.prototype.init = function() {

}

// This method will be called after every test method is executed
AuditfileAustria.prototype.cleanup = function() {

}

// Generate the expected (correct) file
AuditfileAustria.prototype.testBananaApp = function() {

  var banDoc = Banana.application.openDocument("file:script/../test/testcases/company_2016.ac2");
  Test.assert(banDoc);
  this.xml_test(banDoc);

  var banDoc = Banana.application.openDocument("file:script/../test/testcases/company_2024.ac2");
  Test.assert(banDoc);
  this.xml_test(banDoc);

}

AuditfileAustria.prototype.xml_test = function(banDoc) {
  
  var xml = createXml(banDoc);
  xml = xml.replace(/<dateCreated>[\s\S]*?<\/dateCreated>/, '<dateCreated>' + '2019-03-12' + '<\/dateCreated>');
  xml = xml.replace(/<productVersion>[\s\S]*?<\/productVersion>/, '<productVersion>' + '#lastVersion' + '<\/productVersion>');
  Test.logger.addXml("This is a xml value", xml);

  this.xml_validate_test(xml, '../auditfile.xsd');

}

AuditfileAustria.prototype.xml_validate_test = function(xmlDocument, schemaFileName) {
  
  // Validate against schema (schema is passed as a file path relative to the script)
  if (Banana.Xml.validate(Banana.Xml.parse(xmlDocument), schemaFileName)) {
      Test.logger.addText("Validation result => Xml document is valid against " + schemaFileName);
  } else {
      Test.logger.addText("Validation result => Xml document is not valid againts " + schemaFileName + ": " + Banana.Xml.errorString);
  }
}


