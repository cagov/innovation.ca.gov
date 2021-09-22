const moment = require('moment-timezone');
// const pluginRss = require("@11ty/eleventy-plugin-rss");
const { addPreviewModeToEleventy, getPostJsonFromWordpress } = require("@cagov/11ty-serverless-preview-mode");
const wordPressSettings = {
  wordPressSite: "https://live-odi-content-api.pantheonsite.io", //Wordpress endpoint
  previewWordPressTagSlug: 'preview-mode' // optional filter for digest list of preview in Wordpress
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
  eleventyConfig.addGlobalData("foo", {p1:"preview-mode-auto-generated",p2:"/GeneratePreviewModePath"});
  eleventyConfig.addGlobalData("foo2", {["preview-mode-auto-generated"]:"/GeneratePreviewModePath"});


  addPreviewModeToEleventy(eleventyConfig);

  eleventyConfig.addCollection("myserverless", async function (collection) {
    const output = [];

    for (const item of collection.items) {
      const itemData = item.data;
      if (!item.outputPath && itemData.eleventy?.serverless) {
        const jsonData = await getPostJsonFromWordpress(itemData, wordPressSettings);

        let featuredMedia = jsonData._embedded["wp:featuredmedia"];

        //Customize for your templates
        itemData.layout = 'page.njk';
        itemData.tags = ['news'];
        itemData.addtositemap = false;
        itemData.title = jsonData.title.rendered;
        itemData.publishdate = jsonData.date.split('T')[0]; //new Date(jsonData.modified_gmt)
        itemData.meta = jsonData.excerpt.rendered;
        itemData.description = jsonData.excerpt.rendered;
        itemData.lead = jsonData.excerpt.rendered;
        itemData.author = jsonData._embedded.author[0].name;
        itemData.previewimage = featuredMedia ? featuredMedia[0].source_url : "img/thumb/APIs-Blog-Postman-Screenshot-1.jpg";

        item.template.frontMatter.content = jsonData.content.rendered;

        output.push(item);

      }
    }

    return output;
  });

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