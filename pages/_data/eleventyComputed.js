const fs = require("fs");
const readabilityScores = require('readability-scores');
const convert = require('html-to-text').convert;

const evaluationTime = new Date().getTime();
const defaultReadabilityScore = {
  letterCount: 0,
  syllableCount: 0,
  wordCount: 0,
  sentenceCount: 0,
  polysyllabicWordCount: 0,
  ari: 1
};

function getReadabilityDisplayScore(ari) {
  // This readability score grading scale was created with these thresholds intentionally by the ODI content team. 
  // These score display values represent the desired values corresponding to the ARI analysis. 
  // Using these round numbers is preferable to an equation that returns any integer because it matches hemingwayapp's 
  // scoring where grade levels are only returned as whole numbers.
  if(ari < 7) return 100;
  if(ari < 8) return 95;
  if(ari < 9) return 90;
  if(ari < 10) return 80;
  if(ari < 11) return 70;
  // there is no slot for a score of 60
  if(ari < 12) return 50;
  if(ari < 13) return 40;
  if(ari < 14) return 30;
  if(ari < 15) return 20;
  if(ari < 16) return 10;
  if(ari >= 16) return 0;
}

function getDisplayClass(displayScore) {
  if(displayScore > 89)
    return 'speedlify-score-good';
  if(displayScore > 49)
    return 'speedlify-score-ok';
  return 'speedlify-score-bad';
}

function getReadability(page) {
  if (page.url == "/blog/") return {};

  const fileBody = fs.readFileSync(page.inputPath,'utf8');

  const pageBodyOnly = convert(fileBody, { 
    wordWrap: false, 
    formatters: {
      'fooBlockFormatter': function (elem, walk, builder, formatOptions) {
        builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 1 });
        walk(elem.children, builder);
        //builder.addInline('!'); // we need to help ARI reviewer identify separately presented fragments without punctuation as sentences but this can be done with 2 trailing line breaks, don't need to add punctuation
        builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 1 });
      }
    },
    selectors: [ 
      { selector: 'a', 
        format: 'skip', 
        options: { ignoreHref: true} },
      {
        selector: 'div',
        options: { leadingLineBreaks: 1, trailingLineBreaks: 2 }
      },
      {
        selector: 'li',
        format: 'fooBlockFormatter',
        options: { leadingLineBreaks: 1, trailingLineBreaks: 2 }
      },
      {
        selector: 'br',
        format: 'fooBlockFormatter',
        options: { leadingLineBreaks: 1, trailingLineBreaks: 2 }
      },
      { selector: 'img', format: 'skip'},
    ] 
  });

  const readabilityResults = readabilityScores(pageBodyOnly, {onlyARI: true}) || defaultReadabilityScore;
  const timestamp = evaluationTime;
  const displayScore = getReadabilityDisplayScore(readabilityResults.ari);
  const displayClass = getDisplayClass(displayScore);

  const results = Object.assign(readabilityResults, { timestamp, displayScore, displayClass });

  return results;
}

function getLighthouse(page, perfAudits) {
  if (!page?.url) return undefined;

  const pagePerfData = perfAudits.find((record) => {
    const perfDataPath = record?.pageURL?.replace('https://innovation.ca.gov/','/');
    return perfDataPath == page.url;
  });

  const performance = {};
  const accessibility = {};

  const perfScore = pagePerfData?.performance;

  if (perfScore) {
    const perfDisplayScore = Math.round(parseFloat(perfScore * 100));
    performance.score = perfScore;
    performance.displayScore = perfDisplayScore;
    performance.displayClass = getDisplayClass(perfDisplayScore);
  }

  const a11yScore = perfScore
    ? ( pagePerfData.accessibility || 1 ) 
    : undefined;

  if (a11yScore) {
    const a11yDisplayScore = Math.round(parseFloat(a11yScore * 100));
    accessibility.score = a11yScore;
    accessibility.displayScore = a11yDisplayScore;
    accessibility.displayClass = getDisplayClass(a11yDisplayScore);
  }

  return {
    performance,
    accessibility
  }
}

const perfApiUrl = "https://qdrfvq20o2.execute-api.us-west-1.amazonaws.com/?site=innovation.ca.gov";
let perfAudits;

module.exports = async () => {
  // Cache the perfAudits so we don't re-fetch on every function call.
  if (!perfAudits) {
    perfAudits = await fetch(perfApiUrl).then((res) => res.json());
  }

  return {
    lighthouse: article => getLighthouse(article.page, perfAudits),
    readability: article => getReadability(article.page)
  }
}