import fs from 'fs';
import readabilityScores from 'readability-scores';
import { convert } from 'html-to-text';

let pageList = JSON.parse(fs.readFileSync('./_site_dist/allFiles.json'));

let ppaScores = [];
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
      { selector: 'a', options: { ignoreHref: true } },
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

  if(!ppaScores[outputUrl]) {
    console.log(outputUrl)
    ppaScores[outputUrl] = {};
  }
  ppaScores[outputUrl].readability = readabilityResults;

});

console.log(ppaScores);
fs.writeFileSync('./pages/_data/readability.json',JSON.stringify(ppaScores),'utf8')