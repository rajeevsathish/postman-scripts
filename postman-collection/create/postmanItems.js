const generatePostmanItems = (responseData) => {
    const postmanItems = [];

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

        postmanItems.push(item);
    });

    return postmanItems;
};

module.exports = { generatePostmanItems };
