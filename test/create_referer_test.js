const assert = require('assert');

const createReferer = require('../lib/createReferer').createReferer;

describe('createReferer', () => {
  it('returns original URL forced /', () => {
    const given    = 'http://example.com/a/b/c';
    const expected = 'http://example.com/';
    assert.equal(createReferer(given), expected);
  });
})
