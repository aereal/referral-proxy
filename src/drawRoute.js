import { parse as parseURL } from 'url';
import { ClientError } from './clientError';

export function drawRoute(req, res) {
  return new Promise((ok, ng) => {
    const reqURI = parseURL(req.url);
    reqURI.pathname === '/proxy' ? ok([req, res]) : ng(new ClientError('Not found', 404));
  });
}
