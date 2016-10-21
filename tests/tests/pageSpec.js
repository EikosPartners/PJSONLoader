/*global describe, it*/
var chai = require('chai'),
    mocha = require('mocha'),
    buildJSON = require('../../src/buildJSON'),
    sf = require('../utils/sortAndFilter'),
    fs = require('fs'),
    opts = {
        rootDir: 'tests/server',
        pjsonPath: 'pjson',
        fragmentsPath: 'fragments',
        pagesPath: 'pages',
        middleware: []
    },
    pjsonLoader = require('../../src/pjson-loader'),
    app = require('../../app'),
    expect = chai.expect,
    testJSON = require('../../tests.json'),
    path = require('path');

describe('Page Test', function () {

    before( function (done) {
        pjsonLoader.load(app, opts, function () {
            // Copy the tests.json file to the server test directory.
            fs.writeFile(path.resolve(__dirname, '../server/pjson/fragments/tests.json'), JSON.stringify(testJSON), function (err) {
                if (err)
                    console.log(err);

                done();
            });
        });
    });

    it('Merge json with simple merge id', function (done) {
        var mergeContent = {
            mergeid: "simple_merge"
        };
        buildJSON.test(mergeContent, opts, function (err, data) {
            //console.log("the data: ", JSON.stringify(data, null, 2));
            expect(data.action.options.target).to.equal("{{column_star_target}}");
            done();
        });
    });

    it('Merge json with override', function (done) {
        var mergeContent = {
            "mergeid": {
                "id": "merge_with_override",
                "mustaches": {
                    "column_star_target":"gridAdvancedGrid-npps-mf.favorite",
                    "column_target_uri": "npps_mf_pools/save"
                }
            }
        };

        buildJSON.test(mergeContent, opts, function (err, data) {
            //console.log(JSON.stringify(data, null, 2));
            expect(data.options.target).to.equal('gridAdvancedGrid-npps-mf.favorite');
            expect(data.options.params.options.target.uri).to.equal('npps_mf_pools/save');
            expect(data.options.params.options.target.options.data).to.equal('{{id}}');
            done();
        });
    });

    it('Merge json with mustached merge value', function (done) {
        var mergeContent = {
            "mergeid": {
                "id": "mergeid_mustache_merge",
                "mustaches": {
                    "mergeid_merge_value":"recursion_test"
                }
            }
        };

        buildJSON.test(mergeContent, opts, function (err, data) {
            //console.log(JSON.stringify(data, null, 2));
            expect(data.madeit).to.be.true;
            expect(data.do_it_again.madeit2).to.be.true;
            done();
        });
    });

    it('Merge json with extend', function (done) {
        var mergeContent = {
            "mergeid": {
                "id": "extend_test",
                "extend": {
                    "name":"merged-favorite",
                    "extended": { "extendtest": "extendtestResults"}
                }
            }
        };

        buildJSON.test(mergeContent, opts, function (err, data) {

            //console.log(JSON.stringify(data, null, 2));
            expect(data.name).to.equal('merged-favorite');
            expect(data.extended.extendtest).to.equal('extendtestResults');

            done();
        });
    });
});
