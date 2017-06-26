'use strict';

var AWS = require('aws-sdk');
// AWS.config.loadFromPath('./config.json');

var Joi = require('Joi');

var vogels = require('vogels');
vogels.AWS.config.loadFromPath('./config.json');

// var dynamo = new AWS.DynamoDB.DocumentClient();

var table = "DICTIONARY_TB";

var DICTIONARY = vogels.define(table, {
    hashKey : 'id',

    schema : {
        word   : Joi.string(),
        desc    : Joi.string(),
        published_date     : Joi.string()
    }
});

DICTIONARY.config({tableName: 'DICTIONARY_TB'});

var printResults = function (err, resp) {
    console.log('----------------------------------------------------------------------');
    if(err) {
        console.log('Error running scan', err);
    } else {
        console.log('Found', resp.Count, 'items');
        // console.log(util.inspect(_.pluck(resp.Items, 'attrs')));

        if(resp.ConsumedCapacity) {
            console.log('----------------------------------------------------------------------');
            console.log('Scan consumed: ', resp.ConsumedCapacity);
        }
    }

    console.log('----------------------------------------------------------------------');
};

DICTIONARY
    .scan()
    .loadAll()
    .exec(printResults);