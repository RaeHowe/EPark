var express = require('express');
var app = new express();

//设置ejs模板引擎
app.set('view engine', 'ejs');

var server = require('./server');
app.use('/', server);

app.listen(8888);
