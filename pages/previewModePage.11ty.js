// @ts-check
const fetch = require('sync-fetch');

class previewModePageClass {
    // or `async data() {`
    // or `get data() {`
    data() {
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
                possum: "/previewModePage"
            }
        };
    }

    render(myData) {
        let wpApiPage = 'https://as-go-covid19-d-001.azurewebsites.net/wp-json/wp/v2/posts/13211?_embed=author,wp:term';
        if (myData.eleventy.serverless.query && myData.eleventy.serverless.query.link) {
            wpApiPage = myData.eleventy.serverless.query.link;
        }

        const response = fetch(wpApiPage);
        const jsonData = response.json();

        MapWpToData(myData,jsonData)
        return jsonData.content.rendered;
    }
}

const MapWpToData = (itemData,jsonData) => {
    //content pulled in from JSON
    itemData.title = jsonData.title.rendered;
    itemData.publishdate = jsonData.date.split('T')[0]; //new Date(jsonData.modified_gmt)
    itemData.meta = jsonData.excerpt.rendered;
    itemData.description = jsonData.excerpt.rendered;
    itemData.lead = jsonData.excerpt.rendered;
    itemData.author = jsonData._embedded.author[0].name;
};

module.exports = previewModePageClass;