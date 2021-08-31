//@ts-check
const reuse = require("./reuse.json");
const { getPostJsonFromWordpress } = require("./fetchContent");

class previewModePageClass {
    async data() {
        return {
            layout: "page",
            tags: ["news"],
            previewimage: "img/thumb/APIs-Blog-Postman-Screenshot-1.jpg",
            permalink: {
                [reuse.config.serverlessFunctionName]: reuse.config.pagePath
            }
        };
    }

    async render(itemData) {
        const jsonData = await getPostJsonFromWordpress(itemData);

        itemData.title = jsonData.title.rendered;
        itemData.publishdate = jsonData.date.split('T')[0]; //new Date(jsonData.modified_gmt)
        itemData.meta = jsonData.excerpt.rendered;
        itemData.description = jsonData.excerpt.rendered;
        itemData.lead = jsonData.excerpt.rendered;
        itemData.author = jsonData._embedded.author[0].name;

        let featuredMedia = jsonData._embedded["wp:featuredmedia"];
        if (featuredMedia) {
            itemData.previewimage = featuredMedia[0].source_url;
        }
        return jsonData.content.rendered;
    }
}

module.exports = previewModePageClass;