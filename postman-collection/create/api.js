const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const HOST_URL = process.env.BASE_URL;
const API_AUTH_TOKEN = process.env.AUTH_API_TOKEN;

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

const fetchDataFromAPI = async (payload) => {
    try {
        const response = await axios.post(`${HOST_URL}/api/data/v1/form/fetchAll`, payload, {
            headers: {
                'Authorization': `Bearer ${API_AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.result.forms;
    } catch (error) {
        throw error;
    }
};

module.exports = { getPayload, fetchDataFromAPI };