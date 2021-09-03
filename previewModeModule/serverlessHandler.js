const constants = require("./constants.json");
const path = require('path'); //Path Resolve needed to make plugin mode copy work
const xpath = path.resolve(".", constants.config.serverlessFunctionName) ;
const serverlessFolder = require(xpath);

/**
 * runs serverless eleventy on the default page.  Returns a function response.
 * @param {*} queryStringParameters from your function's request `req.query`
 * @returns {Promise<{statusCode:number, headers:{"Content-Type":string},body:string}>} Function response Promise
 * @example context.res = await serverlessHandler(req.query); //Azure FaaS
 */
const serverlessHandler = async queryStringParameters => 
     serverlessFolder.handler({ path: constants.config.pagePath, queryStringParameters });

module.exports = { serverlessHandler }