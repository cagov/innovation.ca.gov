
const { EleventyServerless } = require("@11ty/eleventy");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = runCode('/',req.query);


}

const runCode = (path,queryStringParameters) => {

    let elev = new EleventyServerless("possum", {
        path: path,
        query: queryStringParameters,
        inputDir: "pages",
        functionsDir: "./previewMode/",
      });
    
      try {
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "text/html; charset=UTF-8",
          },
          body: await elev.render(),
        };
      } catch (error) {
        // Only console log for matching serverless paths
        // (otherwise you’ll see a bunch of BrowserSync 404s for non-dynamic URLs during --serve)
        if (elev.isServerlessUrl(path)) {
          console.log("Serverless Error:", error);
        }
    
        return {
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