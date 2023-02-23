const express = require('express');
const formidable = require('formidable');
const readXlsxFile = require('read-excel-file/node');
const { readSheetNames } = require('read-excel-file/node');
const parser = require('../parse');
const router = express.Router();

function restrict(req, res, next) {
  // next();
  // return;
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/');
  }
}

router.get('/', restrict, function (req, res) {
  res.render('xlparser', { title: 'XLparser' });
});

router.post('/', restrict, function (req, res) {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    readFile(res, files.excel.filepath);
  });

});

function readFile(res, file) {
  readSheetNames(file).then((sheetNames) => {
    parser.readSheet(file, sheetNames[0]);

    const sheets = sheetNames.reduce((acc, sheet) => acc += ` <div class="sheet">${sheet}</div>`, '');
    res.render('xlparser', { title: 'XLparser result', message: sheets });
  });
}


module.exports = router;
