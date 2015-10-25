function log(text) {
    console.log(text)
}

var Q = require('q')
var R = require('request')

var httpGet = function(url) {
    var deferred = Q.defer();
    R(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(body)
        }
        else {
            deferred.resolve(null)
        }
    })
    return deferred.promise;
}

var alexa = require('alexa-app')
var app = new alexa.app()
app.intent('getNews', {
        "slots": {},
        "utterances": [],
    },
    function(request, response) {
        var url = "https://controller-noyda.c9.io/articlelistontopic/news"
        httpGet(url).then(function(body) {
            response.say(JSON.stringify(body)).send()
            response.send()
        }).catch(function(err) {
            response.say('http request failed').send()
        });
        return false;
    }
)

app.intent('reset', {
        "slots": {},
        "utterances": [],
    },
    function(request, response) {
        log('reset')
        var url = "https://controller-noyda.c9.io"
        Q(url, function(error, resp, body) {
            if (!error && resp.statusCode == 200) {
                response.say('done').send()
            }
            else {
                response.say('http request failed').send()
            }
        })
        return false
    }
)

module.exports = app