var fs = require('fs'),
    path = require('path'),
    DEFAULT_DIR_OPTIONS = {
        rootDir: 'server',
        pjsonPath: 'pjson',
        fragmentsPath: 'fragments',
        pagesPath: 'pages',
        middleware: [],
        routes: [{
            url: '/pjson',
            queryParam: true,
            params: []
        }],
        jsonTransform : function (req, res, data) { return data; }
    },
    pjson = require('./buildJSON.js'),
    _ = require('lodash'),
    mkdirp = require('mkdirp');

/**
 * Load method to set up the route and ensure that the directories needed for pjson
 * are present.
 *
 * @param app - App object to register the pjson routes on
 * @param options - {
 *          rootDir: 'server/', ---  Optional, defaults to 'server'
 *          pjsonPath: 'pjson/', ---  Optional, defaults to 'server/pjson/'
 *          fragmentsPath: 'fragments/', --- Optional, defaults to 'pjson/fragments/'
 *          pagesPath: 'pages/' --- Optional, defaults to 'server/pjson/paths/',
 *          middleware: [] --- Optional array of middleware to use, defaults to empty array,
*           jsonTransform: function --- Function that transforms json before sending it back
 *       }
 * @param callback - Callback function that passess an error if one occurred
 */
function load(app, options, callback)
{
    // Default callback if not defined.
    if (!callback) {
        callback = function (err) {
            if (err) {
                console.warn("Application not handling error:", err);
            }
        };
    }

    // app must not be null
    if (!app || _.isEmpty(app))
    {
        console.error("App must not be empty");
        callback("App must not be empty");
        return;
    }

    // Merge the default opts with the options the user supplied.
    var opts = _.defaults(options, DEFAULT_DIR_OPTIONS);

    // Set up the directories, creating them if they do not exits.
    var error = ensureDirectory(opts);

    if (error) {
        callback(error);
        return;
    }

    if (!Array.isArray(opts.routes)) {
        let error = "opts.routes should be an array of objects!";
        callback(error);
        return;
    }

    opts.routes.forEach( route => {
        // Register the pjson route on the app.
        app.get.apply(app, [route.url].concat(opts.middleware).concat([
            function (req, res, next) {
                let jsonName = '';
                if (route.queryParam) {
                    jsonName = req.query.name;
                } else {
                    if (!route.params) {
                        let err = "Error: You must specify params when using a custom url with a parameter";
                        console.error(err);
                        res.status(404).send(err);
                        return;
                    } else {
                        if (!Array.isArray(route.params)) {
                            route.params = [route.params];
                        }

                        route.params.forEach( (param, idx) => {
                            jsonName += req.params[param];

                            if (idx != route.params.length-1) {
                                jsonName += '/';
                            }
                        });

                        jsonName = opts.pagesPath + '/' + jsonName;
                    }
                }

                pjson.getJSON(jsonName, opts,
                    function (err, data) {
                        if (err) {
                            res.status(404).send(err);
                        } else {
                            res.send(options.jsonTransform(req, res, data));
                        }
                    });
            }
        ]));
    });

    callback(null);
}

/**
 * Method to ensure that the pjson directories exist, creates them if they do not.
 *
 * @param opts - {
 *          rootDir: 'server/', ---  Optional, defaults to 'server'
 *          pjsonPath: 'server/pjson/', ---  Optional, defaults to 'server/pjson/'
 *          fragmentsPath: 'server/pjson/fragements/', --- Optional, defaults to 'pjson/fragments/'
 *          pagesPath: 'server/pjson/pages' --- Optional, defaults to 'server/pjson/paths/'
 *       }
 */
function ensureDirectory(opts)
{
    mkdirp(path.resolve(opts.rootDir, opts.pjsonPath), function (err) {
        if (err) {
            console.log(err);
            return err;
        }

        fs.mkdir(path.resolve(opts.rootDir, opts.pjsonPath, opts.fragmentsPath), function (err) {
            if (err && err.code !== 'EEXIST') {
                console.log(err);
                return err;
            }
        });

        fs.mkdir(path.resolve(opts.rootDir, opts.pjsonPath, opts.pagesPath), function (err) {
            if (err && err.code !== 'EEXIST') {
                console.log(err);
                return err;
            }
        });
    });
}

module.exports = {
    load: load,
    ensureDirectory: ensureDirectory,
    getJSON: pjson.getJSON
};
