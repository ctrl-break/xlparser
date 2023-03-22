const express = require('express');
const formidable = require('formidable');
const XLSX = require("xlsx");
const parser = require('../parse');
const db = require('../db');
const router = express.Router();

function restrict(req, res, next) {
  next();
  return;
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
  console.log(req.query);
  if (req.query.checkLists) {
    parseLists(req, res);
    return;
  }

  showLists(req, res);
});


function parseLists(req, res) {
  console.log(req.session);
  res.render('xlparser', { title: 'XLparser', message: {status: 'done', html: `${req.session.fileName}` }});
}

function showLists(req, res) {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    console.log(files.excel);
    
    const filePath = files.excel.filepath;
    req.session.filePath = filePath ?? '';
    const excel = XLSX.readFile(filePath);
    const sheets = excel.SheetNames;

    const fileName = files.excel.originalFilename + '';
    let parserInfo = await db.getParseListData(fileName);

    if (!parserInfo || parserInfo.length === 0) {
      await db.setNewParseData(fileName, sheets);
      console.log('loaded');
      parserInfo = await db.getParseListData(fileName);
    }

    console.log('parserInfo', parserInfo);
    const viewData = parserInfo.map(item => 
      ({
        ...item, 
        created: new Date(item.created).toISOString().slice(0, 16),
        updated: item.updated ? new Date(item.updated).toISOString().slice(0, 16) : '',
      }));

    res.render('xlparser', { title: 'XLparser result', message: { sheets: viewData, status: 'showLists' } });
  });
}

module.exports = router;
