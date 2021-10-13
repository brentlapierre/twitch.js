const parser = require('../../lib/chat/Parser');

test('Badges', () => {
  const data = 'broadcaster/1,subscriber/12,bits/1000';
  const expected = {
    broadcaster: '1',
    subscriber: '12',
    bits: '1000'
  };

  expect(parser.badges(data)).toStrictEqual(expected);
});
