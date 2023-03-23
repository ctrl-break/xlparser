const XLSX = require("xlsx");
const store = require('./store');
const schemas = require('./templates');

const isCultivarMeasureSchema1 = (rows) => ( typeof rows[0] === 'number' && typeof rows[1] === 'string' && typeof rows[2] === 'number');
const getRawData = (row) => row.filter((item, index) => index <= 11);

const parser = {
    readSheet: (sheetName, limit) => {
        const excel = store.getItem('excel');
        const schema = [ ...schemas.schema1 ];
        const list = XLSX.utils.sheet_to_json(excel.Sheets[sheetName], { header: 1 });
        const filterData = list
            .map(item => isCultivarMeasureSchema1(item) ? getRawData(item) : [])
            .map( row => 
                row.length ? row.map( (cell, index) => ({...schema[index], value: cell})) : null
            );
        // console.log(filterData.slice(0, limit));
        return limit ? filterData.slice(0, limit) : filterData;
    },

    // async readDBCultivars() {
    //     const result = await db.getCultivars();
    //     console.log('result:', result);
    //     return result;
    // },
}

module.exports = parser;