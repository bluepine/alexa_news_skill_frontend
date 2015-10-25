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



// Connect to lambda
var app = require('./news_app.js')
exports.handler = app.lambda();
