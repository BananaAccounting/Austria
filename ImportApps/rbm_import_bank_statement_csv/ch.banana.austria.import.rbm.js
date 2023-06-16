// @id = ch.banana.switzerland.import.rbm
// @api = 1.0
// @pubdate = 2023-06-16
// @publisher = Banana.ch SA
// @description = Raiffeisenbank Burgenland Mitte - Import bank account statement .csv (Banana+ Advanced)
// @description.en = Raiffeisenbank Burgenland Mitte - Import bank account statement .csv (Banana+ Advanced)
// @description.de = Raiffeisenbank Burgenland Mitte - Kontoauszug importieren .csv (Banana+ Advanced)
// @description.fr = Raiffeisenbank Burgenland Mitte - Importer un relevé de compte bancaire .csv (Banana+ Advanced)
// @description.it = Raiffeisenbank Burgenland Mitte - Importa movimenti estratto conto bancario .csv (Banana+ Advanced)
// @doctype = *
// @docproperties =
// @task = import.transactions
// @outputformat = transactions.simple
// @inputdatasource = openfiledialog
// @inputencoding = latin1
// @inputfilefilter = Text files (*.txt *.csv);;All files (*.*)
// @inputfilefilter.de = Text (*.txt *.csv);;Alle Dateien (*.*)
// @inputfilefilter.fr = Texte (*.txt *.csv);;Tous (*.*)
// @inputfilefilter.it = Testo (*.txt *.csv);;Tutti i files (*.*)
// @includejs = import.utilities.js

/**
 * Parse the data and return the data to be imported as a tab separated file.
 */
function exec(string, isTest) {

	var importUtilities = new ImportUtilities(Banana.document);

	if (isTest !== true && !importUtilities.verifyBananaAdvancedVersion())
		return "";

	var transactions = Banana.Converter.csvToArray(string, ';', '§');

	// Format 1
	var format1 = new RBMFormat1();
	if (format1.match(transactions)) {
		transactions = format1.convert(transactions);
		return Banana.Converter.arrayToTsv(transactions);
	}

	importUtilities.getUnknownFormatError();

	return "";
}

/**
 * Raiffeisenbank Burgenland mitte Format 1
 * 
 * 02.01.2023;Diarappationäsall: DIS;02.01.2023;-56,9;TOM;02.01.2023 01:17:30:116
 * 02.01.2023;Diarappationäsall:  Tudivit AT;02.01.2023;-2485,79;TOM;02.01.2023 01:38:08:498
 * 02.01.2023;Diarappationäsall:  Rentinossidico AT ;02.01.2023;-33,06;TOM;02.01.2023 02:13:08:166
 * 
 */
function RBMFormat1() {
	this.colDate = 0;
	this.colDescr = 1;
	this.colAmount = 3;
	this.currency = 4;
	this.colDateTime = 5;

	this.colCount = 6;

	/** Return true if the transactions match this format */
	this.match = function (transactions) {
		if (transactions.length === 0)
			return false;

		for (i = 0; i < transactions.length; i++) {
			var transaction = transactions[i];

			var formatMatched = false;

			/* array should have all columns */
			if (transaction.length === (this.colCount))
				formatMatched = true;
			else
				formatMatched = false;

			if (formatMatched && transaction[this.colDate] &&
				transaction[this.colDate].match(/^[0-9]+\.[0-9]+\.[0-9]+$/))
				formatMatched = true;
			else
				formatMatched = false;

			if (formatMatched && transaction[this.colDateTime]
				&& transaction[this.colDateTime].match(/^(\d{2}\.\d{2}\.\d{4}|\d{2}-\d{2}-\d{4}) \d{2}:\d{2}:\d{2}:\d{3}$/)) //Data example: 02.01.2023 01:17:30:116
				formatMatched = true;
			else
				formatMatched = false;

			if (formatMatched)
				return true;
		}

		return false;
	}

	/** Convert the transaction to the format to be imported */
	this.convert = function (transactions) {
		var transactionsToImport = [];

		// Filter and map rows
		for (i = 0; i < transactions.length; i++) {
			var transaction = transactions[i];
			if (transaction.length < (this.colCount)) {
				continue;
			}
			if (transaction[this.colDate]
				&& transaction[this.colDateTime]) {
				transactionsToImport.push(this.mapTransaction(transaction));
			}
		}

		// Add header and return
		var header = [["Date", "Doc", "Description", "Income", "Expenses"]];
		return header.concat(transactionsToImport);
	}

	this.mapTransaction = function (element) {
		var mappedLine = [];

		var dateText = element[this.colDate].substring(0, 10);
		if (dateText.indexOf(".") > -1)
			mappedLine.push(Banana.Converter.toInternalDateFormat(dateText, "dd.mm.yyyy"));
		else
			mappedLine.push(Banana.Converter.toInternalDateFormat(dateText, "yyyy-mm-dd"));
		mappedLine.push(""); // Doc is empty for now
		mappedLine.push(element[this.colDescr]);
		if (element[this.colAmount].length > 0) {
			if (element[this.colAmount].substring(0, 1) === '-') {
				mappedLine.push("");
				var amount;
				if (element[this.colAmount].length > 1)
					amount = element[this.colAmount].substring(1);
				mappedLine.push(Banana.Converter.toInternalNumberFormat(amount, ','));
			} else {
				mappedLine.push(Banana.Converter.toInternalNumberFormat(element[this.colAmount], ','));
				mappedLine.push("");
			}
		} else {
			mappedLine.push("");
			mappedLine.push("");
		}

		return mappedLine;
	}
}
