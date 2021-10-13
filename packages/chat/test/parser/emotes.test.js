const parser = require('../../lib/chat/Parser');

test('Emotes', () => {
  const data = '<emote-1>:<index1_start>-<index1_end>,<index2_start>-<index2_end>/<emote-2>:<index1_start>-<index1_end>';
  const expected = {
    '<emote-1>': [
      ['<index1_start>', '<index1_end>'],
      ['<index2_start>', '<index2_end>']
    ],
    '<emote-2>': [
      ['<index1_start>', '<index1_end>']
    ]
  };

  expect(parser.emotes(data)).toStrictEqual(expected);
});
