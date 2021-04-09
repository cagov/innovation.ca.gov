module.exports = function(eleventyConfig) {
  eleventyConfig.htmlTemplateEngine = "njk";
  return {
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk", "11ty.js"],
    dir: {
      input: "pages",
      output: "docs",
    }
  };
}