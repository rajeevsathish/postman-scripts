const fs = require('fs');
const dotenv = require('dotenv');
const { getPayload, fetchDataFromAPI } = require('./api');
const { processDuplicates } = require('./helper');
const { generatePostmanItems } = require('./postmanItems');

if (!fs.existsSync('.env')) {
    console.log('Please create a .env file and set BASE_URL and AUTH_API_TOKEN values.');
    console.log('Follow instructions mentioned in .env_example file');
    return;
}

dotenv.config();

const HOST_URL = process.env.BASE_URL;
const API_AUTH_TOKEN = process.env.AUTH_API_TOKEN;

if (!HOST_URL || !API_AUTH_TOKEN) {
    console.log('Please set BASE_URL and AUTH_API_TOKEN values in the .env file.');
    return;
}

const generateChannelItems = async (channelId) => {
    const channelItems = {
        name: channelId,
        item: []
    };

    const payload = getPayload(channelId);
    const formsData = await fetchDataFromAPI(payload);

    // Extract unique frameworks
    const uniqueFrameworks = new Set(formsData.map(item => item.framework));

    for (const framework of uniqueFrameworks) {
        const frameworkFormPostmanItems = {
            name: `Framework-${framework}`,
            item: []
        };

        const frameworkPayload = getPayload(channelId, framework);
        const frameworkForms = await fetchDataFromAPI(frameworkPayload);

        const { uniqueForms, duplicateForms} = processDuplicates(frameworkForms);

        console.log(`${channelId}-${framework} :: uniqueForms : ${uniqueForms.length}  duplicateForms: ${duplicateForms.length}\n`);

        const frameworkFormsItems = generatePostmanItems(uniqueForms);
        frameworkFormPostmanItems.item.push(...frameworkFormsItems);

        if (duplicateForms.length > 0) {
            const duplicateFormPostmanItems = {
                name: "Duplicate",
                item: generatePostmanItems(duplicateForms)
            };
            frameworkFormPostmanItems.item.push(duplicateFormPostmanItems);
        }

        channelItems.item.push(frameworkFormPostmanItems);
    }
    return channelItems;
};



const generatePostmanCollection = async () => {
    try {
        const postmanCollection = {
            info: {
                name: "ED Form API Collection",
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
        const globalForms = await fetchDataFromAPI(globalPayload);

        const { uniqueForms, duplicateForms} = processDuplicates(globalForms);

        console.log(`Global ** :: uniqueForms : ${uniqueForms.length}  duplicateForms: ${duplicateForms.length}\n`);

        if (duplicateForms.length > 0) {
            const duplicateFormPostmanItems = {
                name: "Duplicate",
                item: generatePostmanItems(duplicateForms)
            };
            globalFormsItems.item.push(duplicateFormPostmanItems);
        }

        const globalFormsItems = generatePostmanItems(uniqueForms);
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

        const collectionJson = JSON.stringify(postmanCollection, null, 4);
        fs.writeFileSync("collection.json", collectionJson);

        console.log("collection.json created successfully!");
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

generatePostmanCollection();
