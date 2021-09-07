
//@ts-check
const fetch = require('node-fetch/lib');
const serverlessFunctionName = "possum";
const pagePath = "/GeneratePreviewModePath";
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
/** @type WordpressPostRow */
const digestPageJSON = require('./digestPageJson.json');

/**
 * Adds EleventyServerless with simple config for single page rendering
 * @param {*} eleventyConfig 
 * @example
 * module.exports = function(eleventyConfig) {
 *   const path = require('path'); //Path Resolve needed to make plugin mode copy work
 *   const { addPreviewModeToEleventy } = require( path.resolve('.','./previewModeModule/addPreviewModeToEleventy') );
 *   addPreviewModeToEleventy(eleventyConfig);
 * }
 */
const addPreviewModeToEleventy = eleventyConfig => {
    eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
        name: serverlessFunctionName, // The serverless function name from your permalink object
        inputDir: "",
        functionsDir: "", //off the root
        redirects: "", //no redirect handling built in
        copyOptions: {
            filter: ['**/*', '!**']
        } // Filtering out all pages, this still brings in includes
    });
};

/**
 * runs serverless eleventy on the default page.  Returns a function response.
 * @param {*} queryStringParameters from your function's request `req.query`
 * @returns {Promise<{statusCode:number, headers:{"Content-Type":string},body:string}>} Function response Promise
 * @example context.res = await serverlessHandler(req.query); //Azure FaaS
 */
const serverlessHandler = async queryStringParameters => {
    const path = require('path'); //Path Resolve needed to make plugin mode copy work
    const xpath = path.resolve(".", serverlessFunctionName);
    const serverlessFolder = require(xpath);
    return serverlessFolder.handler({ path: pagePath, queryStringParameters });
};

/**
* @typedef {Object} WordpressPostRow Expected POST input when using the Wordpress API - https://developer.wordpress.org/rest-api/reference/posts/
* @property {number} author
* @property {number[]} categories
* @property {string} comment_status "closed"
* @property {{rendered:string}} content
* @property {string} date
* @property {string} date_gmt
* @property {{rendered:string}} excerpt
* @property {number} featured_media
* @property {string} format
* @property {{rendered:string}} guid
* @property {number} id
* @property {string} link
* @property {any[]} meta
* @property {string} modified
* @property {string} modified_gmt
* @property {string} ping_status "closed"
* @property {string} slug
* @property {string} status "publish"
* @property {boolean} sticky
* @property {number[]} tags
* @property {string} template
* @property {{rendered:string}} title
* @property {string} type "post"
* @property {{"wp:featuredmedia"?:{source_url:string}[],author:{name:string}[]}} [_embedded]
* @property {*} [_links]
*/

/**
* @typedef {Object} WordpressSettings
* @property {string} wordPressSite
* @property {number} previewWordPressTagId
*/

/**
 * calls fetch and expects a json result.  Error on non-ok status.
 * @param {string} url 
 * @param {*} [opts]
 */
const fetchJson = async (url, opts) => {
    const fetchResponse = await fetch(url, opts);
    if (!fetchResponse.ok) {
        throw new Error(`${fetchResponse.status} - ${fetchResponse.statusText} - ${fetchResponse.url}`);
    }
    return fetchResponse.json();
}

/**
 * @param {{ eleventy: { serverless: { query: { postid?: string}}}}} itemData
 * @param {WordpressSettings} wordpressSettings
 * @returns {Promise<WordpressPostRow>}
 * @example
 * async render(itemData) {
 *   const jsonData = await getPostJsonFromWordpress(itemData,wordPressSettings);
 *   return jsonData.content.rendered;
 * }
 */
const getPostJsonFromWordpress = async (itemData, wordpressSettings) => {
    if (itemData.eleventy.serverless.query.postid) {
        const wpApiPage = `${wordpressSettings.wordPressSite}/wp-json/wp/v2/posts/${itemData.eleventy.serverless.query.postid}?_embed&cachebust=${Math.random()}`;

        return fetchJson(wpApiPage);
    } else {
        const wpApiPage = `${wordpressSettings.wordPressSite}/wp-json/wp/v2/posts/?tags=${wordpressSettings.previewWordPressTagId}&orderby=modified&_fields=title,modified,id&cachebust=${Math.random()}`;

        return fetchJson(wpApiPage)
            .then((/** @type {{id:number,title:{rendered:string},modified:string}[]} */ previewPosts) => {
                const links = previewPosts.map(x => `<li><a href="?postid=${x.id}">${x.title.rendered}</a> - ${x.modified}</li>`);

                let digestReturn = { ...digestPageJSON };
                digestReturn.content.rendered = `<ul>${links.join()}</ul>`;
                return digestReturn
            });
    }
}

/**
 * Puts the correct permalink in the data section
 * @example async data() {
 *        return {
 *           layout: "page",
 *           tags: ["news"],
 *           ...addPreviewModeDataElements()
 *       };
 *   }
 */
 const addPreviewModeDataElements = () => (
    {
        permalink: {
            [serverlessFunctionName]: pagePath
        }
    }
);

module.exports = {
    serverlessHandler,
    getPostJsonFromWordpress,
    addPreviewModeToEleventy,
    addPreviewModeDataElements
}
