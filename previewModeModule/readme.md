# eleventy serverless Preview Mode for Azure FaaS

## Features
- Single page 11ty rendering of content retrieved from your data source (Wordpress API, GitHub?)

## Intent
* Using an existing 11ty project, add the ability to render a single page from Wordpress with an Azure function.
* Provide access to unpublished "preview" data
* Make a distributable module to do this

## Not obvious concepts
* resource links (.css, .png, etc) directed back at the service will redirect to the main site

## Current situtation
* Can render a single page from Wordpress
* Module still needs to be refined to be more distributable
* Update the sample below to be more generic


## Sample preview mode page template ##
Add this to your 11ty `pages` folder as `previewModePage.11ty.js` to support dynamic rendering.  
```
const { addPreviewModeDataElements, getPostJsonFromWordpress } = require("@cagov/11ty-serverless-preview-mode");

const wordPressSettings = {
    wordPressSite: "https://live-odi-content-api.pantheonsite.io", //Wordpress endpoint
    previewWordPressTagId: 20 //preview-mode tag id in Wordpress
}

class previewModePageClass {
    /**
     * First, mostly static.  Returns the frontmatter data.
     */
    async data() {
        return {
            layout: "page", //Or whatever layout the preview page should have
            tags: ["news"], //Or whatever tags the preview page should have
            ...addPreviewModeDataElements()
        };
    }

    /**
     * Last, after the frontmatter data is loaded.  Able to render the page.
     * @param {{ title: string; publishdate: string; meta: string; description: string; lead: string; author: string; previewimage: string; eleventy: { serverless: { query: { postid?: string; }; }; }; }} itemData
     */
    async render(itemData) {
        const jsonData = await getPostJsonFromWordpress(itemData, wordPressSettings);

        let featuredMedia = jsonData._embedded["wp:featuredmedia"];

        //Customize for you templates
        itemData.title = jsonData.title.rendered;
        itemData.publishdate = jsonData.date.split('T')[0]; //new Date(jsonData.modified_gmt)
        itemData.meta = jsonData.excerpt.rendered;
        itemData.description = jsonData.excerpt.rendered;
        itemData.lead = jsonData.excerpt.rendered;
        itemData.author = jsonData._embedded.author[0].name;
        itemData.previewimage = featuredMedia ? featuredMedia[0].source_url : "img/thumb/APIs-Blog-Postman-Screenshot-1.jpg";

        return jsonData.content.rendered;
    }
}

module.exports = previewModePageClass;
```

## Add this to `.eleventy.js` ##
```
  const { addPreviewModeToEleventy } = require("@cagov/11ty-serverless-preview-mode");
  addPreviewModeToEleventy(eleventyConfig);
```

## For Azure Faas ##
`index.js`
```
const { serverlessHandler } = require("@cagov/11ty-serverless-preview-mode");
const contentRedirectSiteTarget = "https://digital.ca.gov";

/**
 * Azure Function to render a single 11ty page
 * @param {{res:{statusCode:number;body:string;headers?:*};done:function}} context
 * @param {{params:{segments?:*},headers:*,query:*}} req
 */
module.exports = async function (context, req) {
  try {
    if (req.params.segments) { // Resource call, redirect back to the main site
      context.res = { statusCode: 301, headers: { location: `${contentRedirectSiteTarget}${req.headers["x-original-url"]}` }, body: null };
    } else {
      context.res = await serverlessHandler(req.query);
    }

  } catch (error) {
    context.res = {
      status: error.httpStatusCode || 500,
      body: JSON.stringify(
        {
          error: error.message,
        },
        null,
        2
      ),
    };
  }
  if (context.done) context.done();
}
```