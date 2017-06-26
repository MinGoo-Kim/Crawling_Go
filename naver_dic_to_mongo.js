var request = require("request");
var cheerio = require("cheerio");
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

// [Mongo DB]
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/dictionary');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
    requestWord();
});

// [DB Schema]
var wordSchema = new mongoose.Schema({
    word: { type: String, index: { unique: true}},
    desc: { type: String, default: "-" },
    published_date: { type: Date, default: Date.now  }
});
wordSchema.plugin(mongoosePaginate);
var Word = mongoose.model('word', wordSchema);

function requestWord() {
    var ProgressBar = require('progress');
    Word.find({desc: "-"}).exec(function(err, result) {
        console.log(result.length);
        var bar = new ProgressBar('[Word Parsing] :bar :percent (:current/:total) :word :info ', { total: result.length, width: 20 });
        enumerateWord(1, bar);
    });
}

var dic_url = "http://m.endic.naver.com/search.nhn?searchOption=all&query=";

function enumerateWord(page, pBar) {
    Word.paginate({desc: "-"}, {page: page, limit: 1}).then(function(result) {

        request({
            url: dic_url + result.docs[0].word,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36'
            }
        }, function(error, response, body) {
            if (error) {
                pBar.interrupt(error + '\ncurrent progress is ' + page + '/' + pBar.total);
            }

            var $ = cheerio.load(body);

            var meaning_list = [];
            $('div.section_card').each(function () {
                $(this).find('p.desc').each(function () {
                    // console.log($(this).text());
                    meaning_list.push($(this).text());
                });
            });

            console.log("\n"+meaning_list);

            Word.findOneAndUpdate({_id: result.docs[0]._id}, {$set: {desc: meaning_list}}, function(uErr, uRes){
                if (uErr) {
                    pBar.interrupt(uErr + '\ncurrent progress is ' + page + '/' + pBar.total);
                }

                pBar.tick({word: result.docs[0].word, info: page + "/" + pBar.total});
                if (page < pBar.total) {
                    enumerateWord(page + 1, pBar);
                } else if (page == pBar.total) {
                    console.log("[complete]");
                    process.exit(0);
                }
            });
        });
    });
}