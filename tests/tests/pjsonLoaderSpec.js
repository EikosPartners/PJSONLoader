var chai = require('chai'),
    expect = chai.expect,
    pjsonLoader = require('../../src/pjson-loader'),
    app = require('../../app'),
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf');

function cleanup(dir) {
    rimraf(dir, {}, function () { });
}

describe("Directory Creation Test Suite", function () {

    // it('Test default directory exists when loaded', function (done) {
    //     pjsonLoader.load(app, {});
    //
    //     expect(fs.existsSync(path.join(__dirname, '../server'))).to.be.true;
    //     expect(fs.existsSync(path.join(__dirname, '../server/pjson'))).to.be.true;
    //     expect(fs.existsSync(path.join(__dirname, '../server/pjson/fragments'))).to.be.true;
    //     expect(fs.existsSync(path.join(__dirname, '../server/pjson/pages'))).to.be.true;
    //
    //     cleanup('../server');
    //     done();
    // });
    //
    // it('Test user specified directory exists when loaded', function (done) {
    //     var userOpts = {
    //         rootDir: 'testDir',
    //         pjsonPath: 'pjsonDir',
    //         fragmentsPath: 'fragPath',
    //         pagesPath: 'pagesPath'
    //     };
    //
    //     pjsonLoader.load(app, userOpts);
    //
    //     expect(fs.existsSync(path.join(__dirname, '../testDir'))).to.be.true;
    //     expect(fs.existsSync(path.join(__dirname, '../testDir/pjsonDir'))).to.be.true;
    //     expect(fs.existsSync(path.join(__dirname, '../testDir/pjsonDir/fragPath'))).to.be.true;
    //     expect(fs.existsSync(path.join(__dirname, '../testDir/pjsonDir/pagesPath'))).to.be.true;
    //
    //     cleanup('../testDir/');
    //     done();
    // });
});
