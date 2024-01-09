const cagovBuildSystem = require("@cagov/11ty-build-system");
const linkedom = require("linkedom");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const fs = require('fs');

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

  eleventyConfig.addTransform("modify-html", function (content) {
    if (this.page.outputPath.endsWith(".html")) {
      // Remove WP auto-lazy images for the homepage banner.
      if (content.includes("<img loading=\"lazy\" class=\"cagov-featured-image\"")) {
        content = content.replace(
          "<img loading=\"lazy\" class=\"cagov-featured-image\"",
          "<img class=\"cagov-featured-image\"" 
        );
      }
      // Replace Wordpress media paths with correct 11ty output path.
      const regexPattern = `http.+?pantheonsite\.io/wp-content/uploads/`;
      content = content.replace(new RegExp(regexPattern, 'g'), `/${wordpressImagePath}/`);
    }

    return content;
  });

  eleventyConfig.addCollection("dateSort", function (collections) {
    return collections.getFilteredByTag("news")
      .sort(function (a, b) {
        return new Date(a.data.publishdate) - new Date(b.data.publishdate);
      })
      .reverse();
  });

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter("dateformat", function (dateString) {
    const d = new Date(dateString);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  });

  eleventyConfig.addFilter('includes', (items, value) => {
    return (items || []).includes(value);
  });

  eleventyConfig.addFilter("repairMetaImage", (url) => {
    return url.replace("https://live-digital-ca-gov.pantheonsite.io/wp-content/uploads/", "https://innovation.ca.gov/img/wordpress/");
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

  eleventyConfig.on("eleventy.after", async ({ results }) => {
    // Generate map of all HTML files for tests.
    const files = results.map((r) => {
      const { content, ...paths } = r;
      return paths;
    });

    const htmlFiles = files.filter((p) => p?.outputPath?.endsWith(".html"));
    const htmlFileJson = JSON.stringify(htmlFiles, null, 2);

    fs.writeFileSync("./_site_dist/allFiles.json", htmlFileJson, "utf8");
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
