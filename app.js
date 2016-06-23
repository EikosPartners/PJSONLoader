var express = require('express');
var bodyParser = require('body-parser');
var pjsonLoader = require('./src/pjson-loader');
var http = require('http');
var fs = require('fs');
var path = require('path');
var testJSON = require('./tests.json');

var app = express();

app.use(bodyParser.json());

pjsonLoader.load(app, {}, function () {
    // Copy the tests.json file to the server test directory if it doesn't exist.
    fs.stat('server/pjson/tests.json', function (err, stats) {
        if (!stats)
        {
            // File doesn't exist, create it.
            fs.writeFileSync(path.resolve(__dirname, 'server/pjson/tests.json'), JSON.stringify(testJSON));
        }
    });
});

var server = http.createServer(app);
server.listen('9090');

module.exports = app;
