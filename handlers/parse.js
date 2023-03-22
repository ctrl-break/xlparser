const XLSX = require("xlsx");
const store = require('./store');

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
        upper_bound: 75,
        id: 3
    },  
]

const parser = {
    readSheet: (sheetName, limit) => {
        const excel = store.getItem('excel');
        const list = XLSX.utils.sheet_to_json(excel.Sheets[sheetName], { header: 1 });
        return limit ? list.slice(0, limit) : list;
    },

    // async readDBCultivars() {
    //     const result = await db.getCultivars();
    //     console.log('result:', result);
    //     return result;
    // },
}

module.exports = parser;