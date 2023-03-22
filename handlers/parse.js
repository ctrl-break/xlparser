const readXlsxFile = require('read-excel-file/node');
const XLSX = require("xlsx");
const db = require('./db');

// const schema = {
//     '№': {
//         prop: 'num',
//         type: Number
//     },
//     'culture': {
//         prop: 'culture',
//         type: String,
//         required: true,
//     },
//     'count': {
//         prop: 'count',
//         type: Number
//     },
// }

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
        upper_bound: null,
        id: 3
    },  
]

const parser = {

}

module.exports = parser;