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

var keys = {
    hwKey: null,
    swKey: null,
    appNumKey: null,
    calNumKey: null,
    bootKey: null,
    appInfoKey: null,
    appDataKey: null,
    dataLibKey: null,
    appsKey: null
};

if (ft == 2) {
    keys.hwKey = "Supplier_ECU_Hardware_Part_Number";
    keys.swKey = "Supplier_ECU_Software_Part_Number";
} else if (ft < 2) {
    keys.swKey = 'Vehicle_Manufacturer_ECUSoftware_Number';
    keys.hwKey = 'Vehicle_Manufacturer_ECUHardware_Number';
} else if (ft > 0 && ft < 10) {
    keys.hwKey = 'Vehicle_Manufacturer_ECU_Hardware_Number';
    keys.swKey = 'Vehicle_Manufacturer_ECU_Software_Number';
    keys.appNumKey = 'Vehicle_Manufacturer_ECU_Software_Application_Number';
    keys.calNumKey = 'Vehicle_Manufacturer_ECU_Software_Calibration_Number';
} else if (ft >= 10 && ft <= 13) {
    keys.hwKey = 'Vehicle_Manufacturer_ECU_Hardware_Number';
    keys.bootKey = 'Boot_Software_Version_Information';
    keys.appInfoKey = 'Application_Software_Information';
    keys.appDataKey = 'Application_Data_Information';
    keys.dataLibKey = 'Data_Library_Information';
    keys.appsKey = 'APPs_Information';
}

function validateKey(key, value) {
    if (!dataObj[key]) return false;
    return dataObj[key].includes(value);
}

if (!validateKey(keys.hwKey, hwn)) {
    display('Incompatible Hardware');
    return 0;
}

if (!validateKey(keys.swKey, swn)) {
    display('Incompatible Software');
    return 0;
}

if (ft > 0 && ft < 10) {
    if (!validateKey(keys.appNumKey, appNum)) {
        display('Incompatible Application Number');
        return 0;
    }
    if (!validateKey(keys.calNumKey, calNum)) {
        display('Incompatible Calibration Number');
        return 0;
    }
}

if (ft >= 10 && ft <= 13) {
    if (!validateKey(keys.bootKey, bootVersion)) {
        display('Incompatible Boot Software Version');
        return 0;
    }
    if (!validateKey(keys.appInfoKey, appInfo)) {
        display('Incompatible Application Software Information');
        return 0;
    }
    if (!validateKey(keys.appDataKey, appData)) {
        display('Incompatible Application Data Information');
        return 0;
    }
    if (!validateKey(keys.dataLibKey, dataLib)) {
        display('Incompatible Data Library Information');
        return 0;
    }
    if (!validateKey(keys.appsKey, apps)) {
        display('Incompatible APPs Information');
        return 0;
    }
}

i, e = Diag4.doJob("download\n" + idx, 3600, true); // execute the real reflashing process
if (i) {
    log("\t" + String.gsub(i, "\n", "\r\n\t"));
    if (String.strfind(i, "DownLoad Completed") != nil || String.strfind(i, "Test Completed") != nil) {
        display(ecu + " reflash: OK");
        return 2;
    }
} else {
    display("Reflash failed: " + e);
    return -1;
}




