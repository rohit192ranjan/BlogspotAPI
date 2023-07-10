let DataURIParser = require('datauri/parser')
let path = require('path')

const getDataUri = file => {
    let dUri = new DataURIParser()
    return dUri.format(path.extname(file.originalname).toString(), file.buffer);
}

module.exports = getDataUri