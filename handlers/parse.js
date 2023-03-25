const XLSX = require("xlsx");
const store = require('./store');
const schemas = require('./templates');

const isCultivarMeasureSchema1 = (rows) => ( rows[1] && typeof rows[1] === 'string' && rows[2] >=0 && typeof rows[2] === 'number');
const getRawData = (row) => row.filter((item, index) => index <= 11);
const normalizeCultivarName = (cultivarName) => cultivarName ? cultivarName.replace('|Г|', '').trim().toLowerCase().replace('ё', 'е') : '';

const getCultivarDbId = (row) => {
    if (!row || row.length === 0) {
        return;
    }
    const cultivars =   store.getItem('cultivars');
    // add templates indexes
    const currentCultivar = cultivars
        .find(item => 
            normalizeCultivarName(item.name_of_cultivar) === normalizeCultivarName(row[1]['value']) 
            || normalizeCultivarName(item.breeding_number) === normalizeCultivarName(row[1]['value'])
            || item.mistakes
                    ?.split(';')
                    .map(mistake => normalizeCultivarName(mistake))
                    .some(mistake => mistake === normalizeCultivarName(row[1]['value'])));
    if (currentCultivar) {
        return currentCultivar;
    }
}

const parser = {
    readSheet: (sheetName, limit) => {
        const excel = store.getItem('excel');
        const schema = [ ...schemas.schema1 ];
        const list = XLSX.utils.sheet_to_json(excel.Sheets[sheetName], { header: 1, defval: '' });
        // console.log(list);
        const filterData = list
            .map(item => isCultivarMeasureSchema1(item) ? getRawData(item) : [] )
            .map(row => row.length ? row.map( (cell, index) => ({...schema[index], value: cell})) : [])
            .map(row => {
                const result = getCultivarDbId(row);
                let dbId = '';
                if (result) {
                    dbId = `${result.id_cultivar} / ${result.name_of_cultivar || result.breeding_number}`;
                }
                return [{ prop: 'dbId', value: dbId }, ...row];
            })
            .filter(row => row.length > 2);
        
        console.log(filterData.slice(0, 7));
        return limit ? filterData.slice(0, limit) : filterData;
    },
}

module.exports = parser;