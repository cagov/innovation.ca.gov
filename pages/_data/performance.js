module.exports = function () {
  return new Promise(async (resolve, reject) => {

    // see details about this API in readme
    const perfAudits = await fetch("https://qdrfvq20o2.execute-api.us-west-1.amazonaws.com/?site=innovation.ca.gov");
    const perfData = await perfAudits.json();
    let pagePerformanceData = {};
    perfData.forEach(item => {
      if(item.performance) {
        pagePerformanceData[item.pageURL.replace('https://innovation.ca.gov/','/')] = {
          lighthouse: {
            performance: item.performance,
            accessibility: 1
          }
        }
      }
      if(item.accessibility) {
        pagePerformanceData[item.pageURL.replace('https://innovation.ca.gov/','/')].lighthouse.accessibility = item.accessibility;
      }
    })
  
    console.log(pagePerformanceData);
    resolve(pagePerformanceData);
  });
};


