var express = require('express');
var bodyParser = require('body-parser');
var pjsonLoader = require('./src/pjson-loader');
var http = require('http');

var app = express();

app.use(bodyParser.json());

pjsonLoader.load(app, {});

var server = http.createServer(app);
server.listen('9090');
