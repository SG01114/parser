const fs = require('fs');
const XML = require('./xml2.js');

// Read the .odx-f file
fs.readFile('odxf.odx-f', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading .odx-f file:', err);
        return;
    }

    // Parse the XML using xml2.js
    const xmlDoc = XML.parse(data);

    // Find the <EXPECTED-IDENTS> section
    const expectedIdents = XML.search(xmlDoc, 'EXPECTED-IDENTS');
    if (!expectedIdents) {
        console.error('<EXPECTED-IDENTS> section not found');
        return;
    }

    // Extract ID names and values
    const dataObj = {};
    const idents = XML.child(expectedIdents, 'IDENT');
    for (let i = 0; i < idents.length; i++) {
        const ident = idents[i];
        const identName = XML.data(ident, 'ID');
        const values = [];
        const valueElements = XML.child(ident, 'VALUE');
        for (let j = 0; j < valueElements.length; j++) {
            values.push(XML.data(valueElements[j], ''));
        }
        dataObj[identName] = values;
    }

    // Convert to JSON and save to a file
    const json = JSON.stringify(dataObj, null, 4);
    fs.writeFile('expected_idents.json', json, 'utf8', err => {
        if (err) {
            console.error('Error writing JSON file:', err);
            return;
        }
        console.log('Data has been exported to expected_idents.json');
    });
});