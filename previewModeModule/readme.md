# eleventy/Wordpress Preview Mode for Azure FaaS
## Intent
* Using an existing 11ty project, add the ability to render a single page from Wordpress with an Azure function.
* Provide access to unpublished "preview" data
* Make a distributable module to do this

## Current situtation
* Can render a single page from Wordpress
* Module still needs to be refined to be more distributable
    * `previewModePage.11ty.js` is still in the project, would like to mode it to module folder.
    * custom `.eleventy.js` config needs to be referenced