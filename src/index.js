const fs = require('fs');
const SettleRequest = require('./client');

const userConfigFile = `${process.cwd()}/config.js`;
const demoConfig = './config/config.js';

console.log(userConfigFile);

let config;
let optEnv;
let optUser;
let optMerchant;
let optAuthPriv;
let optAuthPub;

try {
  if (fs.existsSync(userConfigFile)) {
    const configFile = require(userConfigFile);
    config = configFile;
    console.info(`Hooray! You\'re using the config.js file from your project root; ${userConfigFile}`);
    optEnv = config.environment;
    optUser = config.user;
    optMerchant = config.merchantId;
    if (config.environment === 'sandbox') {
      optAuthPriv = config.authentication.sandbox.priv;
      optAuthPub = config.authentication.sandbox.pub;
    } else {
      optAuthPriv = config.authentication.production.priv;
      optAuthPub = config.authentication.production.pub;
    }
  } else {
    const configFile = require(demoConfig);
    config = configFile;
    console.warn('You are currently using the demo config file. Please create a "config.js" file in your project root. See https://github.com/SettleAPI/settle-sdk-node for more information');
    optEnv = config.environment;
    optUser = config.user;
    optMerchant = config.merchantId;
    optAuthPriv = config.authentication.demo.priv;
    optAuthPub = config.authentication.demo.pub;
  }
} catch (err) {
  console.error(err);
}

const send = new SettleRequest({
  environment: optEnv,
  user: optUser,
  merchantId: optMerchant,
  privateKey: optAuthPriv
});

const request_promise = (method, url, request_body) => {
  const promise = new Promise((resolve, reject) => {
    send.request(method, url, { payload: request_body })
      .end((err, res) => {
        // (res.ok === true) ? resolve(settle.callback.success) : reject(settle.callback.failure);
        let response = {};
        if (res.ok === true) {
          try {
            response.status = 'Success';
            response.status_code = res.res.statusCode;
            response.status_message = res.res.statusMessage;
            response.content = res.res.text;
            // response.content = res.text;
            // console.log(res)

            resolve(response);
            response = {};
          } catch (err) {
            console.error(err);
          }
        } else if (res.ok !== true) {
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
              path: res.error.path
            };
            // throw new Error("Something is wrong!");// No reject call
            // console.log(res)
            reject(response);
            response = {};
            return response;
          } catch (err) {
            console.error(err);
          }
        }
      });
  });
  return promise;
};

const settle = {};
settle.merchant = settle.merchant || {};
exports.settle = settle;

settle.merchant = {
  payment: {
    request: {
      create(content) {
        return request_promise('POST', 'payment_request/', content)
          .then(result => result, error => error);
      },
      list() {
        return request_promise('GET', 'payment_request/')
          .then(result => result, error => error);
      }
    }
  },
  api_keys: {
    create(content) {
      return request_promise('POST', 'api_key/', content)
        .then(result => result, error => error);
    },
    list() {
      return request_promise('GET', 'api_key/')
        .then(result => result, error => error);
    },
    get(api_key_id, content) {
      return request_promise('GET', `api_key/${api_key_id}/`, content)
        .then(result => result, error => error);
    },
    update(api_key_id, content) {
      return request_promise('PUT', `api_key/${api_key_id}/`, content)
        .then(result => result, error => error);
    },
    delete() {
    },
  }
};

exports.merchant = settle.merchant;
