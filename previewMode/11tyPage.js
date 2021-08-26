const fetch = require('node-fetch');
const reuse = require("./reuse.json");

class previewModePageClass {
    async data() {
        return {
            layout: "page",
            tags: ["news"],
            //title: "DYNAMIC Why Alpha.CA.gov is prioritizing APIs",
            //meta: "How Alpha.CA.gov is making data more accessible and useful",
            previewimage: "img/thumb/APIs-Blog-Postman-Screenshot-1.jpg",
            //lead: "Making data more accessible and useful",
            //author: "JP Petrucione",
            //publishdate: "2020-02-21",
            permalink: {
                [reuse.config.serverlessFunctionName]: reuse.config.pagePath
            }
        };
    }

    async render(itemData) {
        //let wpApiPage = 'https://as-go-covid19-d-001.azurewebsites.net/wp-json/wp/v2/posts/13211?_embed=author,wp:term';
        let wpApiPage = reuse.config.wordPressSite+'/wp-json/wp/v2/posts/59?_embed';
        if (itemData.eleventy.serverless.query && itemData.eleventy.serverless.query.link) {
            wpApiPage = itemData.eleventy.serverless.query.link;
        }

        const jsonData = await fetch(wpApiPage).then(result => result.json());

        //content pulled in from JSON
        itemData.title = jsonData.title.rendered;
        itemData.publishdate = jsonData.date.split('T')[0]; //new Date(jsonData.modified_gmt)
        itemData.meta = jsonData.excerpt.rendered;
        itemData.description = jsonData.excerpt.rendered;
        itemData.lead = jsonData.excerpt.rendered;
        itemData.author = jsonData._embedded.author[0].name;

        let featuredMedia = jsonData._embedded['wp:featuredmedia'];
        if (featuredMedia) {
            itemData.previewimage = featuredMedia[0].source_url;
        }
        return jsonData.content.rendered;
    }
}

module.exports = previewModePageClass;