const http      = require('http');
const httpProxy = require('http-proxy');
const formatURL = require('url').format;
const parseURL  = require('url').parse;

import { control } from './control';
import { ClientError } from './clientError';
import { drawRoute } from './drawRoute';
import { createReferer } from './createReferer';
import { extractForwardURL } from './extractForwardURL';
import { parseArgs } from './parseArgs';

function rewriteHeaders(proxyReq, req) {
  const forwardURL = extractForwardURL(req.url);
  const referer    = createReferer(forwardURL);
  const forwarded  = parseURL(forwardURL);

  proxyReq.path = req.path = forwarded.pathname;
  proxyReq.setHeader('Host', forwarded.hostname);
  proxyReq.setHeader('Referer', referer);
}

const args = parseArgs(process.argv.slice(2));
const port = args.port;
const authToken = '';

const proxy = httpProxy.createProxyServer({});
proxy.on('proxyReq', rewriteHeaders);
http.createServer((req, res) => {
  drawRoute(req, res)
    .then(([req, res]) => {
      const { query: { token: reqToken } } = parseURL(req.url, true);
      if (reqToken !== authToken) throw new ClientError('Invalid token', 401);
      return [req, res];
    })
    .then(([req, res]) => {
      return control(extractForwardURL.bind(this, req.url))
        .then(forwardURL => {
          console.log(`---> forwardURL = ${forwardURL}`);
          const target = createReferer(forwardURL);
          proxy.web(req, res, { target: target });
        }, err => {
          throw new ClientError("Valid url parameter required", 400);
        })
    })
    .catch(err => {
      const httpError = 'statusCode' in err ? err : new ClientError('something bad', 500);
      res.writeHead(httpError.statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.write(httpError.message + "\n");
      res.end()
    })
}).listen(port);
