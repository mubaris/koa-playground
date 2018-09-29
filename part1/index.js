const Koa = require('koa');
const Router = require('koa-router');
const Sentiment = require('sentiment');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();
const sentiment = new Sentiment();


// Analyze a text and return sentiment score in the range of -1 to 1
function analyze(text) {
    const result = sentiment.analyze(text);
    const comp = result.comparative;
    const out = comp / 5;
    return out;
}

// Use bodyparser middleware to parse JSON request
app.use(bodyParser());

// Define POST request route to analyze the text
router.post('/analyze', async (ctx, next) => {
    // Look for text property on request body
    const text = ctx.request.body.text;
    if (text) {
        // Analyze the given text
        const score = analyze(text);
        // Send response
        ctx.body = {
            text,
            score
        };
    } else {
        // Send error if there's not text property on the body
        ctx.status = 400;
        ctx.body = {
            "error": "Please provide a text to analyze"
        };
    }
});

// Use Koa Router middleware
app
    .use(router.routes())
    .use(router.allowedMethods());

// Finally, start the server
app.listen(3000, function(){
    console.log('Server started on localhost:3000');
});

