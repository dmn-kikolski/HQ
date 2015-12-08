'use strict';

var http = require('http');

var securityKey = '$2a$10$0PtRwerh3B2A4T5xP1IGYOe4NzAH3GSaPAv785s5kUkh2DziHEgam';

http.get({
  hostname: 'localhost',
  port: 3000,
  path: '/users/initial/' + securityKey,
  agent: false
}, function (res) {
  console.log(res);
});
