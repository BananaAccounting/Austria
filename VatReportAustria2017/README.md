# Vat Report Austria
## How to use the Vat Report
1. Install last version of Banana 8 [http://www.banana.ch/de/download_de]
2. Download github directory BananaAccounting/Austria as a zip file  [https://github.com/BananaAccounting/Austria/archive/master.zip]  
3. Extract the zip file to a directory in your computer. 
4. Start Banana Accounting 8
5. From Menu AddOns->Manage Apps add the script "ch.banana.addon.vatreportaustria2017.js" (file is in the directory Austria/VatReport2017)
6. Open example file: "MusterdateiUSt2017.ac2"
7. Menu AddOns->Vat report Austria 2017_Buchhaltung_example


## Modify the VatTable to use the script
If you have an existing accounting file you need to adapt the VatCode Table.
See the example file "MusterdateiUSt2017.ac2"
* Open your accounting file 
* Go in the VatTable
* Go in the View Complete
* Insert in the columns Gr1 the field numbers of the Vat Form
  If a VatCode goes in more fields separate the numbers with the semicolons.

## Information regarding the javascript working

 The script works in this way:
* Each Vat code in the Vat Table has in the column Gr1 the Vat form position number. In case the Vat amount must be grouped in in more then one position the numbers are separated by the semicolumn.
* The function crateVatReport contains all the logic to extract the data.
* The function loadForm create an array with all the results needed and the corresponding Gr1. 
* The id is the group name
* The gr correspond to the number indicated in the gr1 column of the vat table. 
* The vatClass parameters that indicate what VatAmount i requested.
  * 1 = Vorsteuer vatTaxable
  * 2 = Umsatzsteur vatTaxable
  * 3 = Vorsteuer vatPosted
  * 4 = Umsatzsteur vatPosted
* The sum parameters allow to specify that some groups must be summed or subrated (minus before).
* The function loadBalances() retrieve the values from the accounting file and put the value in the form.
* The function calcFormTotals() do the sum in the form.
* The function postProcessAmounts allow to do postprocessing task, like makeing more elaborate calculations or do checks.
* The funcition formatValues will convert the amount in a local formatting value. 
In other script version we do not replace the amount but create another property "fieldNameFormatted" in this case "amountFormatted".

At the end the printed report is created.	

