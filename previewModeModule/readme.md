# eleventy serverless Preview Mode for Azure FaaS


## Features
* Single page 11ty rendering of content retrieved from your data source (Wordpress API, GitHub?)

## Setup
* reference the module (NPM coming soon)
*

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
    * `previewModePage.11ty.js` is still in the project, would like to mode it to module folder.
    * custom `.eleventy.js` config needs to be referenced