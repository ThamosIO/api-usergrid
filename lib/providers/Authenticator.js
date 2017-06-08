import crypto from 'crypto';
import qs from 'querystring';
import bluebird from 'bluebird';
import request from 'co-request';

import conf from './config.json';

const userAgentFormatter = () => `web:${conf.client_id}:1.0.0 (by /u/powderedsugah)`;

export default class Authenticator {
  constructor(config) {
    this.config = config;
  }

  connect() {
    return () => {
      const { url, client_id, redirect_uri, response_type, scope } = this.config;
      const query = {
        client_id,
        redirect_uri,
        response_type,
        scope,
      };

      query.state = crypto.randomBytes(64).toString('base64');

      return url + qs.stringify(query);
    };
  }

  signIn(code) {
    return bluebird.coroutine(function* (code, config) {
      const {
        access_token_url,
        redirect_uri,
        grant_type,
        client_id,
        client_secret,
      } = config;
      const form = { redirect_uri, grant_type, code };
      const auth = { username: client_id, password: client_secret };
      const headers = {
        name: 'content-type',
        value: 'application/x-www-form-urlencoded',
      };

      const { body } = yield request(access_token_url, {
        method: 'POST',
        form,
        auth,
        headers,
      });

      return JSON.parse(body).access_token;
    })(code, this.config);
  }

  getUser(access_token) {
    return bluebird.coroutine(function* (access_token, config) {
      const opts = {
        url: config.me_url,
        headers: {
          Authorization: `Bearer ${access_token}`,
          'User-Agent': userAgentFormatter(),
        },
      };

      const { body } = yield request(opts);

      return JSON.parse(body);
    })(access_token, this.config);
  }
}
