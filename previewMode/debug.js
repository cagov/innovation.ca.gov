//Loading environment variables
const { Values } = require('../local.settings.json');
Object.keys(Values).forEach(x=>process.env[x]=Values[x]); //Load local settings file for testing

process.env.debug = true;

//run the indexpage async
const indexCode = require('../possum');
(async () => {
    //let context = {};
    //let req = {params:{}}


    const output = await indexCode.handler({path:'/previewMode',queryStringParameters:{}});
    console.log(output );

})();
