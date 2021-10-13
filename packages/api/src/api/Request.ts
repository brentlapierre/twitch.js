import got from 'got';

export interface Auth {
  clientId: string,
  token: string,
}

interface Pagination {
  path: string,
  previousCursor: string,
  cursor: string,
  data: any,
}

export default class Request {
  host: any;
  pagination: Pagination;

  constructor () {
    this.host = 'https://api.twitch.tv/helix/';

    this.pagination = {
      path: '',
      previousCursor: '',
      cursor: '',
      data: null,
    };
  }

  async delete (
    path: string,
    auth: Auth,
  ) {
    const { headers, body } = await got.delete(
      this.host + path,
      {
        headers: {
          'Authorization:': `Bearer ${auth.token}`,
          'Client-ID': auth.clientId,
        },
      }
    );
  }

  async get (
    path: string,
    auth: Auth,
  ): Promise<any> {
    const { headers, body } = await got(
      this.host + path,
      {
        headers: {
          'Authorization:': `Bearer ${auth.token}`,
          'Client-ID': auth.clientId,
        },
      }
    ).json();

    this.pagination.path = path;
    this.pagination.previousCursor = this.pagination.cursor;
    this.pagination.cursor = '';
    this.pagination.data = body.data;

    if (Object.prototype.hasOwnProperty.call(body.pagination, 'cursor')) {
      this.pagination.cursor = body.pagination.cursor;
    }

    return body.data;
  }

  async patch (
    path: string,
    auth: Auth,
    data: any,
  ) {
    const { headers, body } = await got.patch(
      this.host + path,
      {
        headers: {
          'Authorization:': `Bearer ${auth.token}`,
          'Client-ID': auth.clientId,
          'Content-Type': 'application/json',
        },
        json: {
          data,
        },
      }
    );
  }

  async post (
    path: string,
    auth: Auth,
    data: any,
  ) {
    const { headers, body } = await got.post(
      this.host + path,
      {
        headers: {
          'Authorization:': `Bearer ${auth.token}`,
          'Client-ID': auth.clientId,
          'Content-Type': 'application/json',
        },
        json: {
          data,
        },
      }
    );
  }
}
