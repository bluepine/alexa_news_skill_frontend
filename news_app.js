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
// app.intent('getNews', {
//         "slots": {},
//         "utterances": [],
//     },
//     function(request, response) {
//         var url = "https://controller-noyda.c9.io/articlelistontopic/news"
//         httpGet(url).then(function(body) {
//             response.say(JSON.stringify(body)).send()
//             response.send()
//         }).catch(function(err) {
//             response.say('http request failed').send()
//         });
//         return false;
//     }
// )


module.exports = app