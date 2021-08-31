//@ts-check
const fetch = require('node-fetch/lib');
const reuse = require("./reuse.json");
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

/** @type WordpressPostRow */
const digestPageJSON = require('./digestPageJson.json');

/**
 * 
 * @returns {Promise<WordpressPostRow>}
 */
const getPostJsonFromWordpress = async (/** @type {{ eleventy: { serverless: { query: { postid: any; }; }; }; }} */ itemData) => {
    if (itemData.eleventy.serverless.query.postid) {
        let wpApiPage = reuse.config.wordPressSite + `/wp-json/wp/v2/posts/${itemData.eleventy.serverless.query.postid}?_embed&cachebust=${Math.random()}`;

        return (await fetch(wpApiPage)
            .then(result => result.json()));
    } else {
        let digestReturn = {...digestPageJSON};
        const postIds = await getPreviewPostIds();

        const links = postIds.map(x => `<li><a href="?postid=${x.id}">${x.title.rendered}</a> - ${x.modified}</li>`);

        digestReturn.content.rendered = `<ul>${links.join()}</ul>`;
        return digestReturn;
    }
}

const getPreviewPostIds = async () => {
    const wpApiPage = reuse.config.wordPressSite + `/wp-json/wp/v2/posts/?tags=${reuse.config.previewWordPressTagId}&orderby=modified&_fields=title,modified,id&cachebust=${Math.random()}`;

    /** @type {{id:number,title:{rendered:string},modified:string}[]} */
    return (await fetch(wpApiPage)
        .then(result => result.json()));
}

module.exports = {
    getPostJsonFromWordpress
}