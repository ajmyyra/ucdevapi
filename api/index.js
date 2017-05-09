require('babel-register')({
   presets: [ 'es2015' ]
});
require("./api.js").startServer();