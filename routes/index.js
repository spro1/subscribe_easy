var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index' );
});

/* 구독 서비스 Detail Page */
router.get('/detail', function(req, res, next){
  res.render('detail')
})

router.get('/search',function(req, res, next){
  res.render('search')
})

module.exports = router;
