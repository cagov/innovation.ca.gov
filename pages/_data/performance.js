module.exports = function () {
  return new Promise(async (resolve, reject) => {

    const perfAudits = await fetch("https://qdrfvq20o2.execute-api.us-west-1.amazonaws.com/?site=innovation.ca.gov");
    const perfData = await perfAudits.json();
    let pagePerformanceData = {};
    perfData.forEach(item => {
      pagePerformanceData[item.pageURL.replace('https://innovation.ca.gov/','/')] = {
        lighthouse: {
          performance: item.performance,
          accessibility: 1
        }
      }
    })
  
    console.log(pagePerformanceData);
    resolve(pagePerformanceData);
  });
};


