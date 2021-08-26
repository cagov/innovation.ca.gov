const reuse = require("./reuse.json");
const serverlessFolder = require("../" + reuse.config.serverlessFunctionName);

const { getPreviewPostIds } = require("./fetchContent");

const renderRootPage = async () => {
  const postIds = await getPreviewPostIds();

  const links = postIds.map(x => `<li><a href="?postid=${x.id}">${x.title.rendered}</a> - ${x.modified}</li>`);

  return { 
    "content-type": 'text/html; charset=UTF-8',
    body: `<html><body><ul>${links.join()}</ul></body></html>` 
  };
}

/**
 * 
 * @param {{res:{status:number,body:string}}} context
 * @param {{params:{segments:*},headers:*}} req
 */
module.exports = async function (context, req) {
  try {
    if (req.params.segments) { // Resource call
      context.res = { status: 301, headers: { location: `${reuse.config.contentRedirectSiteTarget}${req.headers["x-original-url"]}` }, body: null };
    } else if (req.query && req.query.postid) {
      context.res = await serverlessFolder.handler({ path: reuse.config.pagePath, queryStringParameters: req.query });
    } else {  // Root call
      context.res = await renderRootPage();
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
