
const { EleventyServerless } = require("@11ty/eleventy");
const possum = require("../possum");

/**
 * 
 * @param {{res:{status:number,body:string}}} context
 * @param {{params:{segments:*},headers:*}} req
 */
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
    if(req.params.segments) { // Resource call
      context.res = { status: 301, headers: { location: `https://digital.ca.gov${req.headers["x-original-url"]}` }, body: null};
    } else {  // Root call
      //context.res = await possum.handler({path:'/previewMode/MyID/',queryStringParameters:req.query});
      //context.res = await possum.handler({path:'/previewMode',queryStringParameters:{id:'hardcodedtest'}});
      context.res = await possum.handler({path:'/previewMode',queryStringParameters:req.query});
    }

  } catch (error) {
      context.res = {
          status: error.httpStatusCode || 500,
          body: JSON.stringify(
            {
              error: error.message,
            },
            null,
            2
          ),
        };
  }
  if(context.done) context.done();
}
