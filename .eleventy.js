// const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  eleventyConfig.htmlTemplateEngine = "njk";

  eleventyConfig.addPassthroughCopy({ "wordpress/media": "img/wordpress" });

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
        } else {
          //console.log(item.data)
          //console.log(item);

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