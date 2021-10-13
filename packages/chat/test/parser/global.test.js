const parser = require('../../lib/chat/Parser');

describe('Global', () => {
  test('Connection established', () => {
    const data = ':tmi.twitch.tv 001 user :Example message';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: '001',
      user: 'user',
      message: 'Example message'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('CAP * ACK', () => {
    const data = ':tmi.twitch.tv CAP * ACK :Example message';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'CAP * ACK',
      message: 'Example message'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('421', () => {
    const data = ':tmi.twitch.tv 421 user WHO :Example message';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: '421',
      user: 'user',
      invalid_command: 'WHO',
      message: 'Example message'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('RECONNECT', () => {
    const data = 'RECONNECT';
    const expected = {
      command: 'RECONNECT'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('PING', () => {
    const data = 'PING :tmi.twitch.tv';
    const expected = {
      command: 'PING',
      message: 'tmi.twitch.tv'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('GLOBALUSERSTATE', () => {
    const data = ':tmi.twitch.tv GLOBALUSERSTATE';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'GLOBALUSERSTATE'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('WHISPER', () => {
    const data = ':from!from@from.tmi.twitch.tv WHISPER to :Example message';
    const expected = {
      prefix: 'from!from@from.tmi.twitch.tv',
      from: 'from',
      command: 'WHISPER',
      to: 'to',
      message: 'Example message'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });
});
