//Using Azure FaaS, the service can render a single page from remote content, while redirecting all other resource requests (.css, .png, etc) back to the real web server.

const { serverlessHandler } = require("@cagov/11ty-serverless-preview-mode");
const contentRedirectSiteTarget = "https://digital.ca.gov";

/**
 * Azure Function to render a single 11ty page
 * @param {{res:{statusCode:number;body:string;headers?:*};done:function}} context
 * @param {{params:{segments?:*},headers:*,query:*}} req
 */
module.exports = async function (context, req) {
  context.res = {
    body: JSON.stringify({context,req},null,2),
  };
  if (context.done) context.done();
  /*
  
    try {
      if (req.params.segments) { // Resource call, redirect back to the main site
        context.res = { statusCode: 301, headers: { location: `${contentRedirectSiteTarget}${req.headers["x-original-url"]}` }, body: null };
      } else {
        context.res = await serverlessHandler(req.query);
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
    if (context.done) context.done();
    */
}
