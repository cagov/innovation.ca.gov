/*
 * This can run a performance analysis on files
 * This file is no longer used, it was retired in favor of an AWS Lambda hosted version
 * This process is kind of slow, takes several seconds for each url so won't work in the build process
 * 
 * The performance scores are retrieved during build in 11ty's _data/performance.js which calls the lambda which does the evaluations on a daily cron and stores results in dynamodb
*/

import fs from 'fs';
import PerfLeaderboard from "performance-leaderboard";

(async function() {

  let pageList = JSON.parse(fs.readFileSync('./_site_dist/allFiles.json'));

  let urls = [];
  let host = "https://innovation.ca.gov";

  pageList.forEach(page => {
    let outputUrl = host + page.outputPath.replace('_site/','/').replace('/index.html','/');
		urls.push(outputUrl);
  });



	// Create the options object (not required)
	const options = {
		axePuppeteerTimeout: 30000, // 30 seconds
		writeLogs: false, // Store audit data
		logDirectory: '.log', // Default audit data files stored at `.log`
		readFromLogDirectory: false, // Skip tests with existing logs
		// onlyCategories: ["performance","accessibility"],
    bypassAxe: urls,
		chromeFlags: ['--headless'],
		freshChrome: "site", // or "run"
		launchOptions: {}, // Puppeteer launch options
	}

	let perfData = await PerfLeaderboard(urls, 1, options);

  fs.writeFileSync('./perfdata.json',JSON.stringify(perfData),'utf8');
})();