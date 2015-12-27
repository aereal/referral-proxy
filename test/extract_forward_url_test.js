const assert = require('assert');

const extractForwardURL = require('../').extractForwardURL;

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
})
