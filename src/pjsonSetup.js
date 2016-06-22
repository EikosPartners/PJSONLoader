var fs = require('fs'),
    path = require('path'),
    DEFAULT_DIR_OPTIONS = {
        rootDir: 'server',
        pjsonPath: 'pjson',
        fragmentsPath: 'fragments',
        pagesPath: 'pages',
        middleware: []
    },
    pjson = require('./buildJSON.js'),
    _ = require('lodash');

/**
 * Method to fail silently if the directory already exists.
 */
function failSilently(e)
{
    if (e && e.code === 'EEXIST')
    {
        // fail silently because the directory already exists.
    }
    else
    {
        console.log(e);
    }
}


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
 *          middleware: [] --- Optional array of middleware to use, defaults to empty array
 *       }
 */
function load(app, options)
{
    // app must not be null
    if (!app || _.isEmpty(app))
    {
        console.error("App must not be empty");
        return;
    }

    // Merge the default opts with the options the user supplied.
    var opts = _.merge(DEFAULT_DIR_OPTIONS, options);

    // Set up the directories, creating them if they do not exits.
    ensureDirectory(opts);

    // Register the pjson route on the app.
    app.get.apply(app, ['/pjson'].concat(opts.middleware).concat([
        function (req, res, next) {
            pjson.getJSON(req.query.name,
                function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(data) 
                    }
                });
        }
    ]));
};

/**
 * Method to ensure that the pjson directories exist, creates them if they do not.
 *
 * @param dirOptions - {
 *          rootDir: 'server/', ---  Optional, defaults to 'server'
 *          pjsonPath: 'server/pjson/', ---  Optional, defaults to 'server/pjson/'
 *          fragmentsPath: 'server/pjson/fragements/', --- Optional, defaults to 'pjson/fragments/'
 *          pagesPath: 'server/pjson/pages' --- Optional, defaults to 'server/pjson/paths/'
 *       }
 */
function ensureDirectory(dirOptions)
{
    var opts = _.merge(DEFAULT_DIR_OPTIONS, dirOptions);

    // Make the root directory.
    fs.mkdir(opts.rootDir, failSilently);

    // Make all other directories inside of the root directory.
    fs.mkdir(path.resolve(opts.rootDir, opts.pjsonPath), failSilently);
    fs.mkdir(path.resolve(opts.rootDir, opts.pjsonPath, opts.fragmentsPath), failSilently);
    fs.mkdir(path.resolve(opts.rootDir, opts.pjsonPath, opts.pagesPath), failSilently);
};

module.exports = {
    load: load,
    ensureDirectory: ensureDirectory,
    getJSON: pjson.getJSON
}
