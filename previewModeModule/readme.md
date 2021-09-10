# Eleventy serverless Preview Mode for Wordpress API

If you have content in Wordpress for your eleventy site, you can create a FaaS (ex. Azure) function that will render content for preview right out of Wordpress.

## Features
- Single page 11ty rendering of content retrieved from your Wordpress API data source.
- Digest page for all pages that match a specific Wordpress tag ID.
- Easy Azure FaaS integration

## Sample preview mode page template ##
You will need to have a single page in your 11ty input templates to customize how your pages are rendered.

Add this to your 11ty input folder (ex. `pages`) with the `.11ty.js` extention (ex. `previewModePage.11ty.js`).  
```
//@ts-check
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

## Add this to your existing `.eleventy.js` ##
```
module.exports = function(eleventyConfig) {
//...
  const { addPreviewModeToEleventy } = require("@cagov/11ty-serverless-preview-mode");
  addPreviewModeToEleventy(eleventyConfig);
//...
  
```

## For Azure FaaS ##

Using Azure FaaS, the service can render a single page from remote content, while redirecting all other resource requests (.css, .png, etc) back to the real web server.  To detect a resource request, this implementation uses a route filter for `segments`.

### `index.js` ###
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
### `function.json` ###
```
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get"
      ],
      "route": "{*segments}"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```
