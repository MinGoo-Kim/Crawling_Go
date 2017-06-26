var request = require("request");
var cheerio = require("cheerio");

// 크롤링 테스트
var word = "help";

request({
    url: 'http://m.endic.naver.com/search.nhn?searchOption=all&query='+word, // 쿼리 URL
    headers: { // 로봇 아님...
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36'
    }
}, function(err, res, html) {

    var $ = cheerio.load(html);

    var meaning_list = [];
    $('div.section_card').each(function () {

        $(this).find('p.desc').each(function () {
            console.log($(this).text());
            meaning_list.push($(this).text());
        });

    });

    console.log(meaning_list)

});