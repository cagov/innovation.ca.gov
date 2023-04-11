const cagovBuildSystem = require("@cagov/11ty-build-system");
const linkedom = require("linkedom");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const fs = require('fs');

//Replaces content to rendered
const replaceContent = (item, searchValue, replaceValue) => {
  item.template.frontMatter.content = item.template.frontMatter.content.replace(
    searchValue,
    replaceValue
  );
};

module.exports = function (eleventyConfig) {
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
  eleventyConfig.addPassthroughCopy({ "wordpress/media/2022/05": "wp-content/uploads/2022/05" });
  eleventyConfig.addPassthroughCopy({ "wordpress/media/2022/06": "wp-content/uploads/2022/06" });
  eleventyConfig.addPassthroughCopy({ "wordpress/media/2022/07": "wp-content/uploads/2022/07" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/pdf": "pdf" });
  eleventyConfig.addPassthroughCopy({ "src/css/fonts": "fonts" });

  eleventyConfig.addFilter("dateformat", function (dateString) {
    let d = new Date(dateString);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  });

  let fileList = [];

  //Process wordpress posts
  eleventyConfig.addCollection("wordpressposts", function (collection) {
    const FolderNamePosts = "wordpress-posts";
    const FolderNamePages = "wordpress-pages";
    let output = [];

    collection.getAll().forEach((item) => {
      item.data.domain = 'innovation.ca.gov';
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
        if(jsonData.tags.indexOf('layout-no-sidebar') > -1) {
          item.data.layout = 'single-column';
        }
        if(item.data.page.url == "/") {
          item.data.layout = "landing";
        }
        item.data.title = jsonData.title;
        item.data.publishdate = jsonData.date.split("T")[0]; //new Date(jsonData.modified_gmt)
        item.data.meta = jsonData.excerpt;
        item.data.description = jsonData.excerpt;
        item.data.tags = jsonData.tags;

        // WordPress will lazy load everything and you have to put php code in your theme to override it. We don't want to lazy load our featuref image
        item.template.frontMatter.content = item.template.frontMatter.content.replace('loading="lazy" class="cagov-featured-image','class="cagov-featured-image');

        let html = item.template.frontMatter.content;
        // Temporary rewrite of feature card h2 tag to h1. This is fixed in newer version of Gutenberg blocks plugin still under review so can be deleted when this no longer comes through as h2 causing a11y test failures
        if (html.indexOf('cagov-featured-sidebar') > -1) {
          const {
            window, document, customElements,
            HTMLElement,
            Event, CustomEvent
          } = linkedom.parseHTML(html);
          let targetHeader = document.querySelector('.cagov-featured-sidebar h2');
          if(targetHeader) {
            const newHeader = document.createElement('h1')
            newHeader.innerHTML = targetHeader.innerHTML;
            targetHeader.replaceWith(newHeader);
            html = document.toString();
            item.template.frontMatter.content = html;
          }
        }

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

      let newFile = {};
      newFile.outputPath =  item.outputPath;
      newFile.inputPath =  item.inputPath;
      fileList.push(newFile);

    });

    fs.writeFileSync('./_site_dist/allFiles.json',JSON.stringify(fileList),'utf8');

    return output;
  });

  eleventyConfig.addCollection("mySort", function (collection) {
    let posts = [];
    collection.getAll().forEach((item) => {
      if (item.data.tags && item.data.tags[0] == "news") {
        posts.push(item);
      }
    });
    return posts
      .sort(function (a, b) {
        return new Date(a.data.publishdate) - new Date(b.data.publishdate);
      })
      .reverse();
  });

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter('includes', (items, value) => {
    return (items || []).includes(value);
  });
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
