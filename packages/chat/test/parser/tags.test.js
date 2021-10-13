const parser = require('../../lib/chat/Parser');

test('Tags', () => {
  const data = 'badges=<badges>;color=<color>;display-name=<display-name>;emotes=<emotes>;id=<id-of-msg>;mod=<mod>;room-id=<room-id>;subscriber=<subscriber>;tmi-sent-ts=<timestamp>;turbo=<turbo>;user-id=<user-id>;user-type=<user-type>';
  const expected = {
    badges: '<badges>',
    color: '<color>',
    'display-name': '<display-name>',
    emotes: '<emotes>',
    id: '<id-of-msg>',
    mod: '<mod>',
    'room-id': '<room-id>',
    subscriber: '<subscriber>',
    'tmi-sent-ts': '<timestamp>',
    turbo: '<turbo>',
    'user-id': '<user-id>',
    'user-type': '<user-type>'
  };

  expect(parser.tags(data)).toStrictEqual(expected);
});
