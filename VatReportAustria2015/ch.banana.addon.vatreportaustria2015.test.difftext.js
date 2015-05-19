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
// @id = ch.banana.addon.vatreportaustria2015.test.difftext
// @api = 1.0
// @pubdate = 2015-05-19
// @publisher = Banana.ch SA
// @description = Compare two text files
// @task = app.command
// @doctype = 100.110;100.130
// @docproperties = austria
// @outputformat = none
// @inputdatasource = none
// @timeout = -1




//Function that finds differences between two text.
//Texts are compared line-by-line and the differences are displayed also line-by-line
function diff_text(text1, text2, arrCnt) {
	
	var diffText = [];
	var cntEqu = 0; //arrCnt[0], variable used to count the rows remained the same
	var cntAdd = 0;	//arrCnt[1], variable used to count the added rows
	var cntDel = 0;	//arrCnt[2], variable used to count the deleted rows
	var cntTot = 0;	//arrCnt[3], variable used to count the total rows
	
	var arr1 = text1.split('\n'); //Expected text
	var arr2 = text2.split('\n'); //Current text
	var arrText1 = [];
	var arrText2 = [];
	
	//Expected file - For comparison we take only "non-comment" lines
	for (var i = 0; i < arr1.length; i++) {
		//if (arr1[i].substring(0,1) !== "%" && arr1[i].substring(0,1) !== "\\") {
		if (arr1[i].substring(0,1) !== "%") {
			arrText1.push(arr1[i]);
		}
	}
	//Current file - For comparison we take only "non-comment" lines
	for (var i = 0; i < arr2.length; i++) {
		//if (arr2[i].substring(0,1) !== "%" && arr2[i].substring(0,1) !== "\\") {
		if (arr2[i].substring(0,1) !== "%") {
			arrText2.push(arr2[i]);
		}
	}
	
	function make_row(x, y, type, text) {
		if (type === "+") { //Row added
			diffText.push(y + " " + x + " " + type + " " + text);
			cntAdd++;
			cntTot++;
		} else if (type === "-") { //Row deleted
			diffText.push(y + " " + x + " " + type + " " + text);
			cntDel++;
			cntTot++;
		} else if (type === " ") { //Row equals
			cntEqu++;
			cntTot++;
		}
		
		arrCnt[0] = cntEqu;
		arrCnt[1] = cntAdd;
		arrCnt[2] = cntDel;
		arrCnt[3] = cntTot;
	}
 
	function get_diff(matrix, a1, a2, x, y) {
		if (x > 0 && y > 0 && a1[y-1] === a2[x-1]) {
			get_diff(matrix, a1, a2, x-1, y-1);
			make_row(x, y, ' ', a1[y-1]);
		} else {
			if (x > 0 && (y === 0 || matrix[y][x-1] >= matrix[y-1][x])) {
				get_diff(matrix, a1, a2, x-1, y);
				make_row(x, '', '+', a2[x-1]);
			} else if (y > 0 && (x === 0 || matrix[y][x-1] < matrix[y-1][x])) {
				get_diff(matrix, a1, a2, x, y-1);
				make_row('', y, '-', a1[y-1]);
			} else {
				return;
			}
		}
	}

	function diff(a1, a2) {
		var matrix = new Array(a1.length + 1);
		var x, y;
	
		for (y = 0; y < matrix.length; y++) {
			matrix[y] = new Array(a2.length + 1);
			
			for (x = 0; x < matrix[y].length; x++) {
				matrix[y][x] = 0;
			}
		}
		
		for (y = 1; y < matrix.length; y++) {
			for (x = 1; x < matrix[y].length; x++) {
				if (a1[y-1] === a2[x-1]) {
					matrix[y][x] = 1 + matrix[y-1][x-1];
				} else {
					matrix[y][x] = Math.max(matrix[y-1][x], matrix[y][x-1]);
				}
			}
		}
		get_diff(matrix, a1, a2, x-1, y-1);
	}

	diff(arrText1, arrText2);
	
	return diffText;
}