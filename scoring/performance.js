import fs from 'fs';
import PerfLeaderboard from "performance-leaderboard";

(async function() {

  let pageList = JSON.parse(fs.readFileSync('./_site_dist/allFiles.json'));
  let ppaScores = JSON.parse(fs.readFileSync('./pages/_data/ppaScores.json'));
  let evaluationTime = new Date().getTime();

  let urls = [];
  let host = "http://localhost:8080";

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

  // merge perfdata with ppaScores
})();