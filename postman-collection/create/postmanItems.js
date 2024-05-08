const fs = require('fs');
const formsData = require('../formdata.json');
const _ = require('lodash');
const generatePostmanItems = (responseData) => {
    const postmanItems = [];
    responseData.forEach((eachResponseData, index) => {
        const obj = {}
        obj['type'] = eachResponseData.type;
        obj['subtype'] = eachResponseData.subtype;
        obj['action'] = eachResponseData.action;
        obj['component'] = eachResponseData.component;
        obj['framework'] = eachResponseData.framework;
        obj['root_org'] = eachResponseData.root_org;
        if (_.some(formsData.formData, obj)) {
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
            const formName = `${eachResponseData.type} | ${eachResponseData.subtype} | ${eachResponseData.action} | ${eachResponseData.component}`;
            const item = {
                name: `Form-${postmanItems.length+1} - ` + formName,
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
        } else {
            console.log('This object not needed for the easy installation-->', obj)
        }
    });

    return postmanItems;
};

module.exports = { generatePostmanItems };
