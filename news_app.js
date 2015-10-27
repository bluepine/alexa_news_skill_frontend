//done:
// ArticleListOnTopicIntent top headlines on {politics|Topic}
// ArticleDetailKeywordIntent tell me the {Clinton|Keyword} story
// ArticleDetailNumberIntent tell me story {StoryNumber}
// NextArticleIntent play the next story
// PreviousArticleIntent play the previous story
// NextArticleListIntent more headlines
// PreviousArticleListIntent previous list of headlines
// ArticleListIntent top headlines
// ArticleListOnDateIntent top headlines {Date}
// ArticleListOnTopicOnDateIntent top headlines on {politics|Topic} around {Date}
// ReplayArticleIntent replay article
// ReplayArticleListIntent replay headlines

//remaining:
// ReferenceArticleDetailKeywordIntent tell me more about {Clinton|Keyword}
// OldArticleListIntent what did i miss
// OlderArticleListIntent more that i miss
// OldArticleListOnTopicIntent what did i miss on {politics|Topic}
// OlderArticleListOnTopicIntent more that i miss on {politics|Topic}
// NoInterestForListIntent i don't like this list
// NoInterestForArticleIntent i don't like this article


var backend_base_url = 'https://nodejs-test-swei-turner.c9.io/'

var NO_MATCH_RESPONSE = 'NOTMATCH'
var EMPTY_RESULT_RESPONSE = ''
var ERROR_RESULT_RESPONSE = 'ERROR'
var SEND_CARD = false

//slot names
var TOPIC = 'Topic'
var NUMBER = 'StoryNumber'
var KEYWORD = 'Keyword'
var DATE = 'Date'

/////////////////////////////////////

function log(text) {
    console.log(text)
}

var Q = require('q')
var R = require('request')
var dateFormat = require('dateformat')
var _ = require('lodash');
var alexa = require('alexa-app')

var httpGet = function(url) {
    log(url.slice(-1))
    if (url.slice(-1) == '/') {
        url = _.trimRight(url, '/')
    }
    log(url)
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

var app = new alexa.app()

function list_response(list, response, topic) {
    list = JSON.parse(list)
    var card_response = ''
    var headlines = list.reduce(function(ret, item) {
        // log('item:'+item.headline)
        ret += item.headline + '. '
        card_response += item.headline + '\n' //+ '. From ' + item.url + '\n'
        return ret
    }, '')
    headlines = headlines.trim()
    if (headlines) {
        var card_title = 'Headline List'
        if (topic) {
            card_title += ' on ' + topic
        }
        if (SEND_CARD) {
            response.card(card_title, card_response)
        }
        response.say(headlines).send()
    }
    else {
        var sorry = 'sorry, we have no more articles'
        if (topic) {
            sorry += ' on ' + topic
        }
        response.say(sorry).send()
    }
}


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
        var url = backend_base_url + 'articlelist/topic/' + topic
        httpGet(url).then(function(body) {
            if (!body) {
                response.say('sorry, we have no more articles on ' + topic).send()
                return
            }
            list_response(body, response, topic)
        }).catch(function(err) {
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)

app.intent('ArticleListOnTopicOnDateIntent', {
        "slots": {
            TOPIC: 'AMAZON.LITERAL',
            DATE: 'AMAZON.DATE'
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
        var date = request.slot(DATE);
        var url = backend_base_url + 'articlelist/topic/' + topic + '/' + date_q(date)
        httpGet(url).then(function(body) {
            if (!body) {
                response.say('sorry, we have no more articles on ' + topic).send()
                return
            }
            list_response(body, response, topic)
        }).catch(function(err) {
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)


app.intent('ArticleListIntent', {
        "slots": {},
        "utterances": [],
    },
    function(request, response) {
        var url = backend_base_url + 'articlelist'
        httpGet(url).then(function(body) {
            if (!body) {
                response.say('sorry, we have no more articles').send()
                return
            }
            list_response(body, response)
        }).catch(function(err) {
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)

function date_str(date) {
    return dateFormat(date, "yyyy-mm-dd");
}

function date_q(date) {
    var oneDay = 24 * 60 * 60 * 1000;
    var date = new Date(date)
    var diffDays = Math.floor((new Date().getTime() - date.getTime()) / (oneDay));
    if (diffDays <= 0) {
        return ''
    }
    else {
        var preDate
        if (diffDays < 7) {
            preDate = new Date(date.getTime() - oneDay)
        }
        else if (diffDays < 30) {
            preDate = new Date(date.getTime() - 7 * oneDay)
        }
        else {
            preDate = new Date(date.getTime() - 30 * oneDay)
        }
        log(preDate)
        return 'firstPublishDate:' + date_str(preDate) + '~' + date_str(date) + '/'
            // return 'firstPublishDate:'
    }
}

app.intent('ArticleListOnDateIntent', {
        "slots": {
            DATE: 'AMAZON.DATE'
        },
        "utterances": [],
    },
    function(request, response) {
        var date = request.slot(DATE);
        var url = backend_base_url + 'articlelist/' + date_q(date)
        httpGet(url).then(function(body) {
            if (!body) {
                response.say('sorry, we have no more articles').send()
                return
            }
            list_response(body, response)
        }).catch(function(err) {
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)

function article_response(body, response) {
    body = JSON.parse(body)
    if (!body.headline || !body.url || !body.body) {
        response.say('sorry, something went wrong').send()
        return
    }
    if (SEND_CARD) {
        response.card(body.headline, body.body) // + '   From ' + body.url)
    }
    response.say(body.headline + '. ' + body.body).send()
}

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
            if (!body) {
                response.say('Please ask for a list of headlines first').send()
                return
            }
            if (body == NO_MATCH_RESPONSE) {
                response.say('Please specify a value article number within current list').send()
                return
            }
            article_response(body, response)
        }).catch(function(err) {
            log(err)
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)

app.intent('ArticleDetailKeywordIntent', {
        "slots": {
            KEYWORD: 'AMAZON.LITERAL'
        },
        "utterances": [],
    },
    function(request, response) {
        var keyword = request.slot(KEYWORD);
        if (!keyword) {
            response.reprompt('Please let me know which headline do you want to hear more about')
            return true
        }
        keyword = keyword.trim()
        var url = backend_base_url + 'articledetail/keyword/' + keyword
        httpGet(url).then(function(body) {
            if (!body) {
                response.say('Please ask for a list of headlines first').send()
                return
            }
            if (body == NO_MATCH_RESPONSE) {
                response.say('Please specify a key word in one of the headlines').send()
                return
            }
            article_response(body, response)
        }).catch(function(err) {
            log(err)
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)


app.intent('PreviousArticleIntent', {
        "slots": {},
        "utterances": [],
    },
    function(request, response) {
        var url = backend_base_url + 'previousarticle/'
        httpGet(url).then(function(body) {
            if (!body) {
                response.say('sorry, there is no previous article').send()
                return
            }
            article_response(body, response)
        }).catch(function(err) {
            log(err)
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)


app.intent('ReplayArticleIntent', {
        "slots": {},
        "utterances": [],
    },
    function(request, response) {
        var url = backend_base_url + 'currentarticle/'
        httpGet(url).then(function(body) {
            if (!body) {
                response.say('sorry, no article has been selected').send()
                return
            }
            article_response(body, response)
        }).catch(function(err) {
            log(err)
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)

app.intent('NextArticleIntent', {
        "slots": {},
        "utterances": [],
    },
    function(request, response) {
        var url = backend_base_url + 'nextarticle/'
        httpGet(url).then(function(body) {
            if (!body || body == NO_MATCH_RESPONSE) {
                response.say('sorry, headline list has been requested, or you played to the end of the played. Please request more headlines').send()
                return
            }
            article_response(body, response)
        }).catch(function(err) {
            log(err)
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)


app.intent('PreviousArticleListIntent', {
        "slots": {},
        "utterances": [],
    },
    function(request, response) {
        var url = backend_base_url + 'previouslist/'
        httpGet(url).then(function(body) {
            if (!body) {
                response.say('sorry, there is no previous headline list').send()
                return
            }
            list_response(body, response)
        }).catch(function(err) {
            log(err)
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)

app.intent('ReplayArticleListIntent', {
        "slots": {},
        "utterances": [],
    },
    function(request, response) {
        var url = backend_base_url + 'currentlist/'
        httpGet(url).then(function(body) {
            if (!body) {
                response.say('sorry, no headline list has been requested').send()
                return
            }
            list_response(body, response)
        }).catch(function(err) {
            log(err)
            response.say('sorry, something went wrong').send()
        });
        return false;
    }
)

app.intent('NextArticleListIntent', {
        "slots": {},
        "utterances": [],
    },
    function(request, response) {
        var url = backend_base_url + 'newlist/'
        httpGet(url).then(function(body) {
            if (!body) {
                response.say('sorry, no more qualifying headlines').send()
                return
            }
            list_response(body, response)
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

if (!SEND_CARD) {
    app.pre = function(request, response, type) {
        add_debugging_card(request, response)
    };
}

module.exports = app