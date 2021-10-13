export default function message (data: any): any {
  const msg = data.trim();
  const result: any = {};
  const cursor = {
    begin: 0,
    end: 0
  };

  cursor.end = msg.indexOf(' ', cursor.begin);

  if (msg.charCodeAt(cursor.begin) === 64) {
    cursor.begin = cursor.end + 1;
    result.tags = msg.slice(1, cursor.end);
    cursor.end = msg.indexOf(' ', cursor.begin);
  }

  if (msg.charCodeAt(cursor.begin) !== 58) {
    if (cursor.end === -1) {
      cursor.end = msg.length;
    }

    result.command = msg.slice(cursor.begin, cursor.end);

    if (cursor.end !== msg.length) {
      result.message = msg.slice(cursor.end + 2);
    }

    return result;
  }

  result.prefix = msg.slice(cursor.begin + 1, cursor.end);

  const prefixUserIndex = result.prefix.indexOf('@');

  if (prefixUserIndex !== -1) {
    result.user = result.prefix.slice(prefixUserIndex + 1, result.prefix.indexOf('.tmi'));
  }

  cursor.begin = cursor.end + 1;
  cursor.end = msg.indexOf(' ', cursor.begin);

  if (cursor.end === -1) {
    result.command = msg.slice(cursor.begin);
    return result;
  }

  result.command = msg.slice(cursor.begin, cursor.end);

  if (result.command === 'CAP') {
    result.command = 'CAP * ACK';
    cursor.end += 6;
  }

  cursor.begin = cursor.end + 1;
  cursor.end = msg.indexOf(' ', cursor.begin);

  if (cursor.end === -1) {
    cursor.end = msg.length;
  }

  if (msg.charCodeAt(cursor.begin) === 35) {
    const channelData = msg.slice(cursor.begin + 1, cursor.end);

    if (channelData.indexOf(':') !== -1) {
      const chatroom = channelData.split(':');
      [result.channel, result.channel_id, result.room_uuid] = chatroom;
    } else {
      result.channel = msg.slice(cursor.begin + 1, cursor.end);
    }

    if (cursor.end === msg.length) {
      return result;
    }
  } else {
    if (msg.charCodeAt(cursor.begin) !== 58) {
      if (result.command === 'WHISPER') {
        result.from = result.user;
        delete result.user;
        result.to = msg.slice(cursor.begin, cursor.end);

        cursor.begin = cursor.end + 1;
        cursor.end = data.length;
      } else {
        result.user = msg.slice(cursor.begin, cursor.end);

        cursor.begin = cursor.end + 1;
        cursor.end = msg.indexOf(' ', cursor.begin);

        if (cursor.end === -1) {
          cursor.end = msg.length;
        }
      }
    }

    switch (result.command) {
      case '353':
        cursor.begin += 2;
        cursor.end = msg.indexOf(' ', cursor.begin);

        result.channel = msg.slice(cursor.begin + 1, cursor.end);
        cursor.begin = cursor.end + 1;
        result.user_list = msg.slice(cursor.begin + 1).split(' ');
        break;

      case '366':
        result.channel = msg.slice(cursor.begin + 1, cursor.end);
        cursor.begin = cursor.end + 1;
        result.message = msg.slice(cursor.begin + 1);
        break;

      case '421':
        cursor.end = msg.indexOf(' ', cursor.begin);
        result.invalid_command = msg.slice(cursor.begin, cursor.end);
        result.message = msg.slice(cursor.end + 2);
        break;

      default:
        result.message = msg.slice(cursor.begin + 1);
        break;
    }

    return result;
  }

  cursor.begin = cursor.end + 1;
  cursor.end = msg.indexOf(' ', cursor.begin);

  if (cursor.end === -1) {
    cursor.end = msg.length;
  }

  if (msg.charCodeAt(cursor.begin) === 58) {
    switch (result.command) {
      case 'CLEARCHAT':
        result.user = msg.slice(cursor.begin + 1, cursor.end);
        break;

      case 'HOSTTARGET':
        result.target_channel = null;
        result.viewers = msg.slice(cursor.end + 2, msg.length - 1);
        break;

      default:
        result.message = msg.slice(cursor.begin + 1);
        break;
    }
  } else {
    switch (result.command) {
      case 'HOSTTARGET':
        result.target_channel = msg.slice(cursor.begin + 1, cursor.end);
        result.viewers = msg.slice(cursor.end + 2, msg.length - 1);
        break;

      case 'MODE':
        result.moderator = false;

        if (msg.charCodeAt(cursor.begin) === 43) {
          result.moderator = true;
        }

        result.user = msg.slice(cursor.end + 1);
        break;

      default:
        break;
    }
  }

  return result;
}
