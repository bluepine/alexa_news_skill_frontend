//////////////////////config starts

var port_num = 4000
	//////////////////////config ends

var app = require('../news_app.js')

var Hapi = require('hapi');


var server = new Hapi.Server();
server.connection({
	port: port_num
});

var bodyParser = require('body-parser');

function log(text) {
	console.log(text)
}

// Add the route
server.route({
	method: 'POST',
	path: '/sample',
	handler: function(req, res) {
		app.request(req.payload) // connect hapi to alexa-app
			.then(function(response) { // alexa-app returns a promise with the response
				res(response); // stream it to hapi' output
			});
	}
})

server.start(function() {
	log('Server running at:' + server.info.uri);
});
