const http      = require('http');
const httpProxy = require('http-proxy');
const formatURL = require('url').format;
const parseURL  = require('url').parse;

function createReferer(url) {
  const { protocol, hostname, port } = parseURL(url);
  return formatURL({
    protocol,
    hostname,
    port,
    pathname: '/',
  })
}
exports.createReferer = createReferer;

function extractForwardURL(url) {
  const { query: { url: forwardURL } } = parseURL(url, true);
  return forwardURL;
}
exports.extractForwardURL = extractForwardURL;

function rewriteHeaders(proxyReq, req) {
  const forwardURL = extractForwardURL(req.url);
  const referer    = createReferer(forwardURL);
  const forwarded  = parseURL(forwardURL);

  proxyReq.path = req.path = forwarded.pathname;
  proxyReq.setHeader('Host', forwarded.hostname);
  proxyReq.setHeader('Referer', referer);
}
exports.rewriteHeaders = rewriteHeaders;

const proxy = httpProxy.createProxyServer({});
proxy.on('proxyReq', rewriteHeaders);
http.createServer((req, res) => {
  const requestURL = parseURL(req.url);
  const forwardURL = extractForwardURL(req.url);
  const target     = createReferer(forwardURL);
  proxy.web(req, res, { target: target });
}).listen(9090);
