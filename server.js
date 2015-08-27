// own modules
var port = 5000;
var FileServer = require('./module/fileServer');
var fileServer = new FileServer(port);
console.log("Server now running on port " + port);
