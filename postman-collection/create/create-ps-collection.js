const fs = require('fs');
const { fetchDataFromAPI } = require('./api');
const { generatePostmanItems } = require('./postmanItems');
const { globalPayload, channelSpecificPayload, NCFPayload } = require('./payloads');

const generatePostmanCollection = async () => {
    try {
        const postmanCollection = {
            info: {
                name: "Easy Install Form API Collection",
                schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            item: [
                {
                    name: "Global*",
                    item: []
                },
                {
                    name: "ChannelId",
                    item: [
                        {
                            name: 'Framework-*',
                            item: []
                        },
                        {
                            name: 'Framework-NCF',
                            item: []
                        }
                    ]
                },
                {
                    name: "Duplicates",
                    item: []
                }
            ]
        };

        const globalFormsData = await fetchDataFromAPI(globalPayload);
        const globalFormsItems = generatePostmanItems(globalFormsData);
        postmanCollection.item[0].item.push(...globalFormsItems);

        const channelFormResponseData = await fetchDataFromAPI(channelSpecificPayload);
        const channelFormPostmanItems = generatePostmanItems(channelFormResponseData);
        postmanCollection.item[1].item[0].item.push(...channelFormPostmanItems);

        const NCFFormResponseData = await fetchDataFromAPI(NCFPayload);
        const NCFFormPostmanItems = generatePostmanItems(NCFFormResponseData);
        postmanCollection.item[1].item[1].item.push(...NCFFormPostmanItems);

        const collectionJson = JSON.stringify(postmanCollection, null, 4);
        fs.writeFileSync("collection.json", collectionJson);

        console.log("collection.json created successfully!");
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

generatePostmanCollection();
