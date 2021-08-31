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
    let context = {};
    let req = {params:{}, query:{}};
    //let req = {params:{}, query:{postid:'82'}};
    //let req = {params:{}, query:{postid:'59'}};

    await indexCode(context, req);
    console.log(context.res.body);

})();