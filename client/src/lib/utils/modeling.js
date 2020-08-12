const colToList = obj => {
    const result = [];
    for (let key in obj) {
        result.push(obj[key]);
    }
    return result;
};

const listToCol = list => {
    const result = {};
    list.forEach(x => result[x.quillID] = x);
    return result;
};

export {
    colToList,
    listToCol,
};