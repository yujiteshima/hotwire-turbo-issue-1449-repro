// @ts-nocheck
// @playwright-no-transform
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/scroll_8_0_14', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'scroll-8-0-14.html'));
});

app.get('/scroll/ok', (req, res) => {
  res.status(200).send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="turbo-refresh-scroll" content="reset">
<script type="module" src="https://cdn.skypack.dev/@hotwired/turbo@8.0.14"></script></head>
<body><h1>OK 200</h1><p>Should scroll to top if reset works.</p></body></html>`);
});

app.get('/scroll/404', (req, res) => {
  res.status(404).send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="turbo-refresh-scroll" content="reset">
<script type="module" src="https://cdn.skypack.dev/@hotwired/turbo@8.0.14"></script></head>
<body><h1>Not Found 404</h1><p>Expected scroll reset (currently bug).</p></body></html>`);
});

app.get('/scroll/500', (req, res) => {
  res.status(500).send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="turbo-refresh-scroll" content="reset">
<script type="module" src="https://cdn.skypack.dev/@hotwired/turbo@8.0.14"></script></head>
<body><h1>Error 500</h1><p>Expected scroll reset (currently bug).</p></body></html>`);
});

app.get('/scroll/302', (req, res) => res.redirect(302, '/scroll/ok'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Visit /scroll_8_0_14 for reproduction.`);
});
