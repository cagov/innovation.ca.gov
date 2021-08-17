
const { EleventyServerless } = require("@11ty/eleventy");
const possum = require("./possum");

module.exports = async function (context, req) {
try {
    console.log(possum.handler);

    const result = await possum.handler({path:'/previewMode',queryStringParameters:req.query});

    context.res = result;

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
