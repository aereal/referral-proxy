import minimist from 'minimist';

const defaultPort = 9090;
const alias = {
  p: 'port',
};
export function parseArgs(argv) {
  const args = minimist(argv, {
    alias,
  });
  return {
    args,
    port: args.port || process.env.REFERRAL_PROXY_PORT || defaultPort,
  };
}
