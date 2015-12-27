import { parse as parseURL } from 'url';

export function extractForwardURL(url) {
  if (!url) throw new Error('url must be given');
  const { query: { url: forwardURL } } = parseURL(url, true);
  const { href, hostname, protocol } = parseURL(forwardURL);
  if ((hostname || '') === '' || (protocol || '') === '') throw new Error('Invalid url');
  return href;
}
