var fs       = require('fs'),
    readline = require('readline'),
    request  = require('request'),
    exec = require('child_process').execSync,
    cheerio  = require('cheerio'),
    async = require('async');

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

const uuidV4 = require('uuid/v4'); // create UUID module

var dynamo = new AWS.DynamoDB.DocumentClient();

var table = "DIC_GOO";

// 단어 파싱 예제
// node parse_word.js "파일 이름"

// [File Path Argument!]
if (process.argv[2] === undefined) {
    console.log("파라메터를 입력해 주세요. \n(예> node parse_word_dynamo words.txt)");
    return;
}
var filePath = process.argv[2];

var instream = fs.createReadStream(filePath);
var rl = readline.createInterface({
    input: instream,
    terminal: false
});

// async.waterfall([
//     function (callback) {
//         var word_list = [];
//
//         rl.on('line', function(line) {
//             var regex =
//                 /[a-zA-Z]+/g;
//             //  /\w+/g;
//             //	/[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g;
//             var words = line.match(regex);
//             if (Array.isArray(words)) {
//                 words.map(function(name) {
//                     // console.log(name)
//                     word_list.push(name);
//                     console.log(word_list.length+".....")
//                     if(word_list.length == 274926){
//                         callback(null, word_list)
//                     }
//                 });
//             }
//         });
//
//     },
//     function (word_list, callback) {
//         console.log(word_list);
//         async.each(word_list, putWord, function (err) {
//             if(err) console.log(err);
//             callback(null, "끝")
//         });
//
//         function putWord(word, callback) {
//             // console.log(word)
//             var params = {
//                 TableName: table,
//                 Item:{
//                     "id": uuidV4(),
//                     "word": word,
//                     "mean": null
//                 }
//             };
//
//             dynamo.put(params, function(err, data) {
//                 if(err) console.log(err);
//                 console.log(data+".....");
//                 // callback
//             });
//             console.log(word)
//         }
//     }
// ], function (err, result) {
//     console.log(result)
// });

function parseWord() {
    var lineCountStr = exec('sed -n \'$=\' ' + filePath);
    var lineCount = parseInt(lineCountStr);

    var ProgressBar = require('progress');
    var bar = new ProgressBar('[Word Parsing] :bar :percent', { total: lineCount, width: 20 });

    rl.on('line', function(line) {
        var regex =
            /[a-zA-Z]+/g;
        //  /\w+/g;
        //	/[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g;
        var words = line.match(regex);
        if (Array.isArray(words)) {
            words.map(function(name) {
                addWord(name);
            });
        }
        bar.tick();
    });

    // rl.on('close', function() {
    //     console.log("[complete]");
    //     process.exit(0);
    // });
}

function addWord(name) {
    var params = {
        TableName: table,
        Item:{
            "id": uuidV4(),
            "word": name,
            "mean": null
        }
    };

    dynamo.put(params, function(err, data) {
        console.log(name)
    });
}

parseWord();
