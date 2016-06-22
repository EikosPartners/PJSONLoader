var express = require('express');
var bodyParser = require('body-parser');
var pjsonLoader = require('./src/pjsonSetup');
var http = require('http');

var app = express();

app.use(bodyParser.json());

pjsonLoader.load(app, { rootDir: 'testDir/'});

var server = http.createServer(app);
server.listen('9090');
