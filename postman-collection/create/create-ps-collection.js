const fs = require('fs');
const { fetchDataFromAPI } = require('./api');
const { generatePostmanItems } = require('./postmanItems');

const getPayload = (channelId, frameworkId) => {
    let payload = {
        request: {},
        fields: [
            "type",
            "subtype",
            "action",
            "component",
            "framework",
            "data",
            "root_org"
        ]
    };

    if (channelId && frameworkId) {
        payload.request.root_org = channelId;
        payload.request.framework = frameworkId;
    } else if (channelId) {
        payload.request.root_org = channelId;
    } else {
        payload.request.root_org = '*';
        payload.request.framework = '*';
    }

    return payload;
};


const frameworkItems = (frameworkValue) => {
    return {
        name: 'Framework-' + frameworkValue,
        item: []
    }
}

const generateChannelItems = async (channelId) => {
    let channelItems = {
        name: channelId,
        item: []
    };

    const payload = getPayload(channelId);
    const formsData = await fetchDataFromAPI(payload);

    const uniqueFrameworks = new Set();
    formsData.forEach(item => {
        uniqueFrameworks.add(item.framework);
    });

    const allFrameworks = Array.from(uniqueFrameworks);
    for (const framework of allFrameworks) {
        let frameworkFormPostmanItem = frameworkItems(framework);
        const frameworkPayload = getPayload(channelId, framework);
        const frameworkFormData = await fetchDataFromAPI(frameworkPayload);
        const frameworkFormsItems = generatePostmanItems(frameworkFormData);
        frameworkFormPostmanItem.item.push(...frameworkFormsItems);
        channelItems.item.push(frameworkFormPostmanItem);
    }
    return channelItems;
}


const generatePostmanCollection = async () => {
    try {
        const postmanCollection = {
            info: {
                name: "Easy Install Form API Collection",
                schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            item: []
        };
        /* Global API Collection Generation - Start */
        let globalItems = {
            name: "Global*",
            item: []
        };
        const globalPayload = getPayload();
        const globalFormsData = await fetchDataFromAPI(globalPayload);
        const globalFormsItems = generatePostmanItems(globalFormsData);
        globalItems.item.push(...globalFormsItems);
        postmanCollection.item.push(globalItems);
        /* Global API Collection Generation - End */

        /* Channel API Collection Generation - Start */
        if (process.env.CHANNELS) {
            const CHANNELS = JSON.parse(process.env.CHANNELS);
            const processChannels = async () => {
                if (CHANNELS) {
                    for (const channel of CHANNELS) {
                        const generatedChannelItems = await generateChannelItems(channel);
                        postmanCollection.item.push(generatedChannelItems);
                    }
                }
            }
            await processChannels();
        }
        /* Channel API Collection Generation - End */

        console.log('postmanCollection ==>', postmanCollection);
        const collectionJson = JSON.stringify(postmanCollection, null, 4);
        fs.writeFileSync("collection.json", collectionJson);

        console.log("collection.json created successfully!");
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

generatePostmanCollection();
