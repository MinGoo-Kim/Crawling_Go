'use strict';

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var dynamo = new AWS.DynamoDB.DocumentClient();

var table = "DICTIONARY_TB";

var scanParams = {
    TableName: table
};

dynamo.scan(scanParams, function(err, data) {
    if (err) console.log(err); // an error occurred
    else {
        data.Items.forEach(function(obj,i){
            console.log(i);
            console.log(obj);
            var params = {
                TableName: scanParams.TableName,
                Key: {
                    id: obj.id
                }
            };

            dynamo.delete(params, function(err, data) {
                if (err) console.log(err); // an error occurred
                else data; // successful response
            });

        });
    }
});