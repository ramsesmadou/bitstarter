var express = require('express');

var app = express.createServer(express.logger());
var indexFileBuffer = fs.readFileSync('index.html');
var buf = new Buffer(indexFileBuffer);
var indexString = buf.toString();
 
app.get('/', function(request, response) {
  response.send(indexString);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
