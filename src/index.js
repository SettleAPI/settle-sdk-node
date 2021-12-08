// noinspection ExceptionCaughtLocallyJS

const fs = require('fs');
const SettleRequest = require('./client');
const { handler } = require('./client');

exports.handler = handler;

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
        // eslint-disable-next-line no-console
        console.log('Environment is: ', optEnv);
        optUser = config.user;
        optMerchant = config.merchantId;
        if (optEnv === 'sandbox' || optEnv === 'production') {
            if (optEnv === 'sandbox') {
                // eslint-disable-next-line max-len
                if (config.authentication.sandbox.priv.length > 100 && config.authentication.sandbox.pub.length > 100) {
                    optAuthPriv = config.authentication.sandbox.priv;
                    optAuthPub = config.authentication.sandbox.pub;
                } else {
                    throw new Error('Please check your config.js authentication.sandbox.priv/pub settings.');
                }
            } else if (optEnv === 'production') {
                // eslint-disable-next-line max-len
                if (config.authentication.production.priv.length > 100 && config.authentication.production.pub.length > 100) {
                    optAuthPriv = config.authentication.production.priv;
                    optAuthPub = config.authentication.production.pub;
                } else {
                    throw new Error('Please check your config.js authentication.production.priv/pub settings.');
                }
            }
        } else if (optEnv === 'qa') {
            // eslint-disable-next-line max-len
            if (config.authentication.qa.priv.length > 100 && config.authentication.qa.pub.length > 100) {
                optAuthPriv = config.authentication.qa.priv;
                optAuthPub = config.authentication.qa.pub;
            } else {
                throw new Error('Please check your config.js authentication.qa.priv/pub settings.');
            }
        } else {
            throw new Error(`Your config.js environment is currently set to '${optEnv}'. Valid options are 'sandbox' or 'production'.`);
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

        // eslint-disable-next-line no-console
        console.log('priv key: ', optAuthPriv);
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
            const response = {};
            const failure = () => {
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
                    throw new Error(err);
                }
            };

            if (res && res.ok && res.ok === true) {
                try {
                    response.status = 'Success';
                    response.status_code = res.res.statusCode;
                    response.status_message = res.res.statusMessage;
                    response.content = res.res.text;
                    resolve(response);
                    // eslint-disable-next-line no-shadow
                } catch (err) {
                    throw new Error(err);
                }
            } else if (res && res.ok && res.ok !== true) {
                failure();
            } else {
                failure();
            }
        });
});

const settle = {};

settle.merchant = settle.merchant || {
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
        delete(apiKeyId) {
            return requestPromise('DELETE', `api_key/${apiKeyId}/`)
                .then((result) => result, (error) => error);
        },
    },
    balance: {
        get(merchantId) {
            return requestPromise('GET', `merchant/${merchantId}/balance/`)
                .then((result) => result, (error) => error);
        },
    },
    logo: {
        get(merchantId) {
            return requestPromise('GET', `merchant/${merchantId}/logo/`)
                .then((result) => result, (error) => error);
        },
    },
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
            get(tid) {
                return requestPromise('GET', `payment_request/${tid}/`)
                    .then((result) => result, (error) => error);
            },
            update(tid, content) {
                return requestPromise('PUT', `payment_request/${tid}/`, content)
                    .then((result) => result, (error) => error);
            },
            outcome: {
                get(tid) {
                    return requestPromise('GET', `payment_request/${tid}/outcome/`)
                        .then((result) => result, (error) => error);
                },
            },
        },
        send: {
            create(content) {
                return requestPromise('POST', 'payment/', content)
                    .then((result) => result, (error) => error);
            },
            outcome: {
                get(tid) {
                    return requestPromise('GET', `payment/${tid}/`)
                        .then((result) => result, (error) => error);
                },
            },
        },
        capture(tid, cur, amo, adamo) {
            return requestPromise('PUT', `payment_request/${tid}/`, {
                action: 'capture',
                currency: cur,
                amount: amo,
                additional_amount: adamo,
                capture_id: `cap_${tid}`,
            })
                .then((result) => result, (error) => error);
        },
        refund(tid, cur, amo, adamo, message) {
            return requestPromise('PUT', `payment_request/${tid}/`, {
                action: 'refund',
                currency: cur,
                amount: amo,
                additional_amount: adamo,
                refund_id: `cap_${tid}`,
                text: message,
            })
                .then((result) => result, (error) => error);
        },
    },
    pos: {
        create(content) {
            return requestPromise('POST', 'pos/', content)
                .then((result) => result, (error) => error);
        },
        list() {
            return requestPromise('GET', 'pos/')
                .then((result) => result, (error) => error);
        },
        get(posId) {
            return requestPromise('GET', `pos/${posId}/`)
                .then((result) => result, (error) => error);
        },
        update(posId, content) {
            return requestPromise('PUT', `pos/${posId}/`, content)
                .then((result) => result, (error) => error);
        },
        delete(posId) {
            return requestPromise('DELETE', `pos/${posId}/`)
                .then((result) => result, (error) => error);
        },
    },
    profile: {
        get(merchantId) {
            return requestPromise('GET', `merchant/${merchantId}/`)
                .then((result) => result, (error) => error);
        },
        lookup(merchantId) {
            return requestPromise('GET', `merchant_lookup/${merchantId}/`)
                .then((result) => result, (error) => error);
        },
    },
    sales: {
        summary: {
            get() {
                return requestPromise('GET', 'sales_summary/')
                    .then((result) => result, (error) => error);
            },
        },
    },
    settlement: {
        list() {
            return requestPromise('GET', 'settlement/')
                .then((result) => result, (error) => error);
        },
        get(settlementId) {
            return requestPromise('GET', `settlement/${settlementId}/`)
                .then((result) => result, (error) => error);
        },
        account: {
            get(settlementAccountId) {
                return requestPromise('GET', `settlement_account/${settlementAccountId}/`)
                    .then((result) => result, (error) => error);
            },
            update(settlementAccountId, content) {
                return requestPromise('PUT', `settlement_account/${settlementAccountId}/`, content)
                    .then((result) => result, (error) => error);
            },
        },
        latest: {
            get() {
                return requestPromise('GET', 'last_settlement/')
                    .then((result) => result, (error) => error);
            },
        },
        report: {
            get() {
                return requestPromise('GET', 'settlement_report/')
                    .then((result) => result, (error) => error);
            },
        },
    },
    shortlink: {
        create(content) {
            return requestPromise('POST', 'shortlink/', content)
                .then((result) => result, (error) => error);
        },
        list() {
            return requestPromise('GET', 'shortlink/')
                .then((result) => result, (error) => error);
        },
        get(shortlinkId) {
            return requestPromise('GET', `shortlink/${shortlinkId}/`)
                .then((result) => result, (error) => error);
        },
        update(shortlinkId, content) {
            return requestPromise('PUT', `shortlink/${shortlinkId}/`, content)
                .then((result) => result, (error) => error);
        },
        delete(shortlinkId) {
            return requestPromise('DELETE', `shortlink/${shortlinkId}/`)
                .then((result) => result, (error) => error);
        },
    },
    statusCodes: {
        list() {
            return requestPromise('GET', 'status_code/')
                .then((result) => result, (error) => error);
        },
        get(statusCodeId) {
            return requestPromise('GET', `status_code/${statusCodeId}/`)
                .then((result) => result, (error) => error);
        },
    },
};

settle.oauth = settle.oauth || {
    auth: {
        code: {},
        request: {},
        token: {},
    },
    error: {},
    qrImage: {},
    user: {
        info: {},
    },
};

// settle.permissions = settle.permissions || {
//     users: {
//         permissions: {
//             request: {
//                 outcome: {}
//             },
//             scope: {}
//         }
//     }
// };

settle.permission = settle.permission || {
    request: {
        create(content) {
            return requestPromise('POST', 'permission_request/', content)
                .then((result) => result, (error) => error);
        },
        get(rid) {
            return requestPromise('GET', `permission_request/${rid}/`)
                .then((result) => result, (error) => error);
        },
    },
};

exports.merchant = settle.merchant;
exports.oauth = settle.oauth;
exports.permission = settle.permission;

// note
