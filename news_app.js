// ArticleListOnTopicIntent top headlines on {politics|Topic}
// ArticleDetailKeywordIntent tell me the {Clinton|Keyword} story
// ArticleDetailNumberIntent tell me story {StoryNumber}
// ArticleDetailOrderIntent tell me the {Order} story
// NextArticleIntent play the next story
// PreviousArticleIntent play the previous story
// NextArticleListIntent more headlines
// PreviousArticleListIntent previous list of headlines
// ReferenceArticleDetailKeywordIntent tell me more about {Clinton|Keyword}
// ArticleListIntent top headlines
// OldArticleListIntent what did i miss
// OlderArticleListIntent more that i miss
// OldArticleListOnTopicIntent what did i miss on {politics|Topic}
// OlderArticleListOnTopicIntent more that i miss on {politics|Topic}
// NoInterestForListIntent i don't like this list
// NoInterestForArticleIntent i don't like this article
// ArticleListOnDateIntent top headlines {Date}
// ArticleListOnTopicOnDateIntent top headlines on {politics|Topic} {Date}
// ReplayArticleIntent replay article
// ReplayArticleListIntent replay headlines

var backend_base_url = 'https://controller-noyda.c9.io/'

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

var _ = require('lodash');
var alexa = require('alexa-app')
var app = new alexa.app()
var TOPIC = 'Topic'
var NUMBER = 'StoryNumber'
app.intent('ArticleListOnTopicIntent', {
        "slots": {
            TOPIC: 'AMAZON.LITERAL'
        },
        "utterances": [],
    },
    function(request, response) {
        var topic = request.slot(TOPIC);
        if (!topic) {
            response.reprompt('Please ask for headlines on a specific topc')
            return true
        }
        topic = topic.trim()
        var url = backend_base_url + 'articlelistontopic/' + topic
        httpGet(url).then(function(body) {
            var headlines = _.reduce(body, function(ret, item) {
                ret += item.body + ' '
                return ret
            }, '')

            headlines = headlines.trim()
            if (!headlines) {
                response.say(JSON.stringify(headlines)).send()
            }
            else {
                response.say('sorry, we have no more articles on ' + topic).send()
            }
        }).catch(function(err) {
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)

app.intent('ArticleDetailNumberIntent', {
        "slots": {
            'StoryNumber': 'AMAZON.NUMBER'
        },
        "utterances": [],
    },
    function(request, response) {
        var number = request.slot(NUMBER);
        if (!number) {
            response.reprompt('Please let me know which headline do you want to hear more about')
            return true
        }
        number = number.trim()
        var url = backend_base_url + 'articledetail/number/' + number
        httpGet(url).then(function(body) {
            if (!body || !body.title || !body.body) {
                response.say('Please ask for a list of headlines first').send()
                return
            }
            var detail = body.title + '.' + body.body
            response.say(detail).send()
        }).catch(function(err) {
            log(err)
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)


function add_debugging_card(request, response) {
    var intent = request.data.request.intent.name
    var slots = request.data.request.intent.slots
    var card_response = ''
    for (var key in slots) {
        card_response = card_response + key + " : " + request.slot(key) + '; '
    }
    response.card(intent, card_response)
}

app.pre = function(request, response, type) {
    add_debugging_card(request, response)
};

module.exports = app