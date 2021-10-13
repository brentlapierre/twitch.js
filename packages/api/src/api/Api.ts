import Request, { Auth } from './Request';

export default class Api extends Request {
  auth: Auth;

  constructor () {
    super();
  
    this.auth = {
      clientId: '',
      token: '',
    };
  }

  token (auth: Auth): this {
    this.auth = auth;
    return this;
  }

  async previous (amount?: number): Promise<any> {
    return this.get(
      `${this.pagination.path}?before=${this.pagination.cursor}${amount !== undefined ? `&first=${amount}` : ''}`,
      this.auth,
    );
  }

  async next (amount?: number): Promise<any> {
    return this.get(
      `${this.pagination.path}?after=${this.pagination.cursor}${amount !== undefined ? `&first=${amount}` : ''}`,
      this.auth,
    );
  }

  async createCustomRewards (channel_id: string, data: any): Promise<any> {
    return this.post(
      `channel_points/custom_rewards?broadcaster_id=${channel_id}`,
      this.auth,
      data,
    );
  }

  async deleteCustomReward (channel_id: string, reward_id: string): Promise<any> {
    return this.delete(
      `channel_points/custom_rewards?broadcaster_id=${channel_id}&id=${reward_id}`,
      this.auth,
    );
  }

  async getBitsLeaderboard (): Promise<any> {
    return this.get(
      'bits/leaderboard',
      this.auth,
    );
  }

  async getChannel (channel_id: string): Promise<any> {
    return this.get(
      `channels?broadcaster_id=${channel_id}`,
      this.auth,
    );
  }

  async getChannelEditors (channel_id: string): Promise<any> {
    return this.get(
      `channels/editors?broadcaster_id=${channel_id}`,
      this.auth,
    );
  }

  async getCheermotes (): Promise<any> {
    return this.get(
      'bits/cheermotes',
      this.auth,
    );
  }

  async getCustomRewards (channel_id: string): Promise<any> {
    return this.get(
      `channel_points/custom_rewards?broadcaster_id=${channel_id}`,
      this.auth,
    );
  }

  async startCommercial (channel_id: string, duration: number = 30): Promise<any> {
    return this.post(
      'channels/commercial',
      this.auth,
      {
        'broadcaster_id': channel_id,
        'length': duration,
      },
    );
  }

  async updateChannel (
    channel_id: string,
    game: string = '',
    language: string = '',
    title: string = '',
    delay: number = -1,
  ): Promise<any> {
    const data: any = {
      game_id: game,
      broadcaster_language: language,
      title,
      delay,
    };

    for (const [key, value] of Object.entries(data)) {
      if (value === '' || (key === 'delay' && value === -1)) {
        delete data[key];
      }
    }

    return this.patch(
      `channels?broadcaster_id=${channel_id}`,
      this.auth,
      data,
    );
  }
}
