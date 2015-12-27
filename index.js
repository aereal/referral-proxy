const http      = require('http');
const httpProxy = require('http-proxy');
const formatURL = require('url').format;
const parseURL  = require('url').parse;

function createReferer(url) {
  const parsed = parseURL(url);
  return formatURL({
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    port: parsed.port,
    pathname: '/',
  })
}

function extractForwardURL(url) {
  return parseURL(url, true).query['url'] || '';
}

function rewriteHeaders(proxyReq, req) {
  const forwardURL = extractForwardURL(req.url);
  const referer    = createReferer(forwardURL);
  const forwarded  = parseURL(forwardURL);

  proxyReq.path = req.path = forwarded.pathname;
  proxyReq.setHeader('Host', forwarded.hostname);
  proxyReq.setHeader('Referer', referer);
}

const proxy = httpProxy.createProxyServer({});
proxy.on('proxyReq', rewriteHeaders);
http.createServer((req, res) => {
  const requestURL = parseURL(req.url);
  const forwardURL = extractForwardURL(req.url);
  const target     = createReferer(forwardURL);
  proxy.web(req, res, { target: target });
}).listen(9090);
