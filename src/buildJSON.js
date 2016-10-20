var fs = require('fs');
var fsw = require('./util/fsWrapper');
var path = require('path');
var mustache = require('mustache');
var _ = require('lodash');
var utils = require('./util/dataUtils');

function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    if (utils.DEBUG) console.log(file);
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}
function recursiveMergeRunner(source, dictionaries) {
    var should = { "rescan": true };
    while (should.rescan) {
        should.rescan = false;
        recursiveMerge(source, dictionaries, 0, should);
        if (should.rescan) {
            console.warn("rescanning");
        }
    }
    return source;
}
function mergeMustache(target, source) {
    var targetAsString = JSON.stringify(target);
    //var results = source.overrides ? mustache.render(targetAsString, source.overrides): targetAsString;
    var results = source.mustaches ? utils.formatText(targetAsString, source.mustaches) : targetAsString;
    results = JSON.parse(results);
    results = _.merge(results, source.extend);
    return results;
}
function mergeOverrides(target, source) {
    if(source.overrides && _.isObject(source.overrides)) {
        Object.keys(source.overrides).forEach(function (key) {
            utils.set(target, key, source.overrides[key]);
        })
    }

    return target;
}
function recursiveMerge(obj, dictionaries, depth, should) {
    var key, replacedWithKey;

    if (obj instanceof Object) {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (key === "mergeid") {

                    //check for dictionary match
                    var mergeKeyOrObject = obj[key];

                    // change mergeid to equal _mergeid
                    delete obj[key];
                    obj["_" + key] = mergeKeyOrObject;

                    // search dictionaires for matching mergeid
                    dictionaries.forEach(function(dictionary) {

                        //get the key out of the mergeKeyorObject
                        var mergeKey, shouldOverride;
                        if (typeof mergeKeyOrObject === 'string') {
                            mergeKey = mergeKeyOrObject;
                        } else {
                            mergeKey = mergeKeyOrObject.id;
                            shouldOverride = true;
                        }
                        var replacedWith = dictionary[mergeKey];

                        if (replacedWith) {

                            if (shouldOverride) {
                                replacedWith = mergeMustache(replacedWith, mergeKeyOrObject);
                                replacedWith = mergeOverrides(replacedWith, mergeKeyOrObject);
                            }
                            for (replacedWithKey in replacedWith) {

                                // will this work for all cases or
                                // should I simply rescan anytime a fragment is found
                                // this way if fragments have mergeid's they will also be found.
                                // in the few test cases it seems to work for all additional cases
                                if (replacedWithKey === "mergeid") {
                                    should.rescan = true;
                                }
                                obj[replacedWithKey] = replacedWith[replacedWithKey];

                                // a merged value could have additional merges
                                recursiveMerge(obj[replacedWithKey], dictionaries, depth, should);
                            }
                        }
                    });
                } else {
                    recursiveMerge(obj[key], dictionaries, depth = depth + 1, should);
                }
            }
        }
    }
}
function getJSON(name, opts, callback) {
    var start = new Date().getMilliseconds(),
        _filePath = path.resolve(opts.rootDir, opts.pjsonPath),
        fileName =  _filePath + "/" + name,
        dictionaries;

    if (fileName.indexOf('.json') === -1) {
        fileName += '.json';
    }

    //initialize
    walk(_filePath, function(err, results) {

        if (err) {
            console.error(err)
            return;
        }

        dictionaries = results.filter(function(file) {
            return file.indexOf('fragments') !== -1;
        }).map(function(file) {
            return fsw.fileToJsonSync(file);
        });

        if (utils.DEBUG) console.log(results);
        fsw.fileToJson(fileName, function(err, file) {

            if (err) {
                console.log("file:", fileName, err)
                callback({ "error": err })
                return;
            }

            var merged = recursiveMergeRunner(file, dictionaries);
            var end = new Date().getMilliseconds();
            console.error("fileName=", name, "    time: ", end - start, "(ms)");
            //console.log(JSON.stringify(file));
            callback(null, merged);
        });
    });
}

function test(json, opts, callback) {
    var dictionaries,
        _filePath = path.resolve(opts.rootDir, opts.pjsonPath);

    //initialize
    walk(_filePath, function(err, results) {

        if (err) {
            console.error(err)
            return;
        }

        dictionaries = results.filter(function(json) {
            return json.indexOf('fragments') !== -1;
        }).map(function(json) {
            return fsw.fileToJsonSync(json);
        });

        if (utils.DEBUG) console.log(results);

        var merged = recursiveMergeRunner(json, dictionaries);
        callback(null, merged);
    });

};

module.exports = {
    walk: walk,
    getJSON: getJSON,
    test: test
};
