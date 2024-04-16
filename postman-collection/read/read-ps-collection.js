var fs = require('fs'),
  Collection = require('postman-collection').Collection,
  myCollection;

function readColl() {
    myCollection = new Collection(JSON.parse
        (fs.readFileSync(__dirname + '/data/sb-apis-mock.postman_collection.json').toString()));
    
    var collJson = myCollection.toJSON();
    console.log(collJson);
    return collJson;
}

module.exports = {readColl}
