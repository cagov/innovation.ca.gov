const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
const constants = require("./constants.json");

/**
 * Adds EleventyServerless with simple config for single page rendering
 * @param {*} eleventyConfig 
 * @example
 * module.exports = function(eleventyConfig) {
 *   const path = require('path'); //Path Resolve needed to make plugin mode copy work
 *   const { addPreviewModeToEleventy } = require( path.resolve('.','./previewModeModule/addPreviewModeToEleventy') );
 *   addPreviewModeToEleventy(eleventyConfig);
 * }
 */
const addPreviewModeToEleventy = eleventyConfig => {
    eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
        name: constants.config.serverlessFunctionName, // The serverless function name from your permalink object
        inputDir: "",
        functionsDir: "", //off the root
        redirects: "", //no redirect handling built in
        copyOptions: {
            filter:['**/*','!**']} // Filtering out all pages, this still brings in includes
      });
}

module.exports = { addPreviewModeToEleventy }