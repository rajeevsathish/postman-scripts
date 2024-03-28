var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var read_ps_coll = require('./read/read-ps-collection')
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Body parser use JSON data

app.post('/launches', function(req, res) {

    var outputFilename = './spaceReport.json'; // path of the file to output

    fs.writeFileSync(outputFilename, JSON.stringify(JSON.parse(req.body.payload), null, 4)); // write to the file system

    res.send('Saved to ' + outputFilename);

});

app.get("/read", function(req, res) {
    var collJson = read_ps_coll.readColl();

    res.send(collJson);
});

var port = 3000;
app.listen(port);
console.log('Express started on port %d ...', port);