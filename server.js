// own modules
var port = 8080;
var FileServer = require('./module/fileServer');
var fileServer = new FileServer(port);
console.log("Server now running on port " + port);