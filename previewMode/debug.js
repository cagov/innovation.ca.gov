/*
Debug file for running Azure function

To use this Debug file, put the following in \.vscode\launch.json

{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug DIRECT previewMode",
      "program": "previewMode/debug",
      "cwd": "${workspaceRoot}",
      "outputCapture": "std",
      "autoAttachChildProcesses": true,
      "console": "internalConsole"
    },
  ]
}

*/

process.env.debug = true;

//run the indexpage async
const indexCode = require('./index');
(async () => {
  //let req = {headers:{'x-original-url': "/img/thumb/100-performance.jpg"}, query:{}};
  //let req = {headers:{'x-original-url': "/css/5c904a3bad4ab89406bd.css"}, query:{}};
  //let req = {headers:{'x-original-url': "/"}, query:{}};
  //let req = {};
  //let req = {headers:{'x-original-url': "/preview-mode-test"}};
  let req = {headers:{'x-original-url': "/preview-mode-test?test=1", query:{test:"1"}}};

  let context = {req, res:{body:''}};
  await indexCode(context);
  console.log(context.res.body);

})();