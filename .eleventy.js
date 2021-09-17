const moment = require('moment-timezone');
// const pluginRss = require("@11ty/eleventy-plugin-rss");

//Replaces content to rendered
const replaceContent = (item,searchValue,replaceValue) => {
  item.template.frontMatter.content = item.template.frontMatter.content
    .replace(searchValue,replaceValue);
}
/**
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig 
 */
module.exports = function(eleventyConfig) {
  eleventyConfig.htmlTemplateEngine = "njk";
  const wordpressImagePath = 'img/wordpress';

  eleventyConfig.addPassthroughCopy({ "wordpress/media":wordpressImagePath });

  eleventyConfig.addFilter("dateformat", function(dateIn) {
    return moment(dateIn).tz('America/Los_Angeles').format('M/D/YYYY');
  });

  //Process wordpress posts
  eleventyConfig.addCollection("wordpressposts", function(collection) {
    const FolderName = 'wordpress-posts';
    let output = [];
    
    collection.getAll().forEach(item => {
        if(item.inputPath.includes(FolderName)) {
          item.outputPath = item.outputPath.replace(`/${FolderName}`,'');;
          item.url = item.url.replace(`/${FolderName}`,'');
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

          if(jsonData.media) {
            const featuredMedia = jsonData.media.find(x=>x.featured);
            if(featuredMedia) {
              item.data.previewimage = wordpressImagePath+'/'+featuredMedia.path;
            }

            jsonData.media.filter(x=>x.source_url_match).forEach(m=>{
              replaceContent(item,new RegExp(m.source_url,'g'),'/'+wordpressImagePath+'/'+m.path);
            });
          }
        };
    });

    return output;
  });



  eleventyConfig.addCollection("mySort", function(collection) {
    let posts = [];
    collection.getAll().forEach( (item) => {
      if(item.data.tags && item.data.tags[0] == 'news') {
        posts.push(item);
      }
    })
    return posts.sort(function(a, b) {
      return new Date(a.data.publishdate) - new Date(b.data.publishdate);
    }).reverse();
  });
  // eleventyConfig.addPlugin(pluginRss);

  const { addPreviewModeToEleventy } = require("@cagov/11ty-serverless-preview-mode");
  addPreviewModeToEleventy(eleventyConfig);

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