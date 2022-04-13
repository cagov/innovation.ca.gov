const cagovBuildSystem = require("@cagov/11ty-build-system");
// const pluginRss = require("@11ty/eleventy-plugin-rss");

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
  eleventyConfig.addPassthroughCopy({ "src/css/fonts": "fonts" });

  eleventyConfig.addFilter("dateformat", function (dateString) {
    let d = new Date(dateString);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  });

  //Process wordpress posts
  eleventyConfig.addCollection("wordpressposts", function (collection) {
    const FolderNamePosts = "wordpress-posts";
    const FolderNamePages = "wordpress-pages";
    let output = [];

    collection.getAll().forEach((item) => {
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
        if (!item.data.layout) {
          item.data.layout = "content";
        }
        item.data.title = jsonData.title;
        item.data.publishdate = jsonData.date.split("T")[0]; //new Date(jsonData.modified_gmt)
        item.data.meta = jsonData.excerpt;
        item.data.description = jsonData.excerpt;

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
  // eleventyConfig.addPlugin(pluginRss);

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
