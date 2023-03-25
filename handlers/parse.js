const XLSX = require("xlsx");
const store = require('./store');
const schemas = require('./templates');

const isCultivarMeasureSchema1 = (rows) => ( typeof rows[1] === 'string' && typeof rows[2] === 'number');
const getRawData = (row) => row.filter((item, index) => index <= 11);

const normalizedCultivarName = (cultivarName) => cultivarName.replace('|Г|', '').trim().toLowerCase().replace('ё', 'е');

const getCultivarDbId = (row) => {
    const cultivars = store.getItem('cultivars');
    // add templates indexes
    const currentCultivar = cultivars
        .find(item => 
            normalizedCultivarName(item.name_of_cultivar) === normalizedCultivarNamerow[1]) 
            || normalizedCultivarName(cultivars.breeding_number) === normalizedCultivarName(row[1])
            || cultivars.mistakes
                    .split(';')
                    .map(item => normalizedCultivarName(item))
                    .some(item => item === normalizedCultivarName(row[1]));
    if (currentCultivar) {
        return currentCultivar;
    }
}

const parser = {
    readSheet: (sheetName, limit) => {
        const excel = store.getItem('excel');
        const schema = [ ...schemas.schema1 ];
        const list = XLSX.utils.sheet_to_json(excel.Sheets[sheetName], { header: 1, defval: '' });
        const filterData = list
            .map(item => isCultivarMeasureSchema1(item) ? getRawData(item) : [])
            .map( row => 
                row.length ? row.map( (cell, index) => ({...schema[index], value: cell})) : null
            )
            .map( row => {
                const result = getCultivarDbId(row);
                let dbId = '';
                if (result) {
                    dbId = `${result.id_cultivar} / ${result.name_of_cultivar || result.breeding_number}`;
                }
                return [dbId, ...row];
            });
        console.log(filterData.slice(0, 7));
        return limit ? filterData.slice(0, limit) : filterData;
    },

    // async readDBCultivars() {
    //     const result = await db.getCultivars();
    //     console.log('result:', result);
    //     return result;
    // },
}

module.exports = parser;