const fs = require('fs');
const dotenv = require('dotenv');
const { getObjectCategoryDefList, getObjectCategoryDefinition } = require('./api');
const { generatePostmanItems } = require('./postmanItem');

if (!fs.existsSync('.env')) {
    console.log('Please create a .env file and set BASE_URL and AUTH_API_TOKEN values.');
    console.log('Follow instructions mentioned in .env_example file');
    return;
}

dotenv.config();

const filterObjectsWithAllIdentifier = (objectCategoryDefinitions) => {
    return objectCategoryDefinitions.filter(obj => obj.identifier.includes('_all'));
}

const generatePostmanCollection = async () => {
    try {
        const postmanCollection = {
            info: {
                name: "ED Object Category Def Create API Collection",
                schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            item: []
        };

        const objectCategoryDefinitions = await getObjectCategoryDefList();
        const _allObjectCategoryDefinitions = filterObjectsWithAllIdentifier(objectCategoryDefinitions);
        console.log('_allObjectCategoryDefinitions count ==>', _allObjectCategoryDefinitions.length);
        
        // _allObjectCategoryDefinitions.forEach(async (category, index) => {
        //     const categoryDef = await getObjectCategoryDefinition(category.targetObjectType, category.name);
        //     const CategoryDefCreateItems = generatePostmanItems(categoryDef, category.categoryId, category.targetObjectType, category.name, index);
        //     postmanCollection.item.push(CategoryDefCreateItems);
        // });
        
        // for (const category of _allObjectCategoryDefinitions) {
        //     const categoryDef = await getObjectCategoryDefinition(category.targetObjectType, category.name);
        //     const CategoryDefCreateItems = generatePostmanItems(categoryDef, category.categoryId, category.targetObjectType, category.name);
        //     postmanCollection.item.push(CategoryDefCreateItems);
        // }

        for (const [index, category] of _allObjectCategoryDefinitions.entries()) {
            const categoryDef = await getObjectCategoryDefinition(category.targetObjectType, category.name);
            const CategoryDefCreateItems = generatePostmanItems(categoryDef, category.categoryId, category.targetObjectType, category.name, index);
            postmanCollection.item.push(CategoryDefCreateItems);
        }
        
        const collectionJson = JSON.stringify(postmanCollection, null, 4);
        fs.writeFileSync("obj-cat-collection.json", collectionJson);

        console.log("obj-cat-collection.json created successfully!");
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

generatePostmanCollection();