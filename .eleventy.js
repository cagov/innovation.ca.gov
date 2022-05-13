//@ts-check
const moment = require('moment-timezone');
const cagovBuildSystem = require("@cagov/11ty-build-system");
const { addPreviewModeToEleventy } = require("@cagov/11ty-serverless-preview-mode");

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
 * @type {import('@cagov/11ty-serverless-preview-mode').WordpressSettingCallback}
 */
const itemSetterCallback = (item, jsonData) => {
  let featuredMedia = jsonData._embedded["wp:featuredmedia"];

  //Customize for your templates
  item.data.layout = 'page.njk';
  item.data.tags = ['news'];
  item.data.addtositemap = false;
  item.data.title = jsonData.title.rendered;
  item.data.publishdate = jsonData.date.split('T')[0]; //new Date(jsonData.modified_gmt)
  item.data.meta = jsonData.excerpt.rendered;
  item.data.description = jsonData.excerpt.rendered;
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
  addPreviewModeToEleventy(eleventyConfig, itemSetterCallback);
  eleventyConfig.htmlTemplateEngine = "njk";
  const wordpressImagePath = "img/wordpress";

  eleventyConfig.addPlugin(cagovBuildSystem, {
    processors: {
      sass: {
        watch: ["src/css/**/*"],
        output: "_site_dist/index.css",
        minify: true,
        options: {
          file: "src/css/index.scss",
          includePaths: ["./src/css/sass"],
        },
      },
      esbuild: [
        {
          watch: ["src/js/**/*"],
          options: {
            entryPoints: ["src/js/index.js"],
            bundle: true,
            minify: true,
            outfile: "_site_dist/built.js",
          },
        },
      ],
    },
  });

  eleventyConfig.addPassthroughCopy({ "wordpress/media": wordpressImagePath });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/pdf": "pdf" });
  eleventyConfig.addPassthroughCopy({ "src/css/fonts": "fonts" });

  // eleventyConfig.addFilter("dateformat", function (dateString) {
  //   let d = new Date(dateString);
  //   return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  // });
  eleventyConfig.addFilter("dateformat", function (dateIn) {
    return moment(dateIn).tz('America/Los_Angeles').format('M/D/YYYY');

  //Process wordpress posts
  eleventyConfig.addCollection("wordpressposts", function (collection) {
    const FolderNamePosts = "wordpress-posts";
    const FolderNamePages = "wordpress-pages";
    let output = [];

    collection.getAll().forEach((item) => {
      item.data.domain = 'digital.ca.gov';
      if (item.inputPath.includes(FolderNamePosts)) {
        item.outputPath = item.outputPath.replace(`/${FolderNamePosts}`, "");
        item.url = item.url.replace(`/${FolderNamePosts}`, "");
        item.data.page.url = item.url;

        //content pulled in from JSON
        const jsonData = item.data.data;
        item.data.layout = "post";
        item.data.tags = ["news"];
        item.data.title = jsonData.title;
        item.data.publishdate = jsonData.date.split("T")[0];
        item.data.meta = jsonData.excerpt;
        item.data.description = jsonData.excerpt;
        item.data.author = jsonData.author;

        if (jsonData.media) {
          const featuredMedia = jsonData.media.find((x) => x.featured);
          if (featuredMedia) {
            item.data.previewimage =
              wordpressImagePath + "/" + featuredMedia.path;
          }

          jsonData.media
            .filter((x) => x.source_url_match)
            .forEach((m) => {
              replaceContent(
                item,
                new RegExp(m.source_url, "g"),
                "/" + wordpressImagePath + "/" + m.path
              );
            });
        }
      }

      if (item.inputPath.includes(FolderNamePages)) {
        //content pulled in from JSON
        const jsonData = item.data.data;
        item.outputPath = `_site/${cleanUrl(jsonData.wordpress_url)}index.html`;

        item.url = `/${cleanUrl(jsonData.wordpress_url)}`;
        item.data.page.url = item.url;
        item.data.layout = jsonData.template;
        item.data.parentid = jsonData.parent;
        if (!item.data.layout) {
          item.data.layout = "content";
        }
        if(item.url.indexOf('our-work') > -1) {
          item.data.layout = 'single-column-conditional';
        }
        item.data.title = jsonData.title;
        item.data.publishdate = jsonData.date.split("T")[0]; //new Date(jsonData.modified_gmt)
        item.data.meta = jsonData.excerpt;
        item.data.description = jsonData.excerpt;

        // WordPress will lazy load everything and you have to put php code in your theme to override it. We don't want to lazy load our featuref image
        item.template.frontMatter.content = item.template.frontMatter.content.replace('loading="lazy" class="cagov-featured-image','class="cagov-featured-image');

        if (jsonData.media) {
          const featuredMedia = jsonData.media.find((x) => x.featured);
          if (featuredMedia) {
            item.data.previewimage =
              wordpressImagePath + "/" + featuredMedia.path;
          }

          jsonData.media
            .filter((x) => x.source_url_match)
            .forEach((m) => {
              replaceContent(
                item,
                new RegExp(m.source_url, "g"),
                "/" + wordpressImagePath + "/" + m.path
              );
            });
        }
      }

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

  eleventyConfig.addFilter("changeDomain", function (url, domain) {
    try {
      let host = config.build.canonical_url.split("//"); // TEMP Cheat to get https
      let changedUrl = url;
      // There are multiple strings that we may need to replace because of how we merge and work with data. Use them.
      config.build.replace_urls.map((item) => {
        changedUrl = changedUrl.replace(item, host[0] + "//" + domain);
      });
      changedUrl = changedUrl.replace('test-digital-ca-gov.pantheonsite.io', host[0] + "//" + 'development.digital.ca.gov');
      return changedUrl;
    } catch {
      return url;
    }
  });

  return {
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "md",
    templateFormats: ["html", "njk", "11ty.js", "md"],
    dir: {
      input: "pages",
      output: "_site",
    },
  };
};

function cleanUrl(url) {
  if (url) {
    if (url.indexOf(".pantheonsite.io/") > -1) {
      return url.split(".pantheonsite.io/")[1];
    }
  }
  return url;
}
