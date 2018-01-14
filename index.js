'use strict';

var moment = require('moment');
var fs = require('fs');
var express = require('express');
var app = express();

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

app.get("/:time", function(req, res){
  if (req.params.time){
    var inputTime = req.params.time;
    var isUnix = /^\d+$/.test(inputTime);
    var isNatural = false;    
    var parsedTime;
    if (isUnix){
      isNatural = false;
      parsedTime = new Date(parseInt(inputTime));
    }else{      
      parsedTime = new Date(inputTime);
      isNatural = parsedTime && (!isNaN(parsedTime.getTime()));//FIXME: to narrow range  
    }
    
    var ret = {
      unix:null,
      natural: null
    };
    if (isUnix){
      ret.unix = inputTime;
      ret.natural = moment(parsedTime).format('LL');
    }else if (isNatural){
      ret.natural = inputTime;
      ret.unix = parsedTime.getTime();
    }
    res.end(JSON.stringify(ret));
  }else{
    console.log("time empty");    
    res.sendFile(process.cwd() + '/views/index.html');
  }  
})

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

