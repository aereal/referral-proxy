import { createServer } from 'http';

import { parseArgs } from './parseArgs';
import { drawRoute } from './drawRoute';
import { createReferralProxy } from './';

export function startServer() {
  const args = parseArgs(process.argv.slice(2));
  const port = args.port;
  const handler = createReferralProxy(args);

  return createServer((req, res) => {
    drawRoute(req, res).then(([req, res]) => { handler(req, res) });
  }).listen(port);
}
