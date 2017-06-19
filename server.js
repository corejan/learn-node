var express = require('express');
var hoffman = require('hoffman');
var url = require('url');
var http = require('http');
var util = require('util');
var path = require('path');
//var cookieParser = require('cookie-parser')

var app = express();

/*--------set view engine---------*/
app.set('views', path.join(__dirname, 'templates')); // path to your templates
app.set('view engine', 'dust');
app.engine('dust', hoffman.__express());

/*---------use middleware----------*/
//check user data, token...
app.use('/*.html', function (req, res, next) {
    var ranNum = Math.random().toString();
    ranNum = ranNum.substring(2, ranNum.length);
    
    //TODO: check user, etc.

    //everything is going fine, send cookie.
    res.cookie('session', ranNum, { maxAge: 900000, httpOnly: true });
    util.log('cookie created successfully');

    next();
});

/*---------define routes---------*/
//request for web pages
app.get('/', function(req, res) {
    var path = url.parse(req.url).pathname;
    //TODO: get real data and render page
	res.render('news', {});	
});

app.get('/user/*.html', function(req, res) {
    var path = url.parse(req.url).pathname;
    //TODO: get real data and render page
	res.render('user', {title: 'User page'});	
});


//request for static resources
app.get('/scripts/*.js', function(req, res) {
    var path = url.parse(req.url).pathname;
	res.sendFile(__dirname+path);	
});

app.get('/styles/*.css', function(req, res) {
    var path = url.parse(req.url).pathname;
	res.sendFile(__dirname+path);	
});

//api interface
app.get('/api/*', function(req, res) {
    var path = url.parse(req.url).pathname;

    util.log('got api request: '+ req.url);
    
    //TODO: transfer api request
    var options = {
        host: 'localhost',
        port: 12345,
        path: path,
        method: req.method.toUpperCase()
    };

    var api_req = http.request(options, function(api_res) {
        api_res.on('data', function(data) {
            res.write(data);
            res.end();
        });
        api_res.on('error', function(err) {
            res.writeHead(500);
            res.write(err.code);
            res.end();
        });
    });

    api_req.on('error', function(err) {
        res.writeHead(400);
        res.write(err.code);
        res.end();
    });

    api_req.end();
});

/*--------let's go--------*/
var server = app.listen(8888)
