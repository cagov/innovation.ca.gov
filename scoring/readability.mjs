/*
 * Readability analysis 
 * This is called as part of the build process (not in dev)
 * It runs an Automated Readability score analysis similar to hemingwayapp
 * Results are saved to an 11ty data file and used to display readability scores on the footer
 * 
 * The url list is created by 11ty
 * The latest version of this analyzes the page content file fragment to score the page
 * This is much easier than parsing the page body from the fully built html
 * Previous versions worked with the full html, pulling the body with unfluff but ran into issues with determining sentence fragments without punctuation. Sentence count is important for ARI scoring
*/

import fs from 'fs';
import readabilityScores from 'readability-scores';
import { convert } from 'html-to-text';

// Get the list of pages to test.
let pageList = JSON.parse(fs.readFileSync('./_site_dist/allFiles.json'));

let parScores = {};
let evaluationTime = new Date().getTime();

pageList.forEach(page => {
  let fileBody = fs.readFileSync(page.inputPath,'utf8');

  let pageBodyOnly = convert(fileBody, { 
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

  let readabilityResults = readabilityScores(pageBodyOnly, {onlyARI: true})
  if(!readabilityResults) {
    readabilityResults = {
      letterCount: 0,
      syllableCount: 0,
      wordCount: 0,
      sentenceCount: 0,
      polysyllabicWordCount: 0,
      ari: 1
    }
  }
  readabilityResults.timestamp = evaluationTime;
  // console.log(readabilityResults);

  let outputUrl = page.outputPath.replace('_site/','/').replace('/index.html','/');

  if(!parScores[outputUrl]) {
    parScores[outputUrl] = {};
  }
  parScores[outputUrl].readability = readabilityResults;

});

// console.log(JSON.stringify(parScores));
fs.writeFileSync('./pages/_data/readability.json',JSON.stringify(parScores),'utf8')