const parser = require('../../lib/chat/Parser');

describe('Chatroom', () => {
  test('JOIN', () => {
    const data = ':user!user@user.tmi.twitch.tv JOIN #chatrooms:channel_id:room_uuid';
    const expected = {
      prefix: 'user!user@user.tmi.twitch.tv',
      user: 'user',
      command: 'JOIN',
      channel: 'chatrooms',
      channel_id: 'channel_id',
      room_uuid: 'room_uuid'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('PART', () => {
    const data = ':user!user@user.tmi.twitch.tv PART #chatrooms:channel_id:room_uuid';
    const expected = {
      prefix: 'user!user@user.tmi.twitch.tv',
      user: 'user',
      command: 'PART',
      channel: 'chatrooms',
      channel_id: 'channel_id',
      room_uuid: 'room_uuid'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('NOTICE', () => {
    const data = ':tmi.twitch.tv NOTICE #chatrooms:channel_id:room_uuid :Example message';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'NOTICE',
      channel: 'chatrooms',
      channel_id: 'channel_id',
      room_uuid: 'room_uuid',
      message: 'Example message'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('PRIVMSG', () => {
    const data = ':user!user@user.tmi.twitch.tv PRIVMSG #chatrooms:channel_id:room_uuid :Example message';
    const expected = {
      prefix: 'user!user@user.tmi.twitch.tv',
      user: 'user',
      command: 'PRIVMSG',
      channel: 'chatrooms',
      channel_id: 'channel_id',
      room_uuid: 'room_uuid',
      message: 'Example message'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('ROOMSTATE', () => {
    const data = ':tmi.twitch.tv ROOMSTATE #chatrooms:channel_id:room_uuid';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'ROOMSTATE',
      channel: 'chatrooms',
      channel_id: 'channel_id',
      room_uuid: 'room_uuid'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });

  test('USERSTATE', () => {
    const data = ':tmi.twitch.tv USERSTATE #chatrooms:channel_id:room_uuid';
    const expected = {
      prefix: 'tmi.twitch.tv',
      command: 'USERSTATE',
      channel: 'chatrooms',
      channel_id: 'channel_id',
      room_uuid: 'room_uuid'
    };

    expect(parser.message(data)).toStrictEqual(expected);
  });
});
