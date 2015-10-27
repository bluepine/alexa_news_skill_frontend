var alexa = require('alexa-app');
var Q = require('q')
var _ = require('lodash');
var fs = require('fs')

function text_to_obj(responses, slots) {
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
        if (!o[intent]) {
            o[intent] = {
                'utterances': [],
                'slots': {}
            }
        }
        for (var slot in slots) {
            if (text.match(new RegExp(slot + '\s*'))) {
                o[intent].slots[slot] = slots[slot]
            }
        }
        o[intent].utterances.push(text)
        return o
    }, {})
}

function log(text) {
    console.log(text)
}

var dummy_function = function(req, resp) {}

function main(u_file, s_file) {
    var app = new alexa.app('hello')
    fs.readFile(s_file, 'utf8', function(err, slots) {
        slots = JSON.parse(slots)
        fs.readFile(u_file, 'utf8', function(err, data) {
            data = text_to_obj(data, slots)
            for (var intent in data) {
                log(data[intent])
                app.intent(intent, data[intent], dummy_function())
            }
            log(app.schema())
            log('/////////////////////////////////')
            log(app.utterances())
        });
    })

}


if (process.argv.length < 4) {
    console.log('Usage: node ' + process.argv[1] + ' utterance.json slot.json');
    process.exit(1);
}

main(process.argv[2], process.argv[3])
