import { parse as parseURL, format as formatURL } from 'url';

export function createReferer(url) {
  const { protocol, hostname, port } = parseURL(url);
  return formatURL({
    protocol,
    hostname,
    port,
    pathname: '/',
  })
}
