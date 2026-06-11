import esbuild from 'esbuild';
import { transform as lcssTransform } from 'lightningcss';
import * as sass from 'sass';
import chalk from 'chalk';
import fs from 'node:fs';
import pluginRss from '@11ty/eleventy-plugin-rss';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';

/**
 * Log an output from a build process in the 11ty style.
 * @param {string} srcPath The source of the build process.
 * @param {string} distPath The output of the build process.
 * @param {string} assetType The type of build: CSS, JS, etc.
 * @returns {void}
 */
const buildLog = (srcPath, distPath, assetType) => {
  const projectLabel = chalk.blue('[innovation.ca.gov]');
  const distLabel = `Writing ./${distPath}`;
  const srcLabel = chalk.gray(`from ./${srcPath} (${assetType})`);

  console.log(`${projectLabel} ${distLabel} ${srcLabel}`);
};

/**
 * Compile Sass, then minify with lightningcss.
 * @returns {Promise<void>}
 */
const buildCSS = async () => {
  const srcPath = 'src/css/index.scss';
  const distPath = '_site_dist/index.css';

  const compiled = sass.compile(srcPath, {
    loadPaths: ['src/css/sass'],
    quietDeps: true,
    silenceDeprecations: ['import'],
  });

  // @cagov/ds-feature-card ships an invalid declaration, `min-width: calc(30% - var(0px))`,
  // which browsers ignore but lightningcss rejects. Drop it to match browser behavior.
  const css = compiled.css.replace(/^\s*min-width: calc\(30% - var\(0px\)\);$/m, '');

  const { code } = lcssTransform({
    filename: distPath,
    code: Buffer.from(css),
    minify: true,
  });

  buildLog(srcPath, distPath, 'CSS');

  await fs.promises.mkdir('_site_dist', { recursive: true });
  await fs.promises.writeFile(distPath, code);
};

/**
 * Build and bundle JavaScript.
 * @returns {Promise<void>}
 */
const buildJS = async () => {
  const srcPath = 'src/js/index.js';
  const distPath = '_site_dist/built.js';

  buildLog(srcPath, distPath, 'JavaScript');

  await esbuild.build({
    entryPoints: [srcPath],
    bundle: true,
    minify: true,
    outfile: distPath,
  });
};

let firstBuild = true;

export default function (eleventyConfig) {
  eleventyConfig.htmlTemplateEngine = "njk";
  const wordpressImagePath = "img/wordpress";

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.on('eleventy.before', async ({ runMode }) => {
    // Only build all of the bundle files during first run, not on every change.
    if (firstBuild || runMode !== 'serve') {
      await buildCSS();
      await buildJS();
      firstBuild = false;
    }
  });

  eleventyConfig.on('eleventy.beforeWatch', async (changedFiles) => {
    // During development changes, only reload the bundles that need reloading.
    if (changedFiles.some((file) => file.includes('src/css/'))) {
      await buildCSS();
    }
    if (changedFiles.some((file) => file.includes('src/js/'))) {
      await buildJS();
    }
  });

  eleventyConfig.addWatchTarget('src/css/');
  eleventyConfig.addWatchTarget('src/js/');

  eleventyConfig.addPassthroughCopy({ "wordpress/media": wordpressImagePath });
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
      const regexPattern = `http[^"']+?pantheonsite\.io/wp-content/uploads/`;
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

  eleventyConfig.addFilter("dateformat", function (dateString) {
    const d = new Date(dateString);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  });

  eleventyConfig.addFilter("dateyear", function (dateString) {
    const d = new Date(dateString);
    return d.getFullYear();
  });

  eleventyConfig.addFilter("fixEntities", function (str) {
    // convert specific entities which wordpress is providing incorrectly to specific UTF-8 chars
    const map = {
      "&#2d;": "-",
      "&#x2d;": "-",
      "'s": "’s",
      "'t": "’t",
      "'n": "’n",
      "&#x27;": "’",
      "&#8217;": "’",
      "&#33;": "!",
      "&#63;": "?",
      "&#44;": ",",
      "&#35;": "#",
      "&#36;": "$",
      "&#38;": "&",
      "&#40;": "(",
      "&#41;": ")",
    };
    for (const key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        str = str.replace(new RegExp(key, 'g'), map[key]);
      }
    }
    return str;
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
      // Eleventy 3 also includes the template source as `rawInput`; drop it along with `content`.
      const { content, rawInput, ...paths } = r;
      return paths;
    });

    const htmlFiles = files.filter((p) => p?.outputPath?.endsWith(".html"))
          .filter((p) => !p?.outputPath?.includes("par-statistics"));

    // Add modification dates from sidecar JSON files.
    const htmlFilesWithDates = htmlFiles.map((entry) => {
      const sidecarPath = entry.inputPath.replace(/\.html$/, '.json');
      let modified = null;
      try {
        if (fs.existsSync(sidecarPath)) {
          const sidecar = JSON.parse(fs.readFileSync(sidecarPath, 'utf8'));
          if (sidecar?.data?.modified_gmt) {
            modified = sidecar.data.modified_gmt;
          }
        }
      } catch {
        // If sidecar can't be read, leave modified as null.
      }
      return { ...entry, modified };
    });

    const htmlFileJson = JSON.stringify(htmlFilesWithDates, null, 2);

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
