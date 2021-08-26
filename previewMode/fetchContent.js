const fetch = require('node-fetch');
const reuse = require("./reuse.json");

const getPageJsonFromWordpress = async itemData => {
    //let wpApiPage = 'https://as-go-covid19-d-001.azurewebsites.net/wp-json/wp/v2/posts/13211?_embed=author,wp:term';
    let wpApiPage = reuse.config.wordPressSite+'/wp-json/wp/v2/posts/59?_embed';
    if (itemData.eleventy.serverless.query && itemData.eleventy.serverless.query.link) {
        wpApiPage = itemData.eleventy.serverless.query.link;
    }

    return await fetch(wpApiPage).then(result => result.json());
}

module.exports = {
    getPageJsonFromWordpress
}