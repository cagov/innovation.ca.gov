const { serverlessHandler } = require("../previewModeModule/serverlessHandler"); //require("wordpress-11ty-azure-faas-preview-mode/serverlessHandler");
const contentRedirectSiteTarget = "https://digital.ca.gov";

/**
 * Azure Function to render a single 11ty page
 * @param {{res:{status:number,body:string},done:function}} context
 * @param {{params:{segments?:*},headers:*,query:*}} req
 */
module.exports = async function (context, req) {
  try {
    if (req.params.segments) { // Resource call, redirect back to the main site
      context.res = { status: 301, headers: { location: `${contentRedirectSiteTarget}${req.headers["x-original-url"]}` }, body: null };
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
}
