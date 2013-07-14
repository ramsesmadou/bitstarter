var express = require('express');

var app = express.createServer(express.logger());
var indexFileBuffer = (index.html);
var buf = new Buffer(indexFileBuffer);
app.get('/', function(request, response) {
  response.send(buf.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
