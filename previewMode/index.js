
const { EleventyServerless } = require("@11ty/eleventy");
const possum = require("./possum");

module.exports = async function (context, req) {
try {
  if(req.query.previewMode) {
    context.res = await possum.handler({path:'/previewMode',queryStringParameters:req.query});
  } else {
    context.res = { status: 307, headers: { location: `https://digital.ca.gov/${context.bindingData.context.RestOfUrl}` }, body: null};
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
