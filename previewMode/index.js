//Using Azure FaaS, the service can render a single page from remote content, while redirecting all other resource requests (.css, .png, etc) back to the real web server.

const { azureFunctionHandler, serverlessHandler } = require("@cagov/11ty-serverless-preview-mode");
const fetch = require('node-fetch/lib');
const { Response } = require('node-fetch');
/**
 * Azure Function to render a single 11ty page
 * @param {{req:{headers:*,query:*},res:{statusCode:number;body:string;headers?:*};done:function}} context Azure Function context
 */
module.exports = async function (context) {
  const TEMPazureFunctionHandler = async (context, resourceUrl) => {
    const req = context.req;
    const originalUrl = req.headers["x-original-url"];
    try {
        if (req.query.postid || originalUrl === '/') {
            context.res = await serverlessHandler(req.query);
        } else { // Resource call, redirect back to the main site
            /** @type {Response} */
            const fetchResponse = await fetch(`${resourceUrl}${originalUrl}`);
            if (!fetchResponse.ok) {
                throw new Error(`${fetchResponse.status} - ${fetchResponse.statusText} - ${fetchResponse.url}`);
            }
            //const body = await fetchResponse.arrayBuffer()
            const body = await fetchResponse.text();
            context.res = {
                //isRaw: true,
                headers: { 
                    "content-type": fetchResponse.headers.get('content-type')
                },
                body
            };
            
            //context.res.raw(new Uint8Array(buf))
            //const data = fetchResponse.json();

            //context.res = { statusCode: 301, headers: { location: `${resourceUrl}${originalUrl}` }, body: null };
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
    if (context.done) context.done();
}
await TEMPazureFunctionHandler(context, "https://digital.ca.gov");
  //await azureFunctionHandler(context, "https://digital.ca.gov");
}