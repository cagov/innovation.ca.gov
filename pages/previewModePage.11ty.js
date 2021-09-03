//@ts-check
const { addPreviewModeDataElements } = require("../previewModeModule/addPreviewModeDataElements"); //require("wordpress-11ty-azure-faas-preview-mode/addPreviewModeDataElements");
const { getPostJsonFromWordpress } = require("../previewModeModule/getPostJsonFromWordpress");//require("wordpress-11ty-azure-faas-preview-mode/getPostJsonFromWordpress");

const wordPressSettings = {
    wordPressSite: "https://live-odi-content-api.pantheonsite.io",
    previewWordPressTagId: 20 //preview-mode
}

class previewModePageClass {
    async data() {
        return {
            layout: "page",
            tags: ["news"],
            ...addPreviewModeDataElements()
        };
    }

    /**
     * @param {{ title: string; publishdate: string; meta: string; description: string; lead: string; author: string; previewimage: string; }} itemData
     */
    async render(itemData) {
        const jsonData = await getPostJsonFromWordpress(itemData,wordPressSettings);

        let featuredMedia = jsonData._embedded["wp:featuredmedia"];

        itemData.title = jsonData.title.rendered;
        itemData.publishdate = jsonData.date.split('T')[0]; //new Date(jsonData.modified_gmt)
        itemData.meta = jsonData.excerpt.rendered;
        itemData.description = jsonData.excerpt.rendered;
        itemData.lead = jsonData.excerpt.rendered;
        itemData.author = jsonData._embedded.author[0].name;
        itemData.previewimage =  featuredMedia ? featuredMedia[0].source_url : "img/thumb/APIs-Blog-Postman-Screenshot-1.jpg";

        return jsonData.content.rendered;
    }
}

module.exports = previewModePageClass;