import Socket from './Socket';

export default class Client extends Socket {
  commands: any;

  constructor () {
    super();
  
    this.commands = {};
  }

  addCommand (name: string, access: any, func: any) {
    this.commands[name] = {
      access,
      func
    };
  }

  getChannels () {
    return this.channels;
  }

  inChannel (channel: string) {
    return this.channels.includes(channel);
  }

  sendCommand (channel: string, command: string, event: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected() === false) {
        reject(new Error(`Connection to ${this.connection.host} required.`));
      }

      if (this.inChannel(channel) === false && command.toLowerCase() !== 'join') {
        reject(new Error(`Must be in channel #${channel} to send a command.`));
      }

      this.once(`${event}.${channel}`, (response) => {
        if (response.error !== undefined) {
          reject(new Error(response.error));
        }

        resolve(response.data);
      });

      switch (command.toLowerCase()) {
        case 'join':
          this.send(`JOIN #${channel}`);
          break;

        case 'part':
          this.send(`PART #${channel}`);
          break;

        default:
          this.send(`PRIVMSG #${channel} :${command}`);
          break;
      }
    });
  }

  async action (channel: string, message: string): Promise<void> {
    return this.sendCommand(channel, `.me ${message}`, 'action');
  }

  async announce (channel: string, message: string, highlight: string = ''): Promise<void> {
    return this.sendCommand(channel, `.announce${highlight} ${message}`, 'announce');
  }
  
  async ban (channel: string, user: string, reason: string = 'None provided'): Promise<void> {
    return this.sendCommand(channel, `.ban ${user} ${reason}`, 'ban');
  }
  
  async clear (channel: string): Promise<void> {
    return this.sendCommand(channel, '.clear', 'clear');
  }
  
  async color (newColor: string): Promise<void> {
    return this.sendCommand(this.channels[0], `.color ${newColor}`, 'color');
  }
  
  async commercial (channel: string, duration: number = 30): Promise<void> {
    return this.sendCommand(channel, `.commercial ${duration}`, 'commercial');
  }
  
  async emoteOnly (channel: string, toggle: boolean): Promise<void> {
    return this.sendCommand(
      channel,
      (toggle ? '.emoteonly' : '.emoteonlyoff'),
      (toggle ? 'emoteOn' : 'emoteOff'),
    );
  }
  
  async followersOnly (channel: string, toggle: boolean, duration: number = 0): Promise<void> {
    return this.sendCommand(
      channel,
      (toggle ? `.followers ${duration}` : '.followersoff'),
      (toggle ? 'followersOn' : 'followersOff'),
    );
  }
  
  async host (channel: string, target: string): Promise<void> {
    return this.sendCommand(channel, `.host ${target}`, 'host');
  }
  
  async joinChannel (channel: string): Promise<void> {
    return this.sendCommand(channel, 'JOIN', 'join');
  }
  
  async mod (channel: string, user: string): Promise<void> {
    return this.sendCommand(channel, `.mod ${user}`, 'mod');
  }
  
  async mods (channel: string): Promise<void> {
    return this.sendCommand(channel, '.mods', 'mods');
  }
  
  async partChannel (channel: string): Promise<void> {
    return this.sendCommand(channel, 'PART', 'part');
  }
  
  async purge (channel: string, messageId: string): Promise<void> {
    return this.sendCommand(channel, `.delete ${messageId}`, 'purge');
  }
  
  async r9k (channel: string, toggle: boolean): Promise<void> {
    return this.sendCommand(
      channel,
      (toggle ? 'r9kbeta' : '.r9kbetaoff'),
      (toggle ? 'r9kOn' : 'r9kOff'),
    );
  }
  
  async raid (channel: string, target: string): Promise<void> {
    return this.sendCommand(channel, `.raid ${target}`, 'raid');
  }
  
  async say (channel: string, message: string): Promise<void> {
    return this.sendCommand(channel, message, 'say');
  }
  
  async slow (channel: string, toggle: boolean, duration: number = 300): Promise<void> {
    return this.sendCommand(
      channel,
      (toggle ? `.slowon ${duration}` : '.slowoff'),
      (toggle ? 'slowOn' : 'slowOff'),
    );
  }
  
  async subs (channel: string, toggle: boolean): Promise<void> {
    return this.sendCommand(
      channel,
      (toggle ? '.subscribers' : '.subscribersoff'),
      (toggle ? 'subsOn' : 'subsOff'),
    );
  }
  
  async timeout (channel: string, user: string, duration: number = 300, reason: string = 'None provided'): Promise<void> {
    return this.sendCommand(channel, `.timeout ${user} ${duration} ${reason}`, 'timeout');
  }
  
  async unban (channel: string, user: string): Promise<void> {
    return this.sendCommand(channel, `.unban ${user}`, 'unban');
  }
  
  async unhost (channel: string): Promise<void> {
    return this.sendCommand(channel, '.unhost', 'unhost');
  }
  
  async unmod (channel: string, user: string): Promise<void> {
    return this.sendCommand(channel, `.unmod ${user}`, 'unmod');
  }
  
  async unraid (channel: string): Promise<void> {
    return this.sendCommand(channel, '.unraid', 'unraid');
  }
  
  async untimeout (channel: string, user: string): Promise<void> {
    return this.sendCommand(channel, `.untimeout ${user}`, 'untimeout');
  }
  
  async unvip (channel: string, user: string): Promise<void> {
    return this.sendCommand(channel, `.unvip ${user}`, 'unvip');
  }
  
  async vip (channel: string, user: string): Promise<void> {
    return this.sendCommand(channel, `.vip ${user}`, 'vip');
  }
  
  async vips (channel: string): Promise<void> {
    return this.sendCommand(channel, '.vips', 'vips');
  }
  
  async whisper (user: string, message: string): Promise<void> {
    return this.sendCommand(this.channels[0], `.w ${user} ${message}`, 'whisper');
  }
}
