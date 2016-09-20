'use strict';

const express = require ('express');
const server  = express();
const port    = 7000;

server.use(express.static(__dirname + '/dist', {
  extensions: ['html']
}));

server.listen(port, function() {
  console.log(`Server listening on port ${port}... `);
});
