import extractor from 'unfluff';
import fetch from 'node-fetch';
import rs from 'text-readability';
import {automatedReadability} from 'automated-readability';
import fs from 'fs';

import readabilityScores from 'readability-scores';

async function getPage(url) {
  const response = await fetch(url);
  const body = await response.text();
  
  let data = extractor(body);
  return data.text;
}

let testText = "The Office of Data and Innovation (ODI) helps departments meet Californians where they are. We use data, human-centered design and technology to create services that are easier for everyone to use. See what we've doneChanging state government through the Data and Innovation FundThis fund is a key part of how we're improving services for Californians. When paired with the innovative approach of ODI's cross-functional teams, we make a real impact on people's lives. Learn more about the Fund. Who we work with. A team as diverse as the state we serve. There's no typical ODI team member. We come from throughout the state and bring a diversity of experience to our work. What unites us? Our passion to make a difference for all Californians. We're always looking for people who want to do big things!";


let pageBody = await getPage('http://localhost:8080/');
console.log(pageBody)

console.log("fleschReadingEase: "+rs.fleschReadingEase(pageBody));
console.log("fleschKincaidGrade: "+rs.fleschKincaidGrade(pageBody));
console.log("colemanLiauIndex: "+rs.colemanLiauIndex(pageBody));
// this is higher than hemingway
console.log("automatedReadabilityIndex: "+rs.automatedReadabilityIndex(pageBody));
console.log("daleChallReadabilityScore: "+rs.daleChallReadabilityScore(pageBody));
console.log("difficultWords: "+rs.difficultWords(pageBody));
console.log("linsearWriteFormula: "+rs.linsearWriteFormula(pageBody));
console.log("gunningFog: "+rs.gunningFog(pageBody));
console.log("textStandard: "+rs.textStandard(pageBody));

// this is close to hemingway but needs everything pre parsed
let ar = automatedReadability({
  sentence: 12,
  word: 141,
  character: 644
});
console.log('---');
console.log(ar)

// this one is closes to hemingway
let readab = readabilityScores(pageBody, {onlyARI: true})
console.log(readab)

let fileBody = fs.readFileSync('../pages/wordpress-pages/homepage.html','utf8');
import htmlToFormattedText from "html-to-formatted-text";
let pageBodyOnly = htmlToFormattedText(fileBody); // Output: "foo\nbar

console.log(pageBodyOnly)
// try with different extractionn technique to avoid sentence munging
let readab2 = readabilityScores(pageBodyOnly, {onlyARI: true})
console.log(readab2)

let readab3 = readabilityScores(testText, {onlyARI: true})
console.log(readab3)



