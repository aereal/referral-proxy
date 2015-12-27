const assert = require('assert');

const extractForwardURL = require('../lib').extractForwardURL;

describe('extractForwardURL', () => {
  it('returns the URL passed as `url` parameter value', () => {
    const forwardURL = 'http://example.com/forwarded';
    const given    = 'http://example.com/?url=' + encodeURIComponent(forwardURL);
    assert.equal(extractForwardURL(given), forwardURL);
  });

  it('ignores the path of given URL', () => {
    const forwardURL = 'http://example.com/forwarded';
    const given    = 'http://example.com/a/b/c?url=' + encodeURIComponent(forwardURL);
    assert.equal(extractForwardURL(given), forwardURL);
  });

  it('cannot parse the URL with no protocol', () => {
    const invalidURL = 'ht';
    const given    = 'http://example.com/a/b/c?url=' + encodeURIComponent(invalidURL);
    var err;
    try { extractForwardURL(given) } catch (e) { err = e }
    assert(err instanceof Error);
  });

  it('cannot parse http://', () => {
    const invalidURL = 'http://';
    const given    = 'http://example.com/a/b/c?url=' + encodeURIComponent(invalidURL);
    var err;
    try { extractForwardURL(given) } catch (e) { err = e }
    assert(err instanceof Error);
  });
})
