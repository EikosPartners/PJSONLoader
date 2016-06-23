var chai = require('chai'),
    expect = chai.expect,
    pjsonLoader = require('../../src/pjson-loader'),
    app = require('../../app'),
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf');

describe("Directory Creation Test Suite with Default Options", function () {

    // Before hook. Call pjson loader to create the directory structure.
    before(function (done) {
        pjsonLoader.load(app, {}, function (err) { if (err) console.log(err); done(); });
    });

    //After hook. Delete the created test directories.
    after(function (done) {
        rimraf(path.resolve(__dirname, '../../server/pjson/fragments'), {},
            function (err) {
                if (err) console.log(err);

                rimraf(path.resolve(__dirname, '../../server/pjson/pages'), {},
                    function (err) {
                        if (err) console.log(err);

                        rimraf(path.resolve(__dirname, '../../server/pjson'), {},
                            function (err) {
                                if (err) console.log(err);

                                rimraf(path.resolve(__dirname, '../../server'), {},
                                    function (err) {
                                        if (err) console.log(err);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('Test default root directory exists', function (done) {

        fs.stat(path.resolve(__dirname, '../../server/'), function (err, stats) {
            if (err) {
                console.log(err);
                return;
            }

            expect(stats.isDirectory()).to.be.true;
            done();
        });
    });

    it('Test default pjson directory exists', function (done) {
        fs.stat(path.resolve(__dirname, '../../server/pjson'), function (err, stats) {
            if (err) {
                console.log(err);
                return;
            }

            expect(stats.isDirectory()).to.be.true;
            done();
        });
    });

    it('Test default fargments directory exists', function (done) {
        fs.stat(path.resolve(__dirname, '../../server/pjson/fragments'), function (err, stats) {
            if (err) {
                console.log(err);
                return;
            }

            expect(stats.isDirectory()).to.be.true;
            done();
        });
    });

    it('Test default pages directory exists', function (done) {
        fs.stat(path.resolve(__dirname, '../../server/pjson/pages'), function (err, stats) {
            if (err) {
                console.log(err);
            }

            expect(stats.isDirectory()).to.be.true;
            done();
        })
    });
});

describe("Directory Creation Test Suite with User Options", function () {
    var userOpts = {
        rootDir: 'testDir',
        pjsonPath: 'pjsonDir',
        fragmentsPath: 'fragPath',
        pagesPath: 'pagesPath'
    };

    // Before hook. Call pjson loader to set up the user defined directory structure.
    before(function (done) {
        pjsonLoader.load(app, userOpts, function (err) { if (err) console.log(err); done(); } );
    });

    // After hook. Delete the test directories.
    after(function (done) {
        rimraf(path.resolve(__dirname, '../../testDir/pjsonDir/fragments'), {},
            function (err) {
                if (err) console.log(err);

                rimraf(path.resolve(__dirname, '../../testDir/pjsonDir/pages'), {},
                    function (err) {
                        if (err) console.log(err);

                        rimraf(path.resolve(__dirname, '../../testDir/pjsonDir'), {},
                            function (err) {
                                if (err) console.log(err);

                                rimraf(path.resolve(__dirname, '../../testDir'), {},
                                    function (err) {
                                        if (err) console.log(err);
                                        done();
                                    });
                            });
                    });
            });
    });

    it('Test use root directory exists', function (done) {

        fs.stat(path.resolve(__dirname, '../../testDir/'), function (err, stats) {
            if (err) {
                console.log(err);
                return false;
            }

            expect(stats.isDirectory()).to.be.true;
            done();
        });
    });

    it('Test user pjson directory exists', function (done) {
        fs.stat(path.resolve(__dirname, '../../testDir/pjsonDir'), function (err, stats) {
            if (err) {
                console.log(err);
                return false;
            }

            expect(stats.isDirectory()).to.be.true;
            done();
        });
    });

    it('Test user fragments path exists', function (done) {
        fs.stat(path.resolve(__dirname, '../../testDir/pjsonDir/fragPath'), function (err, stats) {
            if (err) {
                console.log(err);
                expect(false).to.be.true;
                return false;
            }

            expect(stats.isDirectory()).to.be.true;
            done();
        });
    });

    it('Test user pages path exists', function (done) {
        fs.stat(path.resolve(__dirname, '../../testDir/pjsonDir/pagesPath'), function (err, stats) {
            if (err) {
                console.log(err);
                return false;
            }

            expect(stats.isDirectory()).to.be.true;
            done();
        });
    });
});
