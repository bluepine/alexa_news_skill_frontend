// Connect to lambda
var app = require('./news_app.js')
exports.handler = app.lambda();
