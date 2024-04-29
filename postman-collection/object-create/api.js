const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const HOST_URL = process.env.BASE_URL;
const API_AUTH_TOKEN = process.env.AUTH_API_TOKEN;


const getObjectCategoryDefList = async () => {
    try {
        const payload = {
            "request": {
                "filters": {
                    "status": [
                        "Live"
                    ],
                    "objectType": "objectCategoryDefinition"
                }
            }
        }
        const response = await axios.post(`${HOST_URL}/api/composite/v1/search`, payload, {
            headers: {
                'Authorization': `Bearer ${API_AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.result.ObjectCategoryDefinition;
    } catch (error) {
        throw error;
    }
};

const getObjectCategoryDefinition = async (objectType, objectCategoryDefinitionName) => {
    try {
        const payload = {
            "request": {
                "objectCategoryDefinition": {
                    "objectType": objectType,
                    "name": objectCategoryDefinitionName
                }
            }
        }
        const response = await axios.post(`${HOST_URL}/api/object/category/definition/v1/read?fields=objectMetadata,forms,name`, payload, {
            headers: {
                'Authorization': `Bearer ${API_AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.result.objectCategoryDefinition;
    } catch (error) {
        throw error;
    }
};

module.exports = { getObjectCategoryDefList, getObjectCategoryDefinition };