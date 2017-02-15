This is the repository for the PJSON loader.

# Installation
  `npm install --save pjson-loader`

# Usage

#### API
```javascript
  var pjsonLoader = require('pjson-loader');
  pjsonLoader.load(app, options, callback);
  pjsonLoader.ensureDirectory(opts);
  pjsonLoader.getJSON(name, opts, callback);
```

#### Examples
##### Default options.
```javascript
  // Use the default options. Pass an empty object to opts.
  /*
   {
       rootDir: 'server',
       pjsonPath: 'pjson',
       fragmentsPath: 'fragments',
       pagesPath: 'pages',
       middleware: [],
       routes: [{
           url: '/pjson',
           queryParam: true,
           paramName: ''
       }]
    }
   */

  // App is your express application to bind the /pjson route to.

  pjsonLoader.load(app, {}, function (err) {
      // Handle error if there was one.
  });
```
##### Specifying directory option
Pages and fragments should always be in the pjson directory.
```javascript
  var myOpts = {
    rootDir: "myDir",
    pjsonPath: "myPjsonPath",
    fragmentsPath: "myFragmentsPath",
    pagesPath: "myPagesPath",
    middleware: [myMiddleWareFuncs, ...]
  }

  pjsonLoader.load(app, myOpts, function (err) {});
```

##### Specifying a custom url
```javascript
// This will load pjson files from the url /UI/:pjsonname
// To use the custom url you must set queryParam to false and provide the paramName
// property.
pjsonLoader.load(app, {
    routes: [
        {
            url: '/UI/:pjsonname/',
            queryParam: false,
            paramName: 'pjsonname'
        }
    ]
});
```

You can also specify a url for subdirectories in your pages path.
```javascript
// Make sure to specify the params in the order they appear in the url.
pjsonLoader.load(app, {
    routes: [
        {
            url: 'UI/:subdirectory/:pjsonname',
            queryParam: false,
            params: ['subdirectory', 'pjsonname']
        }
    ]
});
```

# Tests
  `npm run test`
