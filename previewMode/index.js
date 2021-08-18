
const { EleventyServerless } = require("@11ty/eleventy");
const possum = require("./possum");

module.exports = async function (context, req) {
try {

/*
  //Spit out debug info
  context.res = {
    statusCode: 200,
    body: JSON.stringify(
      {
        context,
        req
      },
      null,
      2
    ),
  };

  return;
*/
  //if(req.params.segments) { // Resource call
    //context.res = { status: 301, headers: { location: `https://digital.ca.gov${req.headers["x-original-url"]}` }, body: null};
  //} else {  // Root call
    //context.res = await possum.handler({path:'/previewMode/MyID/',queryStringParameters:req.query});
    context.res = await possum.handler({path:'/previewMode/:id/',queryStringParameters:{id:'hardcodedtest'}});
  //}

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
