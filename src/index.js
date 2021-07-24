// noinspection ExceptionCaughtLocallyJS

const fs = require('fs');
const SettleRequest = require('./client');

const userConfigFile = `${process.cwd()}/config.js`;
const demoConfig = './config/config.js';

// eslint-disable-next-line no-console
console.log(userConfigFile);

let config;
let optEnv;
let optUser;
let optMerchant;
let optAuthPriv;
let optAuthPub;

try {
  if (fs.existsSync(userConfigFile)) {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    config = require(userConfigFile);
    // eslint-disable-next-line no-console
    console.info(`Hooray! You're using the config.js file from your project root; ${userConfigFile}`);
    optEnv = config.environment;
    optUser = config.user;
    optMerchant = config.merchantId;
    if (config.environment === 'sandbox') {
      // eslint-disable-next-line max-len
      if (config.authentication.sandbox.priv.length > 100 && config.authentication.sandbox.pub.length > 100) {
        optAuthPriv = config.authentication.sandbox.priv;
        optAuthPub = config.authentication.sandbox.pub;
      } else {
        throw new Error('Please check your config.js authentication.sandbox.priv/pub settings.');
      }
    } else if (config.environment === 'production') {
      // eslint-disable-next-line max-len
      if (config.authentication.production.priv.length > 100 && config.authentication.production.pub.length > 100) {
        optAuthPriv = config.authentication.production.priv;
        optAuthPub = config.authentication.production.pub;
      } else {
        throw new Error('Please check your config.js authentication.production.priv/pub settings.');
      }
    } else {
      throw new Error('config.js enviroment setting must be either "sandbox" or "production"');
    }
  } else {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    config = require(demoConfig);
    // eslint-disable-next-line no-console
    console.warn('You are currently using the demo config file. Please create a "config.js" file in your project root. See https://github.com/SettleAPI/settle-sdk-node for more information');
    optEnv = config.environment;
    optUser = config.user;
    optMerchant = config.merchantId;
    optAuthPriv = config.authentication.demo.priv;
    // eslint-disable-next-line no-unused-vars
    optAuthPub = config.authentication.demo.pub;
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
}

const send = new SettleRequest({
  environment: optEnv,
  user: optUser,
  merchantId: optMerchant,
  privateKey: optAuthPriv,
});

const requestPromise = (method, url, requestBody) => new Promise((resolve, reject) => {
  send.request(method, url, { payload: requestBody })
    .end((err, res) => {
      // (res.ok === true) ? resolve(settle.callback.success) : reject(settle.callback.failure);
      const response = {};
      if (res && res.ok && res.ok === true) {
        try {
          response.status = 'Success';
          response.status_code = res.res.statusCode;
          response.status_message = res.res.statusMessage;
          response.content = res.res.text;
          resolve(response);
          // eslint-disable-next-line no-shadow
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      } else if (res && res.ok && res.ok !== true) {
        try {
          response.status = 'Failure';
          response.status_code = res.statusCode;
          if (res.clientError) response.type = 'clientError';
          if (res.serverError) response.type = 'serverError';
          if (err) response.errorDetails.message = err;
          if (res.res.statusMessage) response.statusMessage = res.res.statusMessage;

          response.errorDetails = {
            type: response.type,
            description: res.text,
            status: res.error.status,
            method: res.error.method,
            path: res.error.path,
          };
          reject(response);
          // eslint-disable-next-line no-shadow
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      } else {
        try {
          response.status = 'Failure';
          response.status_code = res.statusCode;
          if (res.clientError) response.type = 'clientError';
          if (res.serverError) response.type = 'serverError';
          if (err) response.errorDetails.message = err;
          if (res.res.statusMessage) response.statusMessage = res.res.statusMessage;

          response.errorDetails = {
            type: response.type,
            description: res.text,
            status: res.error.status,
            method: res.error.method,
            path: res.error.path,
          };
          reject(response);
          // eslint-disable-next-line no-shadow
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }
    });
});

const settle = {};
settle.merchant = settle.merchant || {};
exports.settle = settle;

settle.merchant = {
  payment: {
    request: {
      create(content) {
        return requestPromise('POST', 'payment_request/', content)
          .then((result) => result, (error) => error);
      },
      list() {
        return requestPromise('GET', 'payment_request/')
          .then((result) => result, (error) => error);
      },
    },
  },
  api_keys: {
    create(content) {
      return requestPromise('POST', 'api_key/', content)
        .then((result) => result, (error) => error);
    },
    list() {
      return requestPromise('GET', 'api_key/')
        .then((result) => result, (error) => error);
    },
    get(apiKeyId, content) {
      return requestPromise('GET', `api_key/${apiKeyId}/`, content)
        .then((result) => result, (error) => error);
    },
    update(apiKeyId, content) {
      return requestPromise('PUT', `api_key/${apiKeyId}/`, content)
        .then((result) => result, (error) => error);
    },
    delete() {
    },
  },
};

exports.merchant = settle.merchant;
