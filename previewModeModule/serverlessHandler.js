const constants = require("./constants.json");
const serverlessFolder = require("../" + constants.config.serverlessFunctionName);


const serverlessHandler = async (queryStringParameters) => 
     serverlessFolder.handler({ path: constants.config.pagePath, queryStringParameters });

module.exports = { serverlessHandler }