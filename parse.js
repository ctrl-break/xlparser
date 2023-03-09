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

const fractions = [
    {
        lower_bound: 0,
        upper_bound: 30,
        id: 0
    },
    {
        lower_bound: 31,
        upper_bound: 50,
        id: 1
    },
    {
        lower_bound: 51,
        upper_bound: 70,
        id: 2
    },
    {
        lower_bound: 71,
        upper_bound: 75,
        id: 3
    },  
]

const parser = {

    readSheet: (fileData, sheet) => {
        const result = XLSX.readFile(fileData);
        // console.log('**************--', result.SheetNames);
        const firstPage = XLSX.utils.sheet_to_json(result.Sheets[result.SheetNames[0]]).slice(0, 8);
        console.log(firstPage);
        return '';
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