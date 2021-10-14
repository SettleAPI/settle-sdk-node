const crypto = require('crypto');
const fs = require('fs');
const debug = require('debug')('settle:handler');
const { format } = require('util');
// eslint-disable-next-line no-unused-vars
const { EventEmitter } = require('events');

const userConfigFile = `${process.cwd()}/config.js`;
const demoConfig = './config/config.js';

// eslint-disable-next-line no-console
console.log(userConfigFile);

let config;
let optVerif;

try {
    if (fs.existsSync(userConfigFile)) {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        config = require(userConfigFile);
        // eslint-disable-next-line no-console
        console.info(`Hooray! You're using the config.js file from your project root; ${userConfigFile}`);
        if (config.environment === 'sandbox') {
            // eslint-disable-next-line max-len
            if (config.authentication.sandbox.priv.length > 100 && config.authentication.sandbox.pub.length > 100) {
                optVerif = config.authentication.sandbox.verif;
            } else {
                throw new Error('Please check your config.js authentication.sandbox.priv/pub settings.');
            }
        } else if (config.environment === 'production') {
            // eslint-disable-next-line max-len
            if (config.authentication.production.priv.length > 100 && config.authentication.production.pub.length > 100) {
                optVerif = config.authentication.production.verif;
            } else {
                throw new Error('Please check your config.js authentication.production.priv/pub settings.');
            }
        } else {
            throw new Error('config.js environment setting must be either "sandbox" or "production"');
        }
    } else {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        config = require(demoConfig);
        // eslint-disable-next-line no-console
        console.warn('You are currently using the demo config file. Please create a "config.js" file in your project root. See https://github.com/SettleAPI/settle-sdk-node for more information');
        optVerif = config.authentication.demo.verif;
    }
} catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
}

// eslint-disable-next-line no-multi-assign,func-names
module.exports = exports = function (environment, callbackUri) {
    // eslint-disable-next-line global-require,import/no-unresolved
    return require('body-parser')
        .json({
            type: 'application/vnd.mcash.api.merchant.v1+json',
            // eslint-disable-next-line no-unused-vars
            verify(req, res, buf, encoding) {
                // eslint-disable-next-line no-console
                // console.log('req is: ', req);
                let err = exports.verifyDigest(req, buf.toString('utf8'));
                if (err) throw new Error(`Digest verification failed: ${err}`);

                err = exports.verifyAuthorization(req, optVerif, callbackUri);
                // eslint-disable-next-line no-console
                // console.log('callbackUri is ', callbackUri);
                if (err) throw new Error(`Authorization verification failed: ${err}`);

                // eslint-disable-next-line no-console
                if (!err) console.log('Authorization verification: OK');
            },
        });
};

// eslint-disable-next-line consistent-return,func-names
exports.verifyDigest = function (req, text) {
    // const header = req.headers['x-mcash-content-digest'];
    const header = req.headers['x-settle-content-digest'];
    if (!header) return 'header missing..';

    // Split "SHA256=abcdefg" by =
    const match = header.match(/^([^=]+)=(.+)$/);
    if (!match) return 'invalid header format';

    const algo = match[1];
    if (algo !== 'SHA256') return 'unexpected algo';

    const expected = match[2];

    debug('digest of %s', text);

    const actual = crypto.createHash('sha256')
        .update(text || '')
        .digest('base64');
    // eslint-disable-next-line no-console
    console.log('expected digest: %s\nactual digest: %s', expected, actual);
    debug('expected: %s\nactual: %s', expected, actual);

    if (actual !== expected) return 'mismatch';
};

// eslint-disable-next-line consistent-return,func-names
exports.verifyAuthorization = function (req, key, callbackUri) {
    const header = req.headers.authorization;
    if (!header) return 'header missing';

    // Split "RSA-SHA256 abcde" by whitespace
    const match = header.match(/^([^ ]+) (.+)$/);
    if (!match) return 'invalid header format';

    const algo = match[1];
    if (algo !== 'RSA-SHA256') return 'unexpected algo';

    const expected = match[2];

    if (!callbackUri) {
        // eslint-disable-next-line no-param-reassign
        // callbackUri = format('%s://%s%s', req.protocol, req.headers.host, req.originalUrl);
        // eslint-disable-next-line no-param-reassign
        callbackUri = format('%s://%s%s', req.headers['x-forwarded-proto'], req.headers.host, req.originalUrl);
        // eslint-disable-next-line no-console
        // console.log('callbackUri is ', callbackUri);
        // console.log('req is ', req);
    }

    // POST|http://server.test/some/resource/|X-Settle-CONTENT-DIGEST=SHA256=oWVxV3hhr8+LfVEYkv57XxW2R1wdhLsrfu3REAzmS7k=&X-Settle-MERCHANT=T9oWAQ3FSl6oeITuR2ZGWA&X-Settle-TIMESTAMP=2013-10-05 21:33:46
    const concat = format('%s|%s|%s',
        req.method,
        callbackUri,
        Object.keys(req.headers)
            // eslint-disable-next-line no-shadow
            .filter((key) => !!key.match(/^x-settle-/))
            .sort()
            // eslint-disable-next-line no-shadow
            .reduce((p, key) => format('%s%s%s=%s',
                p,
                p.length ? '&' : '',
                key.toUpperCase(),
                req.headers[key]), ''));

    debug('concat:\n%s', concat);
    debug('key:\n%s', key);
    debug('expected: %s', expected);

    // eslint-disable-next-line no-console
    console.log('concat:\n%s', concat);

    // eslint-disable-next-line no-console
    console.log('expected auth: %s', expected);

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(concat);

    if (!verifier.verify(key, expected, 'base64')) {
        return 'signature mismatch';
    }
};
