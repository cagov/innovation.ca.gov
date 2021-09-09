# eleventy serverless Preview Mode for Azure FaaS


## Features
- Single page 11ty rendering of content retrieved from your data source (Wordpress API, GitHub?)

## Setup
- reference the module (NPM coming soon)

## Project Components
- 

## Installation considerations
* need to include newer version of 11ty in package.json `"@11ty/eleventy": "^1.0.0-canary.41"`

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
Add this to your 11ty `pages` folder to support dynamic rendering
```
//@ts-check
const { addPreviewModeDataElements, getPostJsonFromWordpress } = require("../previewModeModule"); //require("wordpress-11ty-azure-faas-preview-mode");

const wordPressSettings = {
    wordPressSite: "https://live-odi-content-api.pantheonsite.io",
    previewWordPressTagId: 20 //preview-mode
}

class previewModePageClass {
    /**
     * First, mostly static.  Returns the frontmatter data.
     */
    async data() {
        return {
            layout: "page",
            tags: ["news"],
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
  const path = require('path'); //Path Resolve needed to make plugin mode copy work
  const { addPreviewModeToEleventy } = require( path.resolve('.','./previewModeModule') );
  // const { addPreviewModeToEleventy } = require('@cagov/11ty-serverless-preview-mode');
  addPreviewModeToEleventy(eleventyConfig);
```