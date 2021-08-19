class previewModePageClass {
    // or `async data() {`
    // or `get data() {`
    data() {
        return {
            layout: "page",
            title: "DYNAMIC Why Alpha.CA.gov is prioritizing APIs",
            meta: "How Alpha.CA.gov is making data more accessible and useful",
            previewimage: "img/thumb/APIs-Blog-Postman-Screenshot-1.jpg",
            lead: "Making data more accessible and useful",
            author: "JP Petrucione",
            publishdate: "2020-02-21",
            tags: ["news"],
            permalink: {
                possum: "/previewModePage"
            }
        };
    }

    render(myData) {
        return `<p>DYNAMIC version of ${myData.title}</p>`;
    }
}
module.exports = previewModePageClass;