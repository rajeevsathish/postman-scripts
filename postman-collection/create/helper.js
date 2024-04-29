const processDuplicates = (allForms) => {
    const uniqueForms = [];
    const duplicateForms = [];
    const seenObjects = {};

    allForms.forEach(obj => {
        const key = `${obj.type}_${obj.subtype}_${obj.action}_${obj.component}`;
        if (seenObjects[key]) {
            duplicateForms.push(obj);
        } else {
            uniqueForms.push(obj);
            seenObjects[key] = true;
        }
    });

    return { uniqueForms, duplicateForms };
};

module.exports = { processDuplicates };