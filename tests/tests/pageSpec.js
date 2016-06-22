/*global describe, it*/
var chai = require('chai'),
    mocha = require('mocha'),
    buildJSON = require('../../src/buildJSON'),
    sf = require('../utils/sortAndFilter'),
    testUtils = require('../utils/testUtils'),
    opts = {
        rootDir: 'server',
        pjsonPath: 'pjson',
        fragmentsPath: 'fragments',
        pagesPath: 'pages',
        middleware: []
    },
    pjsonLoader = require('../../src/pjson-loader'),
    app = require('../../app'),
    expect = chai.expect;

before( function () {
    pjsonLoader.load(app, {});
});

describe('Page Test', function () {

    it('Merge json with simple merge id', function (done) {
        var mergeContent = {
            mergeid: "simple_merge"
        }
        buildJSON.test(mergeContent, opts, function (err, data) {
            //console.log(JSON.stringify(data, null, 2));
            expect(data.action.options.target).to.equal("{{column_star_target}}");
            done();
        });
    });

    it('Merge json with override', function (done) {
        var mergeContent = {
            "mergeid": {
                "id": "merge_with_override",
                "overrides": {
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
                "overrides": {
                    "mergeid_merge_value":"recursion_test"
                }
            }
        };

        buildJSON.test(mergeContent, opts, function (err, data) {
            console.log(JSON.stringify(data, null, 2));
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

            console.log(JSON.stringify(data, null, 2));
            expect(data.name).to.equal('merged-favorite');
            expect(data.extended.extendtest).to.equal('extendtestResults');

            done();
        });
    });
});
