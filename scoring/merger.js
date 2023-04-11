import fs from 'fs';

let ppaScores = JSON.parse(fs.readFileSync('./pages/_data/ppaScores.json'));
let evaluationTime = new Date().getTime();

let perfData = JSON.parse(fs.readFileSync('./perfdata.json'));

perfData.forEach(page => {
  // find matching ppaScores
  // add a perfData node

  let outputUrl = page.url.replace('http://localhost:8080/','/');

  if(!ppaScores[outputUrl]) {
    ppaScores[outputUrl] = {};
  }
  ppaScores[outputUrl].lighthouse = page.lighthouse;
  ppaScores[outputUrl].lighthouse.timestamp = evaluationTime;

})

fs.writeFileSync('./pages/_data/ppaScores.json',JSON.stringify(ppaScores),'utf8')
