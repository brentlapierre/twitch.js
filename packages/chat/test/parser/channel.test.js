const parser = require('../../lib/chat/Parser');

describe('Channel', () => {
  test('JOIN', () => {
    const data = ':user!user@user.tmi.twitch.tv JOIN #channel';
    const expected = {
      prefix: 'user!user@user.tmi.twitch.tv',
      user: 'user',
      command: 'JOIN',
      channel: 'channel'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('PART', () => {
    const data = ':user!user@user.tmi.twitch.tv PART #channel';
    const expected = {
      prefix: 'user!user@user.tmi.twitch.tv',
      user: 'user',
      command: 'PART',
      channel: 'channel'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('353', () => {
    const data = ':user.tmi.twitch.tv 353 user = #channel :user1 user2 user3';
    const expected = {
      prefix: 'user.tmi.twitch.tv',
      command: '353',
      user: 'user',
      channel: 'channel',
      user_list: [
        'user1',
        'user2',
        'user3'
      ]
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('366', () => {
    const data = ':user.tmi.twitch.tv 366 user #channel :End of /NAMES list';
    const expected = {
      prefix: 'user.tmi.twitch.tv',
      command: '366',
      user: 'user',
      channel: 'channel',
      message: 'End of /NAMES list'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('MODE: moderator = true', () => {
    const data = ':jtv MODE #channel +o user';
    const expected = {
      prefix: 'jtv',
      command: 'MODE',
      channel: 'channel',
      moderator: true,
      user: 'user'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('MODE: moderator = false', () => {
    const data = ':jtv MODE #channel -o user';
    const expected = {
      prefix: 'jtv',
      command: 'MODE',
      channel: 'channel',
      moderator: false,
      user: 'user'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('CLEARCHAT: full purge', () => {
    const data = ':tmi.twitch.tv CLEARCHAT #channel';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'CLEARCHAT',
      channel: 'channel'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('CLEARCHAT: user timeout or ban', () => {
    const data = ':tmi.twitch.tv CLEARCHAT #channel :user';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'CLEARCHAT',
      channel: 'channel',
      user: 'user'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('CLEARMSG', () => {
    const data = ':tmi.twitch.tv CLEARMSG #channel :Example message';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'CLEARMSG',
      channel: 'channel',
      message: 'Example message'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('HOSTTARGET: host start', () => {
    const data = ':tmi.twitch.tv HOSTTARGET #channel #target_channel [viewers]';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'HOSTTARGET',
      channel: 'channel',
      target_channel: 'target_channel',
      viewers: 'viewers'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('HOSTTARGET: host end', () => {
    const data = ':tmi.twitch.tv HOSTTARGET #channel :- [viewers]';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'HOSTTARGET',
      channel: 'channel',
      target_channel: null,
      viewers: 'viewers'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('NOTICE', () => {
    const data = ':tmi.twitch.tv NOTICE #channel :Example message';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'NOTICE',
      channel: 'channel',
      message: 'Example message'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('PRIVMSG', () => {
    const data = ':user!user@user.tmi.twitch.tv PRIVMSG #channel :Example message';
    const expected = {
      prefix: 'user!user@user.tmi.twitch.tv',
      user: 'user',
      command: 'PRIVMSG',
      channel: 'channel',
      message: 'Example message'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('ROOMSTATE', () => {
    const data = ':tmi.twitch.tv ROOMSTATE #channel';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'ROOMSTATE',
      channel: 'channel'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('USERNOTICE', () => {
    const data = ':tmi.twitch.tv USERNOTICE #channel :Example message';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'USERNOTICE',
      channel: 'channel',
      message: 'Example message'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('USERSTATE', () => {
    const data = ':tmi.twitch.tv USERSTATE #channel';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'USERSTATE',
      channel: 'channel'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });
});
