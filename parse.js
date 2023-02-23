const readXlsxFile = require('read-excel-file/node');
const XLSX = require("xlsx");

const schema = {
    '№': {
        prop: 'num',
        type: Number
    },
    'culture': {
        prop: 'culture',
        type: String,
        required: true,
    },
    'count': {
        prop: 'count',
        type: Number
    },
}

const parser = {

    readSheet: (fileData, sheet) => {
        return readXlsxFile(fileData, { sheet, schema }).then(res => {
            parser.getColumns(res);
        });
    },

    getColumns: (fileData) => {
        console.log('read file ***********************************', fileData);
        // fileData.slice(0, 3).forEach(element => {
        //     console.log('-------------------------', element, element.length);
        // })
        return ['done'];
    },

    isItCulture: (culture) => true,
}

module.exports = parser;