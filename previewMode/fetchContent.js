const fetch = require('node-fetch');
const reuse = require("./reuse.json");

const getPageJsonFromWordpress = async itemData => {
    let wpApiPage = reuse.config.wordPressSite+`/wp-json/wp/v2/posts/${itemData.eleventy.serverless.query.postid}?_embed`;

    return await fetch(wpApiPage).then(result => result.json());
}

const getPreviewPostIds = async () => {
    const wpApiPage = reuse.config.wordPressSite+`/wp-json/wp/v2/posts/?tags=${reuse.config.previewWordPressTagId}&orderby=modified&_fields=title,modified,id`;
    /** @type {{id:number,title:{rendered:string},modified:string}[]} */
    const result = await fetch(wpApiPage).then(result => result.json())

    return result;
}

module.exports = {
    getPageJsonFromWordpress,
    getPreviewPostIds
}