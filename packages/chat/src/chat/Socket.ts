import WebSocket from 'ws';
import { RateLimiter } from 'limiter';
import EventManager from './EventManager';
import * as parser from './Parser';

interface ChatAuthentication {
  user: string,
  token: string,
  rateLimit: {
    joins: number,
    messages: number,
  },
  development?: boolean,
}

export default class Socket extends EventManager {
  private ws: any;
  connection: any;
  joinLimiter: any;
  messageLimiter: any;
  channels: string[];

  constructor () {
    super();

    this.ws = null;

    // Holds the list of channels joined
    this.channels = [];
  }

  private bindListeners (): void {
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }

  private onOpen (): void {
    this.send('CAP REQ :twitch.tv/commands twitch.tv/membership twitch.tv/tags');
    this.send(`PASS ${this.connection.auth.token}`);
    this.send(`NICK ${this.connection.auth.user}`);
  }

  private onClose (): void {
    this.emit('disconnect');
    this.ws = null;
  }

  private onMessage (response: any): void {
    if (this.inDevelopment() === true) {
      this.emit('debug', response.data);
    }

    const messages = response.data.split('\r\n');

    messages.forEach((message: string) => {
      const parsedMessage = parser.message(message);
      this.filterMessage(parsedMessage);
    });
  }

  private onError (): void {
    this.ws = null;
  }

  isConnected (): boolean {
    if (this.ws !== null && this.ws.readyState === WebSocket.OPEN) {
      return true;
    }

    return false;
  }

  private isConnecting (): boolean {
    if (this.ws !== null && this.ws.readyState === WebSocket.CONNECTING) {
      return true;
    }

    return false;
  }

  private inDevelopment (): boolean {
    return this.connection.auth.development;
  }

  connect (authentication: ChatAuthentication): Promise<void> {
    this.connection = {
      auth: authentication,
      host: 'irc-ws.chat.twitch.tv',
    };

    // Sets the join rate limiter, 50 joins per 15 seconds
    this.joinLimiter = new RateLimiter({
      tokensPerInterval: this.connection.auth.rateLimit.joins,
      interval: 10000,
    });

    // Sets the message rate limiter
    this.messageLimiter = new RateLimiter({
      tokensPerInterval: this.connection.auth.rateLimit.messages,
      interval: 30000,
    });

    return new Promise((resolve, reject) => {
      if (this.isConnected() === true) {
        reject(new Error(`Already connected to ${this.connection.host}.`));
      }

      if (this.isConnecting() === true) {
        reject(new Error(`Already connecting to ${this.connection.host}.`));
      }

      this.once('connect', () => {
        resolve();
      });

      this.ws = new WebSocket(`wss://${this.connection.host}`);
      this.bindListeners();
    });
  }

  disconnect (): void {
    this.ws.close();
  }

  async send (data: string): Promise<void> {
    if (this.isConnected() === false) {
      throw new Error(`Connection to ${this.connection.host} required.`);
    }

    switch (data.split(' ')[0]) {
      case 'JOIN':
      case 'PART':
        const remainingJoins = await this.joinLimiter.removeTokens(1);

        if (remainingJoins < 0) {
          throw new Error(`You've reached your rate limit.`);
        }

        this.ws.send(`${data}\r\n`);
        break;

      default:
        const remainingMessages = await this.messageLimiter.removeTokens(1);

        if (remainingMessages < 0) {
          throw new Error(`You've reached your rate limit.`);
        }

        this.ws.send(`${data}\r\n`);
        break;
    }
  }
}
