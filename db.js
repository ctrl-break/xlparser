const env = require('./.env.js');
const pgp = require('pg-promise')(/* options */)
const dbConnect = pgp(`postgres://${env.DB_USERNAME}:${env.DB_PASS}@${env.DB_HOST}`);

const db = {
    getCultivars: async () => 
        await dbConnect.many('SELECT id_cultivar, name_of_cultivar, breeding_number, mistakes FROM cultivars'),
    
    getParseListData: async (fileName) => {
        return await dbConnect.manyOrNone(`SELECT file_name, created, updated, status, row_ids_failed, list_name FROM parser_data WHERE file_name='${fileName}'`);
    },

    setNewParseData: async (fileName, listNames) => {
        const columns = new pgp.helpers.ColumnSet(['file_name', 'created', 'list_name'], {table: 'parser_data'}); 
        const lists = listNames.map(item => ({file_name: fileName, created: 'NOW()', list_name: item}));
        const query = pgp.helpers.insert(lists, columns);
        //.reduce((acc, item) => acc + `(${fileName}, ${currentDate}, ${fileName})`)
        return await dbConnect.none(query);
    }
}

module.exports = db;