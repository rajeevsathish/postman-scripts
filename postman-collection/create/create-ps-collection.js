const { Collection, Item, Header } = require('postman-collection');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const HOST_URL = process.env.BASE_URL || "https://dev.sunbirded.org/";
const API_AUTH_TOKEN = 'Bearer ' + process.env.AUTH_API_TOKEN;

const filePath = path.resolve(__dirname, '../read/data/sb-apis-mock.postman_collection.json');

// Read the input JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  try {
    const collection = JSON.parse(data);

    // Extracting necessary information from the input collection
    const readResponse = collection.item[0].response;
    const formReq = JSON.parse(readResponse[0].body).result.form;
    console.log('formReq ==>', formReq);
    delete formReq.created_on;
    delete formReq.last_modified_on;
    const requestPayload = {
       request: formReq
    };
    // Format the payload - todo
    console.log('requestPayload ==>', requestPayload);
    
    // This string will be parsed to create header
    const rawHeaderString = 'Authorization:' + API_AUTH_TOKEN +'\nContent-Type:application/json\n';

    // Parsing string to postman compatible format
    const rawHeaders = Header.parse(rawHeaderString);

    // Generate headers
    const requestHeader = rawHeaders.map((h) => new Header(h));

    // API endpoint
    const apiEndpoint = HOST_URL + '/api/data/v1/form/create';

    // Name of the request
    const requestName = 'Form Create';

    // Add tests for request
    const requestTests = `
    pm.test('Sample test: Test for successful response', function() {
    pm.expect(pm.response.code).to.equal(200);
    });
    `

    // Create the final request
    const postmanRequest = new Item({
    name: `${requestName}`,
    request: {
        header: requestHeader,
        url: apiEndpoint,
        method: 'POST',
        body: {
        mode: 'raw',
        raw: JSON.stringify(requestPayload),
        },
        auth: null,
    },
    event: [
        {
        listen: 'test',
        script: {
            type: 'text/javascript',
            exec: requestTests,
        },
        },
    ],
    });

    // This is the our postman collection
    const postmanCollection = new Collection({
        info: {
        name: 'Easy Install Form Postman collection'
        },
        item: [],
    });

    // Add the reqest to our empty collection
    postmanCollection.items.add(postmanRequest);

    // Convert the collection to JSON 
    // so that it can be exported to a file
    const collectionJSON = postmanCollection.toJSON();

    // Create a colleciton.json file. It can be imported to postman
    fs.writeFile('./collection.json', JSON.stringify(collectionJSON), (err) => {
    if (err) {
        console.error('Error writing file:', err);
        return;
    }
    console.log('Postman collection JSON file created successfully!');
    });
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});