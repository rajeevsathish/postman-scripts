const fs = require('fs');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const HOST_URL = process.env.BASE_URL || "https://dev.sunbirded.org/";
const API_AUTH_TOKEN = process.env.AUTH_API_TOKEN;

const fetchData = async () => {
  try {
    const response = await axios.post(`${HOST_URL}/api/data/v1/form/fetchAll`, {
          request: {
              root_org: "*",
              framework: "*"
          },
          fields: [
              "type",
              "subtype",
              "action",
              "component",
              "framework",
              "data",
              "root_org"
          ]
      }, {
          headers: {
              'Authorization': `Bearer ${API_AUTH_TOKEN}`,
              'Content-Type': 'application/json'
          }
      });

      // console.log('responseData ==>',response.data.result.forms);
      const responseData = response.data.result.forms;

      // Create an object to hold the collection
      const postmanCollection = {
      info: {
        name: "Easy Install Form API Collection",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: [{
        name: "Global*",
        item: []
      }]
     };

      // Add requests to the Postman collection
      responseData.forEach((eachResponseData, index) => {
      const requestData = {
        request: {
            type: eachResponseData.type,
            subtype: eachResponseData.subtype,
            action: eachResponseData.action,
            component: eachResponseData.component,
            framework: eachResponseData.framework,
            data: JSON.parse(eachResponseData.data),
            rootOrgId: eachResponseData.root_org
        }
      };
      const item = {
        name: `Form ${index + 1}`,
        request: {
            method: "POST",
            url: "{{host}}/api/data/v1/form/create",
            header: [{
                    key: "Authorization",
                    value: "Bearer {{api_key}}",
                    description: ""
                },
                {
                    key: "Content-Type",
                    value: "application/json",
                    description: ""
                }
            ],
            body: {
                mode: "raw",
                raw: JSON.stringify(requestData, null, 4)
            },
            description: "Generated from Node.js script"
        },
        response: []
      };
      postmanCollection.item[0].item.push(item);
      });

      // Write the Postman collection to a JSON file
      const collectionJson = JSON.stringify(postmanCollection, null, 4);
      fs.writeFileSync("collection.json", collectionJson);

      console.log("collection.json created successfully!");
  } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
  }
};

fetchData();