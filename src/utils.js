import jwt from 'jsonwebtoken';
import decamelize from 'decamelize';

/**
 * Utilities for Serverless Authentication
 */
export class Utils {
  /**
   * Creates redirectUrl
   * @param url {string} url base
   * @param provider {string} provider e.g. facebook
   */
  static redirectUrlBuilder(url, provider) {
    return url.replace(/{provider}/g, provider);
  }

  /**
   * Creates url with params
   * @param url {string} url base
   * @param params {object} url params
   */
  static urlBuilder(url, params) {
    return `${url}?${this.urlParams(params)}`;
  }

  /**
   * Creates &amp; separated params string
   * @param params {object}
   */
  static urlParams(params) {
    const result = [];
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        result.push(`${decamelize(key)}=${params[key]}`);
      }
    }
    return result.join('&');
  }

  /**
   * Creates Json Web Token with data
   * @param data {object}
   * @param config {object} with token_secret --> change to secret
   */
  static createToken(data, secret, options) {
    return jwt.sign(data, secret, options);
  }

  /**
   * Reads Json Web Token and returns object
   * @param token {string}
   * @param config {object} with token_secret --> change to secret
   */
  static readToken(token, secret, options) {
    return jwt.verify(token, secret, options);
  }

  /**
   * Creates token response and triggers callback
   * @param data {payload: object, options: object}
   * @param config {redirect_client_uri {string}, token_secret {string}}
   * @param callback {function} callback function e.g. context.done
   */
  static tokenResponse(data, { redirect_client_uri, token_secret }, callback) {
    const { payload, options } = data.authorizationToken;
    const params = {
      authorizationToken: this.createToken(payload, token_secret, options)
    };

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key !== 'authorizationToken') {
          params[key] = data[key];
        }
      }
    }

    const url = this.urlBuilder(redirect_client_uri, params);
    return callback(null, { url });
  }

  /**
   * Creates error response and triggers callback
   * @param params
   * @param config {redirect_client_uri {string}}
   * @param callback {function} callback function e.g. context.done
   */
  static errorResponse(params, { redirect_client_uri }, callback) {
    const url = this.urlBuilder(redirect_client_uri, params);
    return callback(null, { url });
  }

  /**
   * Generates Policy for AWS Api Gateway custom authorize
   * @param principalId {string} data for principalId field
   * @param effect {string} 'Allow' or 'Deny'
   * @param resource {string} method arn e.g. event.methodArn
   *  (arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>)
   */
  static generatePolicy(principalId, effect, resource) {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
      const policyDocument = {};
      policyDocument.Version = '2012-10-17';
      policyDocument.Statement = [];

      const statementOne = {};
      statementOne.Action = 'execute-api:Invoke';
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
    }
    return authResponse;
  }
}
