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



var alexa = require('alexa-app')
var Request = require('request')
var app = new alexa.app()
app.intent('getNews',
  {
    "slots":{},
    "utterances": [],
  },
  function(request,response) {
  	var url = "https://controller-noyda.c9.io/articlelistontopic/news"
  	Request(url, function(error, resp, body) {
        if (!error && resp.statusCode == 200) {
            response.say(body)
        }
        else {
            response.say('http request failed')
        }
    })
  }
)

app.intent('reset',
  {
    "slots":{},
    "utterances": [],
  },
  function(request,response) {
  	var url = "https://controller-noyda.c9.io"
  	Request(url, function(error, resp, body) {
        if (!error && resp.statusCode == 200) {
            response.say('done')
        }
        else {
            response.say('http request failed')
        }
    })
  }
)
// Connect to lambda
exports.handler = app.lambda();
