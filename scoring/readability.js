import fs from 'fs';
import readabilityScores from 'readability-scores';
import htmlToFormattedText from "html-to-formatted-text";

let pageList = JSON.parse(fs.readFileSync('./_site_dist/allFiles.json'));

let ppaScores = JSON.parse(fs.readFileSync('./pages/_data/ppaScores.json'));
let evaluationTime = new Date().getTime();

pageList.forEach(page => {
  let fileBody = fs.readFileSync(page.inputPath,'utf8');
  let pageBodyOnly = htmlToFormattedText(fileBody); // Output: "foo\nbar
  // above includes many blank lines but doesn't seem to affect score much
  // console.log(pageBodyOnly.replace(/\n\s*\n/g, '\n'))
  let readabilityResults = readabilityScores(pageBodyOnly, {onlyARI: true})
  readabilityResults.timestamp = evaluationTime;
  
  let outputUrl = page.outputPath.replace('_site/','/').replace('/index.html','/');

  if(ppaScores[outputUrl]) {
    ppaScores[outputUrl].readability = readabilityResults;
  } else {
    // todo: add an entry to ppaScores
  }

});

fs.writeFileSync('./pages/_data/ppaScores.json',JSON.stringify(ppaScores),'utf8')





