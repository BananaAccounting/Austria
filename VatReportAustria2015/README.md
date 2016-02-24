# Vat Report Austria
## How to use the Vat Report
1. Install last version of Banana 8 [http://www.banana.ch/de/download_de]
2. Download github directory BananaAccounting/Austria as a zip file  [https://github.com/BananaAccounting/Austria/archive/master.zip]  
3. Extract the zip file to a directory in your computer. 
4. Start Banana Accounting 8
5. From Menu AddOns->Manage Apps add the script "ch.banana.addon.vatreportaustria2015.js" (file is in the directory Austria/VatReport2015)
6. Open example file: "2015_Buchhaltung_example.ac2"
7. Menu AddOns->Vat report Austria 2015_Buchhaltung_example


## Modify the VatTable to use the script
If you have an existing accounting file you need to adapt the VatCode Table.
See the example file "2015_Buchhaltung_example.ac2"
* Open your accounting file 
* Go in the VatTable
* Go in the View Complete
* Insert in the columns Gr1 the field numbers of the Vat Form
  If a VatCode goes in more fields separate the numbers with the semicolons.

