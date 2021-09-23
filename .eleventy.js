//@ts-check
const moment = require('moment-timezone');
// const pluginRss = require("@11ty/eleventy-plugin-rss");
const { addPreviewModeToEleventy, getPostJsonFromWordpress } = require("@cagov/11ty-serverless-preview-mode");
const wordPressSettings = {
  wordPressSite: "https://live-odi-content-api.pantheonsite.io", //Wordpress endpoint
  previewWordPressTagSlug: 'preview-mode' // optional filter for digest list of preview in Wordpress
}

/**
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig 
 * @param {(item:*,jsonData:import('@cagov/11ty-serverless-preview-mode').WordpressPostRow) => void} settingFunction
 */
const addPreviewModeToEleventy2 = (eleventyConfig, settingFunction) => {
  addPreviewModeToEleventy(eleventyConfig);
  eleventyConfig.addCollection("myserverless", async function (collection) {
    //Using the addCollection to just be able to exec a loop on eleventy data.  Not actually returning a collection.
    for (const item of collection.items) {
      const itemData = item.data;
      if (!item.outputPath && itemData.eleventy?.serverless) {
        const jsonData = await getPostJsonFromWordpress(itemData, wordPressSettings);

        settingFunction(item, jsonData);

      }
    }

    return [];
  });
}

/**
* @typedef {Object} EleventyTemplate Common eleventy template 
* @property {{ content: string; }} frontMatter
*/

/**
* @typedef {Object} EleventyTemplateItem Common eleventy template item
* @property {*} data
* @property {Date} date
* @property {string} filePathStem ex. '/previewModePage'
* @property {string} fileSlug ex. 'previewModePage'
* @property {string} inputPath ex. './pages/previewModePage'
* @property {boolean | string} outputPath
* @property {EleventyTemplate} template
* @property {string} url
*/


/**
 * 
 * @param {EleventyTemplateItem} item 
 * @param {import('@cagov/11ty-serverless-preview-mode').WordpressPostRow} jsonData
 */
const itemSetterCallback = async function (item, jsonData) {
  let featuredMedia = jsonData._embedded["wp:featuredmedia"];

  //Customize for your templates
  item.data.layout = 'page.njk';
  item.data.tags = ['news'];
  item.data.addtositemap = false;
  item.data.title = jsonData.title.rendered;
  item.data.publishdate = jsonData.date.split('T')[0]; //new Date(jsonData.modified_gmt)
  item.data.meta = jsonData.excerpt.rendered;
  item.data.description = jsonData.excerpt.rendered;
  item.data.lead = jsonData.excerpt.rendered;
  item.data.author = jsonData._embedded.author[0].name;
  item.data.previewimage = featuredMedia ? featuredMedia[0].source_url : "img/thumb/APIs-Blog-Postman-Screenshot-1.jpg";

  item.template.frontMatter.content += jsonData.content.rendered;
}

//Replaces content to rendered
const replaceContent = (item, searchValue, replaceValue) => {
  item.template.frontMatter.content = item.template.frontMatter.content
    .replace(searchValue, replaceValue);
}
/**
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig 
 */
module.exports = function (eleventyConfig) {
  addPreviewModeToEleventy2(eleventyConfig, itemSetterCallback);

  const wordpressImagePath = 'img/wordpress';

  eleventyConfig.addPassthroughCopy({ "wordpress/media": wordpressImagePath });

  eleventyConfig.addFilter("dateformat", function (dateIn) {
    return moment(dateIn).tz('America/Los_Angeles').format('M/D/YYYY');
  });

  //Process wordpress posts
  eleventyConfig.addCollection("wordpressposts", function (collection) {
    const FolderName = 'wordpress-posts';
    let output = [];

    collection.getAll().forEach(item => {
      if (item.inputPath.includes(FolderName)) {
        item.outputPath = item.outputPath.replace(`/${FolderName}`, '');;
        item.url = item.url.replace(`/${FolderName}`, '');
        item.data.page.url = item.url;

        //content pulled in from JSON
        const jsonData = item.data.data;
        item.data.layout = "page";
        item.data.tags = ['news'];
        item.data.title = jsonData.title;
        item.data.publishdate = jsonData.date.split('T')[0]; //new Date(jsonData.modified_gmt)
        item.data.meta = jsonData.excerpt;
        item.data.description = jsonData.excerpt;
        item.data.lead = jsonData.excerpt;
        item.data.author = jsonData.author;

        if (jsonData.media) {
          const featuredMedia = jsonData.media.find(x => x.featured);
          if (featuredMedia) {
            item.data.previewimage = wordpressImagePath + '/' + featuredMedia.path;
          }

          jsonData.media.filter(x => x.source_url_match).forEach(m => {
            replaceContent(item, new RegExp(m.source_url, 'g'), '/' + wordpressImagePath + '/' + m.path);
          });
        }
      };
    });

    return output;
  });

  eleventyConfig.addCollection("mySort", function (collection) {
    let posts = [];
    collection.getAll().forEach((item) => {
      if (item.data.tags && item.data.tags[0] == 'news') {
        posts.push(item);
      }
    })
    return posts.sort(function (a, b) {
      // @ts-ignore
      return new Date(a.data.publishdate) - new Date(b.data.publishdate);
    }).reverse();
  });
  // eleventyConfig.addPlugin(pluginRss);

  return {
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "md",
    templateFormats: ["html", "njk", "11ty.js", "md"],
    dir: {
      input: "pages",
      output: "_site",
    }
  };
}