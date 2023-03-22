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
  res.render('xlparser', { title: 'XLparser', message: {status: 'loadFile' }});
});

router.post('/', restrict, function (req, res) {
  if (req.query.checkLists) {
    parseLists(req, res);
    return;
  }

  showLists(req, res);
});


function parseLists(req, res) {
  // console.log(req);
  // console.log('---');

  initData(req);

  const form = formidable();
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    res.render('xlparser', { title: 'XLparser result', message: {status: 'done', html: `${JSON.stringify({ fields  })}` }});
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
    
    const filePath = files.excel.filepath;
    store.setItem('filePath', filePath);
    req.session.filePath = filePath ?? '';
    const excel = XLSX.readFile(filePath);
    store.setItem('excel', excel);
    const sheets = excel.SheetNames;
    store.setItem('sheets', sheets);


    const fileName = files.excel.originalFilename + '';
    store.setItem('fileName', fileName);

    let parserInfo = await db.getParseListData(fileName);

    if (!parserInfo || parserInfo.length === 0) {
      await db.setNewParseData(fileName, sheets);
      console.log('loaded');
      parserInfo = await db.getParseListData(fileName);
    }

    const viewData = parserInfo.map(item => 
      ({
        ...item, 
        created: new Date(item.created).toISOString().slice(0, 16),
        updated: item.updated ? new Date(item.updated).toISOString().slice(0, 16) : '',
      }));

    res.render('xlparser', { title: 'XLparser', message: { sheets: viewData, status: 'showLists' } });
  });
}

async function initData(req) {
  const cultivars = await db.getCultivars();
  store.setItem('cultivars', cultivars);
  
  console.log('-----------------------------------------------------------');
  console.log(store.getItem('cultivars'));
  console.log(store.getItem('fileName'));
  console.log(store.getItem('sheets'));
  console.log('-----------------------------------------------------------');
}

module.exports = router;
