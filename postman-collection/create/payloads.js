const globalPayload = {
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
};

const channelSpecificPayload = {
    request: {
        root_org: "0137541424673095687",
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
};

const NCFPayload = {
    request: {
        root_org: "0137541424673095687",
        framework: "NCF"
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
};

module.exports = {
    globalPayload,
    channelSpecificPayload,
    NCFPayload
};
