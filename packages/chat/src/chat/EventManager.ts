import EventEmitter from 'events';
import * as parser from './Parser';

export default class EventManager extends EventEmitter {
  constructor () {
    super();
    EventEmitter.call(this);
  }

  private emits (events: string[], response: any, channel?: string) {
    events.forEach((event: string) => {
      const eventName: string = `${event}${channel !== undefined ? `.${channel}` : ''}`;
  
      if (response !== undefined) {
        this.emit(eventName, response);
      } else {
        this.emit(eventName);
      }
    });
  }

  private _clearChat (data: any, tags: any) {
    if (Object.prototype.hasOwnProperty.call(data, 'user')) {
      if (tags.length) {
        this.emit('timeout', data.channel, data.user, tags['ban-duration']);
      } else {
        this.emit('ban', data.channel, data.user);
      }
    } else {
      this.emits(['clear'], '', data.channel);
      this.emit('clear', data.channel);
    }
  }

  private _clearMsg (data: any, tags: any) {
    this.emit('purge', data.channel, data.user, { message: data.message, id: tags['target-msg-id'] });
  }

  private _hostTarget (data: any) {
    if (data.target_channel !== null) {
      this.emit('host', data.channel, data.target_channel, data.viewers);
    } else {
      this.emit('unhost', data.channel);
    }
  }

  private _join (data: any) {
    // @ts-expect-error
    if (!this.inChannel(data.channel)) {
      // @ts-expect-error
      this.channels.push(data.channel);
      this.emits(['join'], '', data.channel);
    }

    this.emit('join', data.channel, data.user);
  }

  private _notice (data: any, tags: any) {
    switch (tags['msg-id']) {
      case 'msg_banned':
      case 'msg_bad_characters':
      case 'msg_channel_blocked':
      case 'msg_duplicate':
      case 'msg_emoteonly':
      case 'msg_facebook':
      case 'msg_followersonly':
      case 'msg_followersonly_followed':
      case 'msg_followersonly_zero':
      case 'msg_r9k':
      case 'msg_ratelimit':
      case 'msg_rejected':
      case 'msg_rejected_mandatory':
      case 'msg_room_not_found':
      case 'msg_slowmode':
      case 'msg_subsonly':
      case 'msg_suspended':
      case 'msg_timedout':
      case 'msg_verified_email':
        this.emits(['action', 'say'], tags['msg-id'], data.channel);
        break;

      case 'usage_me':
        this.emits(['action'], tags['msg-id'], data.channel);
        break;

      case 'already_banned':
      case 'bad_ban_admin':
      case 'bad_ban_anon':
      case 'bad_ban_broadcaster':
      case 'bad_ban_global_mod':
      case 'bad_ban_mod':
      case 'bad_ban_self':
      case 'bad_ban_staff':
      case 'usage_ban':
        this.emits(['ban'], tags['msg-id'], data.channel);
        break;

      case 'ban_success':
        this.emits(['ban'], data.message, data.channel);
        break;

      case 'usage_clear':
        this.emits(['clear'], tags['msg-id'], data.channel);
        break;

      case 'color_changed':
        this.emits(['color'], data.message, data.channel);
        break;

      case 'turbo_only_color':
      case 'usage_color':
        this.emits(['color'], tags['msg-id'], data.channel);
        break;

      case 'bad_commercial_error':
      case 'usage_commercial':
        this.emits(['commercial'], tags['msg-id'], data.channel);
        break;

      case 'commercial_success':
        this.emits(['commercial'], data.message, data.channel);
        break;

      case 'already_emote_only_off':
      case 'usage_emote_only_off':
        this.emits(['emoteOff'], tags['msg-id'], data.channel);
        break;

      case 'emote_only_off':
        this.emits(['emoteOff'], data.message, data.channel);
        break;

      case 'already_emote_only_on':
      case 'usage_emote_only_on':
        this.emits(['emoteOn'], tags['msg-id'], data.channel);
        break;

      case 'emote_only_on':
        this.emits(['emoteOn'], data.message, data.channel);
        break;

      case 'followers_off':
        this.emits(['followersOff'], data.message, data.channel);
        break;

      case 'usage_followers_off':
        this.emits(['followersOff'], tags['msg-id'], data.channel);
        break;

      case 'followers_on':
      case 'followers_onzero':
        this.emits(['followersOn'], data.message, data.channel);
        break;

      case 'usage_followers_on':
        this.emits(['followersOn'], tags['msg-id'], data.channel);
        break;

      case 'bad_host_error':
      case 'bad_host_hosting':
      case 'bad_host_rate_exceeded':
      case 'bad_host_rejected':
      case 'bad_host_self':
      case 'usage_host':
        this.emits(['host'], tags['msg-id'], data.channel);
        break;

      case 'host_on':
        this.emits(['host'], data.message, data.channel);
        break;

      case 'msg_channel_suspended':
      case 'tos_ban':
        this.emits(['join'], tags['msg-id'], data.channel);
        break;

      case 'bad_mod_banned':
      case 'bad_mod_mod':
      case 'usage_mod':
        this.emits(['mod'], tags['msg-id'], data.channel);
        break;

      case 'mod_success':
        this.emits(['mod'], data.message, data.channel);
        break;

      case 'no_mods':
        this.emits(['mods'], [], data.channel);
        break;

      case 'room_mods':
        this.emits(['mods'], data.message.slice(36).split(', '), data.channel);
        break;

      case 'usage_mods':
        this.emits(['mods'], tags['msg-id'], data.channel);
        break;

      case 'bad_delete_message_broadcaster':
      case 'bad_delete_message_mod':
        this.emits(['purge'], tags['msg-id'], data.channel);
        break;

      case 'delete_message_success':
        this.emits(['purge'], data.message, data.channel);
        break;

      case 'already_r9k_off':
      case 'usage_r9k_off':
        this.emits(['r9kOff'], tags['msg-id'], data.channel);
        break;

      case 'r9k_off':
        this.emits(['r9kOff'], data.message, data.channel);
        break;

      case 'already_r9k_on':
      case 'usage_r9k_on':
        this.emits(['r9kOn'], tags['msg-id'], data.channel);
        break;

      case 'r9k_on':
        this.emits(['r9kOn'], data.message, data.channel);
        break;

      case 'raid_error_already_raiding':
      case 'raid_error_forbidden':
      case 'raid_error_self':
      case 'raid_error_too_many_viewers':
      case 'raid_error_unexpected':
      case 'usage_raid':
        this.emits(['raid'], tags['msg-id'], data.channel);
        break;

      case 'slow_off':
        this.emits(['slowOff'], data.message, data.channel);
        break;

      case 'usage_slow_off':
        this.emits(['slowOff'], tags['msg-id'], data.channel);
        break;

      case 'slow_on':
        this.emits(['slowOn'], data.message, data.channel);
        break;

      case 'bad_slow_duration':
      case 'usage_slow_on':
        this.emits(['slowOn'], tags['msg-id'], data.channel);
        break;

      case 'already_subs_off':
      case 'usage_subs_off':
        this.emits(['subsOff'], tags['msg-id'], data.channel);
        break;

      case 'subs_off':
        this.emits(['subsOff'], data.message, data.channel);
        break;

      case 'already_subs_on':
      case 'usage_subs_on':
        this.emits(['subsOn'], tags['msg-id'], data.channel);
        break;

      case 'subs_on':
        this.emits(['subsOn'], data.message, data.channel);
        break;

      case 'bad_timeout_admin':
      case 'bad_timeout_anon':
      case 'bad_timeout_broadcaster':
      case 'bad_timeout_duration':
      case 'bad_timeout_global_mod':
      case 'bad_timeout_mod':
      case 'bad_timeout_self':
      case 'bad_timeout_staff':
      case 'timeout_no_timeout':
      case 'usage_timeout':
        this.emits(['timeout'], tags['msg-id'], data.channel);
        break;

      case 'timeout_success':
        this.emits(['timeout'], data.message, data.channel);
        break;

      case 'bad_unban_no_ban':
      case 'usage_unban':
        this.emits(['unban'], tags['msg-id'], data.channel);
        break;

      case 'unban_success':
        this.emits(['unban'], data.message, data.channel);
        break;

      case 'bad_unhost_error':
      case 'usage_unhost':
      case 'not_hosting':
        this.emits(['unhost'], tags['msg-id'], data.channel);
        break;

      case 'host_off':
        this.emits(['unhost'], data.message, data.channel);
        break;

      case 'bad_unmod_mod':
      case 'usage_unmod':
        this.emits(['unmod'], tags['msg-id'], data.channel);
        break;

      case 'unmod_success':
        this.emits(['unmod'], data.message, data.channel);
        break;

      case 'unraid_error_no_active_raid':
      case 'unraid_error_unexpected':
      case 'usage_unraid':
        this.emits(['unraid'], tags['msg-id'], data.channel);
        break;

      case 'unraid_success':
        this.emits(['unraid'], data.message, data.channel);
        break;

      case 'untimeout_banned':
      case 'usage_untimeout':
        this.emits(['untimeout'], tags['msg-id'], data.channel);
        break;

      case 'untimeout_success':
        this.emits(['untimeout'], data.message, data.channel);
        break;

      case 'bad_unvip_grantee_not_vip':
      case 'usage_unvip':
        this.emits(['unvip'], tags['msg-id'], data.channel);
        break;

      case 'unvip_success':
        this.emits(['unvip'], data.message, data.channel);
        break;

      case 'bad_vip_achievement_incomplete':
      case 'bad_vip_grantee_already_vip':
      case 'bad_vip_grantee_banned':
      case 'bad_vip_max_vips_reached':
      case 'usage_vip':
        this.emits(['vip'], tags['msg-id'], data.channel);
        break;

      case 'vip_success':
        this.emits(['vip'], data.message, data.channel);
        break;

      case 'no_vips':
        this.emits(['vips'], [], data.channel);
        break;

      case 'vips_success':
        this.emits(['vips'], data.message.slice(27).split(', '), data.channel);
        break;

      case 'usage_vips':
        this.emits(['vips'], tags['msg-id'], data.channel);
        break;

      case 'whisper_banned':
      case 'whisper_banned_recipient':
      case 'whisper_invalid_args':
      case 'whisper_invalid_login':
      case 'whisper_invalid_self':
      case 'whisper_limit_per_min':
      case 'whisper_limit_per_sec':
      case 'whisper_restricted':
      case 'whisper_restricted_recipient':
        this.emits(['whisper'], tags['msg-id'], data.channel);
        break;

      case 'invalid_user':
        this.emits([
          'ban',
          'clear',
          'commercial',
          'emoteOff',
          'emoteOn',
          'followersOff',
          'followersOn',
          'host',
          'mod',
          'r9kOff',
          'r9kOn',
          'raid',
          'slowOff',
          'slowOn',
          'subsOff',
          'subsOn',
          'timeout',
          'unban',
          'unhost',
          'unmod',
          'unraid',
          'untimeout',
          'unvip',
          'vip',
          'whisper'
        ], tags['msg-id'], data.channel);
        break;

      case 'no_permission':
        this.emits([
          'ban',
          'clear',
          'commercial',
          'emoteOff',
          'emoteOn',
          'followersOff',
          'followersOn',
          'host',
          'mod',
          'r9kOff',
          'r9kOn',
          'raid',
          'slowOff',
          'slowOn',
          'subsOff',
          'subsOn',
          'timeout',
          'unban',
          'unhost',
          'unmod',
          'unraid',
          'untimeout',
          'unvip',
          'vip'
        ], tags['msg-id'], data.channel);
        break;

      default:
        break;
    }
  }

  private _part (data: any) {
    // @ts-expect-error
    if (data.user === this.connection.auth.user) {
      this.emits(['part'], '', data.channel);
    }

    this.emit('part', data.channel, data.user);
  }

  private _privmsg (data: any, tags: any) {
    const user = {
      name: data.user,
      tags,
    };

    if (tags.bits !== undefined) {
      this.emit('cheer', data.channel, user, data.message, data.bits);
    } else if (data.message.charCodeAt(0) === 33) {
      const chunks = data.message.split(' ');
      const args = data.message.slice(chunks[0].length + 2);

      this.emit('command', data.channel, user, chunks[0], args);
    } else {
      const action = '\u0001ACTION';

      if (data.message.startsWith(action)) {
        const message = data.message.slice(action.length + 1, data.message.length - 2);
        this.emit('action', data.channel, user, message);
      } else {
        this.emit('chat', data.channel, user, data.message);
      }
    }
  }

  private _roomState (data: any, tags: any) {
    if (tags.length === 1) {
      switch (tags) {
        case 'broadcaster-lang':
          this.emit('language', data.channel, tags['broadcaster-lang']);
          break;

        case 'emote-only':
          this.emit('emoteOnly', data.channel, tags['emote-only']);
          break;

        case 'followers-only':
          this.emit('followersOnly', data.channel, tags['followers-only']);
          break;

        case 'r9k':
          this.emit('r9k', data.channel, tags.r9k);
          break;

        case 'slow':
          this.emit('slow', data.channel, tags.slow);
          break;

        case 'subs-only':
          this.emit('subsOnly', data.channel, tags['subs-only']);
          break;

        default:
          break;
      }
    } else {
      this.emit('roomstate', data.channel, tags);
    }
  }

  private _userNotice (data: any, tags: any) {
    switch (tags['msg-id']) {
      case 'raid':
        this._raid(data, tags);
        break;

      case 'ritual':
        this._ritual(data, tags);
        break;

      case 'sub':
      case 'resub':
        this._sub(data, tags);
        break;

      case 'subgift':
      case 'anonsubgift':
      case 'submysterygift':
      case 'anonsubmysterygift':
        this._subGift(data, tags);
        break;

      case 'giftpaidupgrade':
      case 'anongiftpaidupgrade':
        this._subGiftUpgrade(data, tags);
        break;

      default:
        break;
    }
  }

  private _userState (data: any, tags: any) {
    this.emits(['say'], '', data.channel);
    this.emit('userstate', data.channel, tags);
  }

  private _whisper (data: any) {
    this.emit('whisper', data.from, data.message);
  }

  private _raid (data: any, tags: any) {
    this.emit('raid',
      data.channel,
      {
        name: tags['msg-param-login'],
        display_name: tags['msg-param-displayName']
      },
      tags['msg-param-viewerCount']);
  }

  private _ritual (data: any, tags: any) {
    this.emit('ritual',
      data.channel,
      {
        name: tags.login,
        display_name: tags['display-name']
      },
      tags['msg-param-ritual-name']);
  }

  private _sub (data: any, tags: any) {
    const sub = {
      cumulative: tags['msg-param-cumulative-months'],
      streak: tags['msg-param-streak-months'],
      share_streak: tags['msg-param-should-share-streak'],
      plan: tags['msg-param-sub-plan'],
      plan_name: tags['msg-param-sub-plan-name']
    };

    this.emit('subscription',
      data.channel,
      {
        name: tags.login,
        display_name: tags['display-name'],
        id: tags['user-id']
      },
      data.message,
      sub);
  }

  private _subGift (data: any, tags: any) {
    const sub = {
      months: tags['msg-param-months'],
      plan: tags['msg-param-sub-plan'],
      plan_name: tags['msg-param-sub-plan-name'],
      giftCount: tags['msg-param-mass-gift-count'],
      recipient: {
        name: tags['msg-param-recipient-user-name'],
        display_name: tags['msg-param-recipient-display-name'],
        id: tags['msg-param-recipient-id']
      }
    };

    this.emit('subgift',
      data.channel,
      {
        name: tags.login,
        display_name: tags['display-name'],
        id: tags['user-id']
      },
      sub);
  }

  private _subGiftUpgrade (data: any, tags: any) {
    const sub = {
      gifter: {
        namee: tags['msg-param-recipient-sender-login'],
        display_name: tags['msg-param-sender-name']
      },
      promo: {
        total: tags['msg-param-promo-gift-total'],
        name: tags['msg-param-promo-name']
      }
    };

    this.emit('subgiftupgrade',
      data.channel,
      {
        name: tags.login,
        display_name: tags['display-name'],
        id: tags['user-id']
      },
      sub);
  }

  filterMessage (data: any) {
    let tags: any;

    if (data.tags !== undefined) {
      tags = parser.tags(data.tags);
    }

    switch (data.command) {
      case '372':
        this.emit('connect');
        break;

      case 'CLEARCHAT':
        this._clearChat(data, tags);
        break;

      case 'CLEARMSG':
        this._clearMsg(data, tags);
        break;

      case 'GLOBALUSERSTATE':
        this.emit('globaluserstate', tags);
        break;

      case 'HOSTTARGET':
        this._hostTarget(data);
        break;

      case 'JOIN':
        this._join(data);
        break;

      case 'NOTICE':
        this._notice(data, tags);
        break;

      case 'PART':
        this._part(data);
        break;

      case 'PING':
        // @ts-expect-error
        this.send(`PONG ${data.message}`);
        break;

      case 'PRIVMSG':
        this._privmsg(data, tags);
        break;

      case 'RECONNECT':
        // Reconnect
        break;

      case 'ROOMSTATE':
        this._roomState(data, tags);
        break;

      case 'USERNOTICE':
        this._userNotice(data, tags);
        break;

      case 'USERSTATE':
        this._userState(data, tags);
        break;

      case 'WHISPER':
        this._whisper(data);
        break;
    }
  }
}