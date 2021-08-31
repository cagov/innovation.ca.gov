
const constants = require("./constants.json");

/**
 * Puts the correct permalink in the data section
 * @example async data() {
 *        return {
 *           layout: "page",
 *           tags: ["news"],
 *           ...addPreviewModeDataElements()
 *       };
 *   }
 */
const addPreviewModeDataElements = () => (
    {
        permalink: {
            [constants.config.serverlessFunctionName]: constants.config.pagePath
        }
    }
);

module.exports = { addPreviewModeDataElements }