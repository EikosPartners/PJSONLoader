var _ = require('lodash'),
    moment = require('moment'),
    _module,
    crypto,
    genOpts = {
        generate: {
            n: 100
        }
    };

module.exports = _module = {

    //generate and return num amount of rows from designated dataSource
    generate: function (dataSource, options, callback) {
        options.seed = 1;
        dataSource.generate(options, function (err, data) {
            callback(err, data.SearchResults || data.data);
        });
    },

    search: function (dataSource, options, callback, genFirst) {
        genFirst = typeof genFirst !== 'undefined' ? genFirst : false;
        options.generate = typeof options.generate !== 'undefined' ? options.generate : genOpts.generate;
        if (genFirst) {
            _module.generate(dataSource, options.generate, function (err, data) {
                dataSource.search(options, function (err, data) {
                    callback(err, data);
                });
            });
        }
        else {
            dataSource.search(options, function (err, data) {
                callback(err, data);
            });
        }

    },

    get: function (dataSource, options, callback, genFirst) {
        genFirst = typeof genFirst !== 'undefined' ? genFirst : false;
        options.generate = typeof options.generate !== 'undefined' ? options.generate : genOpts.generate;
        if (genFirst) {
            _module.generate(dataSource, options.generate, function (err, data) {
                dataSource.get(options, function (err, data) {
                    callback(err, data);
                });
            });
        }
        else {
            dataSource.get(options, function (err, data) {
                callback(err, data);
            });
        }
    },

    get_simple: function (dataSource, callback) {
        dataSource.get(function (err, data) {
            callback(err, data.data);
        });
    },

    header: function (dataSource, options, callback, genFirst) {
        genFirst = typeof genFirst !== 'undefined' ? genFirst : false;
        options.generate = typeof options.generate !== 'undefined' ? options.generate : genOpts.generate;
        if (genFirst) {
            _module.generate(dataSource, options.generate, function (err, data) {
                dataSource.header(options, function (err, data) {
                    callback(err, data);
                });
            });
        }
        else {
            dataSource.header(options, function (err, data) {
                callback(err, data);
            });
        }
    },

    details: function (dataSource, options, callback, genFirst) {
        genFirst = typeof genFirst !== 'undefined' ? genFirst : false;
        options.generate = typeof options.generate !== 'undefined' ? options.generate : genOpts.generate;
        if (genFirst) {
            _module.generate(dataSource, options.generate, function (err, data) {
                dataSource.details(options, function (err, data) {
                    callback(err, data);
                });
            });
        }
        else {
            dataSource.details(options, function (err, data) {
                callback(err, data);
            });
        }
    },

    remove: function (dataSource, options, callback, genFirst) {
        genFirst = typeof genFirst !== 'undefined' ? genFirst : false;
        options.generate = typeof options.generate !== 'undefined' ? options.generate : genOpts.generate;
        if (genFirst) {
            _module.generate(dataSource, options.generate, function (err, data) {
                dataSource.delete(options.search, function (err, data) {
                    callback(err, data);
                });
            });
        }
        else {
            dataSource.delete(options.search, function (err, data) {
                callback(err, data);
            });
        }
    },

    bulkRemove: function (dataSource, options, callback, genFirst) {
        genFirst = typeof genFirst !== 'undefined' ? genFirst : false;
        options.generate = typeof options.generate !== 'undefined' ? options.generate : genOpts.generate;
        if (genFirst) {
            _module.generate(dataSource, options.generate, function (err, data) {
                dataSource.bulk_delete(options.request, function (err, data) {
                    callback(err, data);
                });
            });
        }
        else {
            dataSource.bulk_delete(options.request, function (err, data) {
                callback(err, data);
            });
        }
    },

    save: function (dataSource, options, callback, genFirst) {
        genFirst = typeof genFirst !== 'undefined' ? genFirst : false;
        options.generate = typeof options.generate !== 'undefined' ? options.generate : genOpts.generate;
        if (genFirst) {
            _module.generate(dataSource, options.generate, function (err, data) {
                dataSource.save(options.search, options.data, function (err, data) {
                    callback(err, data);
                });
            });
        }
        else {
            dataSource.save(options.search, options.data, function (err, data) {
                callback(err, data);
            });
        }
    },

    detailsSave: function (dataSource, options, callback, genFirst) {
        genFirst = typeof genFirst !== 'undefined' ? genFirst : false;
        options.generate = typeof options.generate !== 'undefined' ? options.generate : genOpts.generate;
        if (genFirst) {
            _module.generate(dataSource, options.generate, function (err, data) {
                dataSource.detailsSave(options.data, function (err, data) {
                    callback(err, data);
                });
            });
        }
        else {
            dataSource.detailsSave(options.data, function (err, data) {
                callback(err, data);
            });
        }
    },

    detailsDelete: function (dataSource, options, callback, genFirst) {
        genFirst = typeof genFirst !== 'undefined' ? genFirst : false;
        options.generate = typeof options.generate !== 'undefined' ? options.generate : genOpts.generate;
        if (genFirst) {
            _module.generate(dataSource, options.generate, function (err, data) {
                dataSource.detailsDelete(options.data, function (err, data) {
                    callback(err, data);
                });
            });
        }
        else {
            dataSource.detailsDelete(options.data, function (err, data) {
                callback(err, data);
            });
        }
    }
};