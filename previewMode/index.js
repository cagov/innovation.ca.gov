const possum = require("../possum");

/**
 * 
 * @param {{res:{status:number,body:string}}} context
 * @param {{params:{segments:*},headers:*}} req
 */
module.exports = async function (context, req) {
  try {
    if(req.params.segments) { // Resource call
      context.res = { status: 301, headers: { location: `https://digital.ca.gov${req.headers["x-original-url"]}` }, body: null};
    } else {  // Root call
      context.res = await possum.handler({path:'/previewModePage',queryStringParameters:req.query});
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
