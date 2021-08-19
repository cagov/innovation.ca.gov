//Loading environment variables
const { Values } = require('../local.settings.json');
Object.keys(Values).forEach(x=>process.env[x]=Values[x]); //Load local settings file for testing

process.env.debug = true;

//run the indexpage async
const indexCode = require('./index');
(async () => {
    let context = {};
    let req = {params:{}}


    await indexCode(context, req);
    console.log(context.res.body);

})();
