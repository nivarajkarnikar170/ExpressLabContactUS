var express = require('express');
var router = express.Router();
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');

var csrfProtection = csrf({cookie: true});

/* GET home page. */
router.get('/', csrfProtection, function (req, res, next) {
  console.log(req.url);
  console.log(req.csrfToken());
  res.render('contactUs', { errors: [], title: 'Contact Us', _csrf: req.csrfToken()});
});

router.post('/', csrfProtection, function (req, res, next) {
  //validation
  console.log(req.csrfToken());
  console.log(req.body._csrf);
  req.assert('fullName', 'Full Name is required').notEmpty();
  req.assert('message', 'Message is required').notEmpty();
  var errors = req.validationErrors();
  console.log(errors);
  if (errors) res.render('contactUs', { errors: errors, title: 'Contact Us' });
  else {
    var data = "Full Name : " + req.body.fullName + "\n" +  " Message type : " + req.body.msgType + "\n" +  " Message : " + req.body.message + "\n" + " IP Address : " + req.connection.remoteAddress + "\n";

    fs.writeFile("myFile.txt", data, function(err){
      if(err){
        console.log("File write Fail!!");
      }
      console.log("File write sucessful!!");
      res.render('thankyou', { data: req.body.fullName, title: 'Thank You' });
    });    
  }

});

module.exports = router;
