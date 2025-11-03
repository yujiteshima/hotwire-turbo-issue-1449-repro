// @ts-nocheck
// @playwright-no-transform
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/scroll_8_0_14');
});

app.get('/scroll_8_0_14', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'scroll-8-0-14.html'));
});

app.get('/scroll/ok', (req, res) => {
  res.status(200).send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="turbo-refresh-scroll" content="reset">
<script type="module" src="https://cdn.jsdelivr.net/npm/@hotwired/turbo@8.0.14/dist/turbo.es2017-esm.js"></script>
<style>
body { font-family: sans-serif; line-height: 1.6; margin: 0; padding-top: 120px; }
nav { position: fixed; top: 0; left: 0; right: 0; background: white; padding: 16px; border-bottom: 2px solid #ccc; z-index: 1000; }
.spacer { height: 2000px; background: linear-gradient(#e0ffe0, #c0ffc0); margin: 16px 0; }
a { margin-right: 12px; }
h1 { margin: 16px; }
p { margin: 16px; }
</style></head>
<body>
<h1>OK 200</h1>
<p>If scroll reset works, you should see this at the TOP of the page.</p>
<nav>
<a href="/scroll_8_0_14">Back to Main</a>
<a id="to200" href="/scroll/ok">200 OK</a>
<a id="to302" href="/scroll/302">302 → 200</a>
<a id="to404" href="/scroll/404">404</a>
<a id="to500" href="/scroll/500">500</a>
</nav>
<div class="spacer"></div>
<p>Bottom area (scroll reset worked if you don't see this initially)</p>
</body></html>`);
});

app.get('/scroll/404', (req, res) => {
  res.status(404).send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="turbo-refresh-scroll" content="reset">
<script type="module" src="https://cdn.jsdelivr.net/npm/@hotwired/turbo@8.0.14/dist/turbo.es2017-esm.js"></script>
<style>
body { font-family: sans-serif; line-height: 1.6; margin: 0; padding-top: 120px; }
nav { position: fixed; top: 0; left: 0; right: 0; background: white; padding: 16px; border-bottom: 2px solid #ccc; z-index: 1000; }
.spacer { height: 2000px; background: linear-gradient(#ffe0e0, #ffc0c0); margin: 16px 0; }
a { margin-right: 12px; }
h1 { margin: 16px; }
p { margin: 16px; }
</style></head>
<body>
<h1>Not Found 404</h1>
<p>Expected scroll reset (currently bug). If it works, you should see this at the TOP.</p>
<nav>
<a href="/scroll_8_0_14">Back to Main</a>
<a id="to200" href="/scroll/ok">200 OK</a>
<a id="to302" href="/scroll/302">302 → 200</a>
<a id="to404" href="/scroll/404">404</a>
<a id="to500" href="/scroll/500">500</a>
</nav>
<div class="spacer"></div>
<p>Bottom area (scroll reset worked if you don't see this initially)</p>
</body></html>`);
});

app.get('/scroll/500', (req, res) => {
  res.status(500).send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="turbo-refresh-scroll" content="reset">
<script type="module" src="https://cdn.jsdelivr.net/npm/@hotwired/turbo@8.0.14/dist/turbo.es2017-esm.js"></script>
<style>
body { font-family: sans-serif; line-height: 1.6; margin: 0; padding-top: 120px; }
nav { position: fixed; top: 0; left: 0; right: 0; background: white; padding: 16px; border-bottom: 2px solid #ccc; z-index: 1000; }
.spacer { height: 2000px; background: linear-gradient(#ffe0a0, #ffc060); margin: 16px 0; }
a { margin-right: 12px; }
h1 { margin: 16px; }
p { margin: 16px; }
</style></head>
<body>
<h1>Error 500</h1>
<p>Expected scroll reset (currently bug). If it works, you should see this at the TOP.</p>
<nav>
<a href="/scroll_8_0_14">Back to Main</a>
<a id="to200" href="/scroll/ok">200 OK</a>
<a id="to302" href="/scroll/302">302 → 200</a>
<a id="to404" href="/scroll/404">404</a>
<a id="to500" href="/scroll/500">500</a>
</nav>
<div class="spacer"></div>
<p>Bottom area (scroll reset worked if you don't see this initially)</p>
</body></html>`);
});

app.get('/scroll/302', (req, res) => res.redirect(302, '/scroll/ok'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Visit /scroll_8_0_14 for reproduction.`);
});
