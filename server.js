var express = require ('express');

var server = express();
server.use(express.static(__dirname + '/dist', {
  extensions: ['html']
}));

var port = 7000;
server.listen(port, function() {
  console.log('Server listening on port ' + port);
});
