
const { EleventyServerless } = require("@11ty/eleventy");
const handler = require("./possum");

module.exports = async function (context, req) {
try {


    console.log(handler);


    
    const result = await handler({path:'.',queryStringParameters:req.query});


    context.res = {
        body: JSON.stringify(result)
    }





} catch (error) {
    context.res = {
        statusCode: error.httpStatusCode || 500,
        body: JSON.stringify(
          {
            error: error.message,
          },
          null,
          2
        ),
      };
}
}
