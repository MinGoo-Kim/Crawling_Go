'use strict';

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var dynamo = new AWS.DynamoDB.DocumentClient();

const Table = {
    DICTIONARY: 'DICTIONARY_TB'
};

// Update the item, unconditionally,

var params = {
    TableName: Table.DICTIONARY,
    Key:{
        id: "ObjectId(5917776022abfa3fa070bf7a)"
    },
    UpdateExpression: 'SET #column1 = :value1',
    ExpressionAttributeNames: {
        '#column1': 'desc' //COLUMN NAME
    },
    ExpressionAttributeValues: {
        ':value1': "이것도 뜻이 없어..."
    },
    ReturnValues:"UPDATED_NEW"
};

console.log("Updating the item...");
dynamo.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
});