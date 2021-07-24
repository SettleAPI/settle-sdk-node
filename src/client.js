const superagent = require('superagent');
const crypto = require('crypto');
const debug = require('debug')('settle');
const { format } = require('util');
const lodash = require('lodash');
const parseUrl = require('url').parse;

const ACCEPT = 'application/vnd.mcash.api.merchant.v1+json';
const CONTENT_TYPE = 'application/json';

superagent.parse[CONTENT_TYPE] = superagent.parse['application/json'];

// eslint-disable-next-line no-multi-assign,func-names
const Settle = module.exports = exports = function (opts) {
    this.opts = opts;
};

exports.ENDPOINTS = {
    production: 'https://api.settle.eu/merchant/v1/',
    sandbox: 'https://api.sandbox.settle.eu/merchant/v1/',
};

function settleTimestamp() {
    return new Date().toISOString()
        .replace(/T/, ' ')
        .substr(0, 19);
}

// eslint-disable-next-line func-names
Settle.prototype.request = function (type, url, opts) {
    const fn = superagent[type.toLowerCase()];

    // eslint-disable-next-line no-param-reassign
    opts = lodash.extend({
        payload: null,
    }, opts);

    let request = fn(exports.ENDPOINTS[this.opts.environment] + url)
        .buffer(true)
        .parse(superagent.parse.json)
        .set('Accept', ACCEPT)
        .set('X-Settle-Merchant', this.opts.merchantId)
        .set('X-Settle-User', this.opts.user);

    if (this.opts.secret) {
        request = request
            .set('Authorization', `SECRET ${this.opts.secret}`);
    } else if (this.opts.privateKey) {
    // console.log(opts.payload)
        const payload = opts.payload ? JSON.stringify(opts.payload) : '';
        debug('payload (post data) is: %s', payload || '<none>');
        const digest = crypto.createHash('sha256')
            .update(payload)
            .digest('base64');

        request = request
            .set('X-Settle-Timestamp', settleTimestamp())
            .set('X-Settle-Content-Digest', `SHA256=${digest}`);

        // eslint-disable-next-line no-unused-vars
        const parsedUrl = parseUrl(request.url);

        const concat = format('%s|%s|%s',
            request.method,
            request.url,
            Object.keys(request.req.getHeaders())
                .filter((key) => !!key.match(/^x-settle-/))
                .sort()
                .reduce((p, key) => format('%s%s%s=%s',
                    p,
                    p.length ? '&' : '',
                    key.toUpperCase(),
                    request.req.getHeaders()[key]), ''));

        // console.log(concat)

        const sign = crypto.createSign('RSA-SHA256')
            .update(concat)
            .sign(this.opts.privateKey, 'base64');

        if (!sign) {
            throw new Error('Unable to sign. Bad private key?');
        }

        debug('will sign with private key:\n%s', concat);

        debug('signature:\n%s', sign);

        request = request
            .set('Authorization', `RSA-SHA256 ${sign}`);
    }

    if (opts.payload) {
        request = request.send(opts.payload);
    }

    debug('all headers, for debugging:\n%s', Object.keys(request.req.getHeaders())
        .map((key) => `\t${key}: ${request.req.getHeaders()[key]}`)
        .join('\n'));

    return request;
};

exports.handler = require('./handler');
