const eleventyNavigation = require("@11ty/eleventy-navigation/eleventy-navigation");
const fs = require("fs");
const readabilityScores = require("readability-scores");
const convert = require("html-to-text").convert;

const evaluationTime = new Date().getTime();
const defaultReadabilityScore = {
  letterCount: 0,
  syllableCount: 0,
  wordCount: 0,
  sentenceCount: 0,
  polysyllabicWordCount: 0,
  ari: 1,
};

function getReadabilityDisplayScore(ari) {
  // This readability score grading scale was created with these thresholds intentionally by the ODI content team.
  // These score display values represent the desired values corresponding to the ARI analysis.
  // Using these round numbers is preferable to an equation that returns any integer because it matches hemingwayapp's
  // scoring where grade levels are only returned as whole numbers.
  if (ari < 7) return 100;
  if (ari < 8) return 95;
  if (ari < 9) return 90;
  if (ari < 10) return 80;
  if (ari < 11) return 70;
  // there is no slot for a score of 60
  if (ari < 12) return 50;
  if (ari < 13) return 40;
  if (ari < 14) return 30;
  if (ari < 15) return 20;
  if (ari < 16) return 10;
  if (ari >= 16) return 0;
}

function getDisplayClass(displayScore) {
  if (displayScore > 89) return "speedlify-score-good";
  if (displayScore > 49) return "speedlify-score-ok";
  return "speedlify-score-bad";
}

function getPacificDateInfo(dateInput) {
  if (dateInput === undefined || dateInput === null) return {};

  const dateObj = new Date(dateInput);
  if (Number.isNaN(dateObj.getTime())) return {};

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(dateObj).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  const displayDate = `${parts.year}-${parts.month}-${parts.day}`;
  const displayTime = `${parts.hour}:${parts.minute}:${parts.second} PT`;

  return {
    timestamp: dateObj.getTime(),
    displayDate,
    tooltip: `${displayDate} ${displayTime}`,
  };
}

function getReadability(page) {
  if (page.url == "/blog/") return {};

  const fileBody = fs.readFileSync(page.inputPath, "utf8");

  const pageBodyOnly = convert(fileBody, {
    wordWrap: false,
    formatters: {
      fooBlockFormatter: function (elem, walk, builder, formatOptions) {
        builder.openBlock({
          leadingLineBreaks: formatOptions.leadingLineBreaks || 1,
        });
        walk(elem.children, builder);
        //builder.addInline('!'); // we need to help ARI reviewer identify separately presented fragments without punctuation as sentences but this can be done with 2 trailing line breaks, don't need to add punctuation
        builder.closeBlock({
          trailingLineBreaks: formatOptions.trailingLineBreaks || 1,
        });
      },
    },
    selectors: [
      { selector: "a", format: "skip", options: { ignoreHref: true } },
      {
        selector: "div",
        options: { leadingLineBreaks: 1, trailingLineBreaks: 2 },
      },
      {
        selector: "li",
        format: "fooBlockFormatter",
        options: { leadingLineBreaks: 1, trailingLineBreaks: 2 },
      },
      {
        selector: "br",
        format: "fooBlockFormatter",
        options: { leadingLineBreaks: 1, trailingLineBreaks: 2 },
      },
      { selector: "img", format: "skip" },
    ],
  });

  const readabilityResults =
    readabilityScores(pageBodyOnly, { onlyARI: true }) ||
    defaultReadabilityScore;
  const timestamp = evaluationTime;
  const displayScore = getReadabilityDisplayScore(readabilityResults.ari);
  const displayClass = getDisplayClass(displayScore);

  const results = Object.assign(readabilityResults, {
    timestamp,
    displayScore,
    displayClass,
  });

  return results;
}

function getLighthouse(page, perfAudits) {
  if (!page?.url) return undefined;

  const pagePerfData = perfAudits.find((record) => {
    const perfDataPath = record?.pageURL?.replace(
      "https://innovation.ca.gov/",
      "/"
    );
    return perfDataPath == page.url;
  });

  const performance = {};
  const accessibility = {};

  const perfScore = pagePerfData?.performance;
  const lastmod = getPacificDateInfo(pagePerfData?.lastmod);
  const lastreviewed = getPacificDateInfo(pagePerfData?.lastreviewed);

  if (perfScore) {
    const perfDisplayScore = Math.round(parseFloat(perfScore * 100));
    performance.score = perfScore;
    performance.displayScore = perfDisplayScore;
    performance.displayClass = getDisplayClass(perfDisplayScore);
  }

  const a11yScore = perfScore ? pagePerfData.accessibility || 1 : undefined;

  if (a11yScore) {
    const a11yDisplayScore = Math.round(parseFloat(a11yScore * 100));
    accessibility.score = a11yScore;
    accessibility.displayScore = a11yDisplayScore;
    accessibility.displayClass = getDisplayClass(a11yDisplayScore);
  }

  return {
    performance,
    accessibility,
    lastmod,
    lastreviewed,
  };
}

const isPost = (article) => article?.data?.type == "post";
const isPage = (article) => article?.data?.type == "page";

const getPermalink = (article) => {
  if (isPage(article)) {
    const url = article.data.wordpress_url;
    if (url && url.includes(".pantheonsite.io/"))
      return url.split(".pantheonsite.io/")[1] || "/";
    return url;
  }

  if (isPost(article)) {
    return `blog/posts/${article.page.fileSlug}/`;
  }

  return article.permalink;
};

const getLayout = (article) => {
  if (isPost(article)) return "post";
  if (isPage(article) && article?.page.url == "/search/") return "search";
  if (isPage(article) && article?.page.url == "/") return "landing";
  if (isPage(article) && article?.page.url == "/par-statistics/") return "par-statistics";
  if (isPage(article) && article?.data.tags.includes("layout-no-sidebar"))
    return "single-column";
  if (isPage(article) && !article?.data.layout) return "content";
  if (isPage(article)) return article?.data.template;
  return article.layout;
};

const getNavigation = (article) => {
  if (isPage(article)) {
    const key = article.data.id;
    const title = article.data.title;
    const wpParent = article.data.parent;
    const parent = wpParent != 0 ? wpParent : undefined;
    return { key, title, parent };
  }

  return undefined;
};

const perfApiUrl =
  "https://qdrfvq20o2.execute-api.us-west-1.amazonaws.com/?site=innovation.ca.gov";
let perfAudits;

module.exports = async () => {
  // Cache the perfAudits so we don't re-fetch on every function call.
  if (!perfAudits) {
    perfAudits = await fetch(perfApiUrl).then((res) => res.json());
  }
  return {
    title: (article) => article?.data?.title || article.title,
    id: (article) => article?.data?.id,
    date: (article) => article?.data?.date || article.date,
    publishdate: (article) => article?.data?.date.split("T")[0] || article.publishdate,
    meta: (article) => article?.data?.excerpt || article.meta,
    description: (article) => article?.data?.excerpt || article.meta,
    author: (article) => article?.data?.author || article.author,
    tags: (article) => (isPost(article) ? ["news"] : (article?.data?.tags || article.tags)),
    // this brought in the do-not-crawl tags, but broke recent blog articles
    // tags: (article) => article?.data?.tags || (isPost(article) ? ["news"] : article.tags),
    permalink: (article) => getPermalink(article),
    layout: (article) => getLayout(article),
    eleventyNavigation: (article) => getNavigation(article),
    lighthouse: (article) => getLighthouse(article.page, perfAudits),
    readability: (article) => getReadability(article.page),
  };
};
