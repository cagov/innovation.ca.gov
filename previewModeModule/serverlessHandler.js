const constants = require("./constants.json");
const path = require('path'); //Path Resolve needed to make plugin mode copy work
const xpath = path.resolve(".", constants.config.serverlessFunctionName) ;
const serverlessFolder = require(xpath);

const serverlessHandler = async (queryStringParameters) => 
     serverlessFolder.handler({ path: constants.config.pagePath, queryStringParameters });

module.exports = { serverlessHandler }