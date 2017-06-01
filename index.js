var express = require('express');
var url = require('url');
//var cookieParser = require('cookie-parser')

var app = express();

app.use('/*.html', function (req, res, next) {
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
    console.log('cookie created successfully');

    next();
});

app.get('/*.html', function(req, res) {
    var path = url.parse(req.url).pathname;
	res.sendFile(__dirname+'/templates'+path);	
});

app.get('/scripts/*.js', function(req, res) {
    var path = url.parse(req.url).pathname;
	res.sendFile(__dirname+path);	
});

app.get('/styles/*.css', function(req, res) {
    var path = url.parse(req.url).pathname;
	res.sendFile(__dirname+path);	
});

var server = app.listen(8888)
