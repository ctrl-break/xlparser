const express = require('express');
const formidable = require('formidable');
const XLSX = require("xlsx");
const parser = require('../handlers/parse');
const store = require('../handlers/store');
const db = require('../handlers/db');
const router = express.Router();
const env = require('../.env.js');

function restrict(req, res, next) {
  if (env.PRODUCTION === false) {
    next();
    return;
  }

  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/');
  }
}

router.get('/', restrict, function (req, res) {
  if (store?.getItem('filePath')) {
    viewLists(req, res);
    return;
  }
  
  res.render('xlparser', { title: 'XLparser', message: {status: 'loadFile' }});
});

router.post('/', restrict, function (req, res) {
  initData();

  if (req.query.checkLists) {
    parseLists(req, res);
    return;
  }

  showLists(req, res);
});


function parseLists(req, res) {
  // console.log(req);

  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    const choosedIndexes = Object.keys(fields).map(item => Number(item.split('__')[1]));
    const lists = store.getItem('sheets').filter( (item, i) => choosedIndexes.includes(i));
    const result = [];
    lists.forEach( listName => result.push( parser.readSheet(listName) ));
    // console.log('parseLists =======', result);

    res.render('xlparser', { title: 'XLparser result', message: {status: 'done', result, html: `${JSON.stringify({ result })}` }}); // , html: `${JSON.stringify({ result })}`
  });
  // console.log('parseLists =======');
  
  // res.render('xlparser', { title: 'XLparser', message: {status: 'done', html: `${req.session.fileName}` }});
}

function showLists(req, res) {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    // console.log(files.excel);
    
    store.setItem('filePath', files.excel.filepath);
    const excel = XLSX.readFile(files.excel.filepath);
    store.setItem('excel', excel);
    store.setItem('sheets', excel.SheetNames);
    store.setItem('fileName', String(files.excel.originalFilename));

    viewLists(req, res);
  });
}

async function viewLists(req, res) {
  const fileName = store.getItem('fileName');
  const sheets = store.getItem('sheets');
  let parserInfo = await db.getParseListData(fileName);

  if (!parserInfo || parserInfo.length === 0) {
    await db.setNewParseData(fileName, sheets);
    console.log('loaded');
    parserInfo = await db.getParseListData(fileName);
  }

  const viewData = parserInfo.map(item => 
    ({
      ...item, 
      created: new Date(item.created).toLocaleString('sv-SE'),
      updated: item.updated ? new Date(item.updated).toLocaleString('sv-SE') : '',
    }));

  res.render('xlparser', { title: 'XLparser', message: { sheets: viewData, status: 'showLists' } });
}

async function initData() {
  if (store.getItem('cultivars')) {
    return;
  }
  const cultivars = await db.getCultivars();
  store.setItem('cultivars', cultivars);
  
  // console.log('-----------------------------------------------------------');
  console.log(store.getItem('cultivars'));
  console.log(store.getItem('fileName'));
  console.log(store.getItem('sheets'));
  console.log('-----------------------------------------------------------');
}

module.exports = router;
