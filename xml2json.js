#include "C:\\Users\\n.kohir\\Documents\\xml2.js"; // Include the xml2.js library  
#include "C:\\Users\\n.kohir\\Documents\\utility.js"; // Include the utility.js library   

// Read the XML file
var xmlPath = "C:\\Users\\n.kohir\\Documents\\prova.odx-f";
var f = new File(xmlPath);
if (!f.open('r')) {                         
    print('Error opening file:', xmlPath);             
    return;
} 
var data = f.read();
f.close();

// Parse the XML using xml2.js
var xmlDoc = XML.parse(data);

// Find the <EXPECTED-IDENTS> section
var expectedIdents = XML.search(xmlDoc, '/ODX/FLASH/ECU-MEMS/ECU-MEM/MEM/SESSIONS/SESSION/EXPECTED-IDENTS');
if (!expectedIdents) {
    print('<EXPECTED-IDENTS> section not found');
    return;
}

// Extract ID names and values
var dataObj = {};
for (var i = 0; i < expectedIdents.length; i++) {
    var ident = XML.search(expectedIdents, 'EXPECTED-IDENT[' + i + ']');
    //print('Ident:', ident); // Debug print to see the entire ident object
    var identName = XML.data(XML.search(ident, 'SHORT-NAME'), '');
    //print('Ident Name:', identName); // Debug print
    var values = new Array();
    var valueElements = XML.search(ident, 'IDENT-VALUES');

    for (var j = 0; j < valueElements.length; j++) {
        var valueElement = XML.search(valueElements, 'IDENT-VALUE[' + j + ']');
        //print('Value Element:', valueElement); // Debug print to see the value element
        values.push(XML.data(valueElement, ''));
    }
    dataObj[identName] = values;
}

if(ft == 2){
    hwKey = "Supplier_ECU_Hardware_Part_Number";
    swKey = "Supplier_ECU_Software_Part_Number";
}
else if(ft < 2){
    swKey = 'Vehicle_Manufacturer_ECUSoftware_Number';
    hwKey = 'Vehicle_Manufacturer_ECUHardware_Number';
}        
else if(ft > 0 && ft < 10){
    var hwKey = 'Vehicle_Manufacturer_ECU_Hardware_Number';
    var swKey = 'Vehicle_Manufacturer_ECU_Software_Number'; 
}
   
//print('Vehicle_Manufacturer_ECU_Hardware_Number:');
var hwValid = false;
var swValid = false;
for (var k = 0; k < dataObj[hwKey].length; k++) {
    print(dataObj[hwKey][k]);
    if(hwn == dataObj[hwKey][k]){
        display('Hardware Matched');
        hwValid = true;
        return 0;
    }
}
if(!hwValid){
    display('Incompatible Hardware');
    return 0;
} 

for (var k = 0; k < dataObj[swKey].length; k++) {
    print(dataObj[swKey][k]);
    if(swn == dataObj[swKey][k]){
        i, e = Diag4.doJob("download\n" + idx, 3600, true); // execute the real reflashing process
        if (i) { // display("Reflash #1\r\n" + String.gsub(i, "\n", "\r\n"))
            log("\t" + String.gsub(i, "\n", "\r\n\t"));
            if (String.strfind(i, "DownLoad Completed") != nil || String.strfind(i, "Test Completed") != nil) {
                display(ecu + " reflash: OK");
                return 2;
            } // end if (String.strfind(i, "DownLoad Completed") != nil || String.strfind(i, "Test Completed") != nil)
        } else {
            display("Reflash failed: " + e);
            return -1;
        } // end if (i)
    } else {
        display("  Incompatible Software");
    }
}




