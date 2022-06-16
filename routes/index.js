const express = require('express');
const router = express.Router();
const passport = require('./passport');
const content = require("../model/content");

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
      let errors = {};
      let isValid = true;

      if (!req.body.email) {
        isValid = false;
        errors.email = 'Email is required';
      }
      if (!req.body.password) {
        isValid = false;
        errors.password = 'Password is required';
      }

      if (isValid) {
        next();
      } else {
        req.flash('errors',errors);
        res.redirect('/login');
      }
    },
    passport.authenticate('local-login', {
          successRedirect : '/',
          failureRedirect : '/login'
        }
    )
);

router.get('/logout', function(req, res, next){
  req.logout();
  req.session.destroy(()=>{
    res.cookie('subscribe.sid', '', {maxAge: 0});
    res.redirect('/');
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
    content.find().then((result)=>{
        result.sort(()=>Math.random() - 0.5);
        res.render('index', {result: result})
    });
});

/* 구독 서비스 Detail Page */
router.get('/detail/:id', function(req, res, next){
  const place_id = req.params.id;
  content.find({_id: place_id}).then((result)=> {
      content.find({category: {$in: result[0].category[0]}}).then((sim) =>{
          console.log(result)
          res.render('detail', {content:result[0], sim: sim})
      })
  });
})

router.get('/search',function(req, res, next){
  if(req.query.q===""){
      res.render('search', {q: req.query.q, result:[]});
  }else{
      content.find({category: {$in: req.query.q }}).then((result)=>{
          res.render('search', {q: req.query.q, result:result})
      })
  }
})

module.exports = router;
