const generatePostmanItems = (categoryDef, categoryId, targetObjectType, objctCatName, index) => {

    const requestData = {
        request: {
            objectCategoryDefinition: {
                categoryId: categoryId,
                targetObjectType: targetObjectType,
                objectMetadata: categoryDef.objectMetadata,
                forms: categoryDef.forms,
            }
        }
    };

    // const formName = objctCatName;
    const formName = `${index + 1} - ${objctCatName} | CId - ${categoryId} , OType - ${targetObjectType}`;
    const item = {
        name: formName,
        request: {
            method: "POST",
            url: "{{host}}/api/object/category/definition/v1/create",
            header: [
                {
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

    return item;
};

module.exports = { generatePostmanItems };
