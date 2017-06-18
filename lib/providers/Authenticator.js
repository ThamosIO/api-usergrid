import crypto from 'crypto';
import qs from 'querystring';
import request from 'co-request';
import conf from './config.json';

const userAgentFormatter = () => `web:${conf.client_id}:1.0.0 (by /u/powderedsugah)`;

export default class Authenticator {
  constructor(config) {
    this.config = config;
  }

  async connect() {
    const { url, client_id, redirect_uri, response_type, scope } = this.config;
    const query = {
      client_id,
      redirect_uri,
      response_type,
      scope,
    };

    query.state = crypto.randomBytes(64).toString('base64');

    return url + qs.stringify(query);
  }

  async signIn(code) {
    const {
      access_token_url,
      redirect_uri,
      grant_type,
      client_id,
      client_secret,
    } = this.config;
    const form = { redirect_uri, grant_type, code };
    const auth = { username: client_id, password: client_secret };
    const headers = {
      name: 'content-type',
      value: 'application/x-www-form-urlencoded',
    };

    const { body } = await request(access_token_url, {
      method: 'POST',
      form,
      auth,
      headers,
    });

    return JSON.parse(body).access_token;
  }

  async getUser(access_token) {
    const opts = {
      url: this.config.me_url,
      headers: {
        Authorization: `Bearer ${access_token}`,
        'User-Agent': userAgentFormatter(),
      },
    };

    const { body } = await request(opts);

    return JSON.parse(body);
  }
}
