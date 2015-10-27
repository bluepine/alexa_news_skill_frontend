// var alexa = require('../index.js'),
//     app = new alexa.app('foobar');

// app.intent('HelloWorld',
//     {
//         "utterances": [
//             "hello world"
//         ]
//     },
//     function(request, response) {
//         response.say("hello world");
//     }
// );

// console.log(app.utterances());
// console.log(app.schema());
var alexa = require('alexa-app');
var Q = require('q')
var _ = require('lodash');
var fs = require('fs')

function text_to_obj(responses) {
    // log(responses)
    var lines = _.filter(_.map(responses.split(/\r?\n/), _.trim), function(line) {
        if (line) {
            return !_.startsWith(line, '#')
        }
        else {
            return false
        }
    })
    return _.reduce(lines, function add_to_obj(o, l) {
        var i = l.indexOf(' ')
        var intent = _.trim(l.substring(0, i))
        var text = _.trim(l.substring(i + 1))
        if(o[intent]){
            o[intent].push(text)
        }else{
            o[intent] = [text]
        }
        return o
    }, {})
}

function log(text) {
    console.log(text)
}

var dummy_function = function(req, resp){}

function main(file_name) {
    var app = new alexa.app('hello')
    fs.readFile(file_name, 'utf8', function(err, data) {
        data = text_to_obj(data)
        for(var intent in data){
            app.intent(intent, {'utterances' : data[intent]}, dummy_function())
        }
        log(app.schema())
        log('/////////////////////////////////')
        log(app.utterances())

    });

}


if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}

main(process.argv[2])