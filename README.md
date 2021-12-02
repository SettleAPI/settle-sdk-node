# Node.js SDK for connecting to the Settle Payment Platform

[![License](https://img.shields.io/badge/license-Apache%202-brightgreen.svg)](https://github.com/daniel-zahariev/music-codes/blob/master/COPYING)
[![Build Status](https://travis-ci.com/SettleAPI/settle-sdk-node.svg?branch=master)](https://travis-ci.com/SettleAPI/settle-sdk-node) [![dependencies Status](https://david-dm.org/SettleAPI/settle-sdk-node/status.svg)](https://david-dm.org/SettleAPI/settle-sdk-node) [![devDependencies Status](https://david-dm.org/SettleAPI/settle-sdk-node/dev-status.svg)](https://david-dm.org/SettleAPI/settle-sdk-node?type=dev)

**Start accepting payments via Settle in seconds** ✨

An easy to use **SDK** for **Node.js** with all the best practices to kickstart your integration with the **Settle Payment Platform**.

## Features

This SDK is divided into two parts:

* **Client** - Simplifies calling the Settle APIs by handling signing and authorization.
* **Handler** - [Express.js](https://expressjs.com/) compatible middleware that verifies signatures of incoming callbacks from Settle.

## Client Functions

### Merchant API - Available Now
- [merchant.api_keys](https://settle.dev/api/reference/rest/v1/merchant.apiKeys/)
- [merchant.balance](https://settle.dev/api/reference/rest/v1/merchant.balance/)
- [merchant.logo](https://settle.dev/api/reference/rest/v1/merchant.logo/)
- [merchant.payment.request](https://settle.dev/api/reference/rest/v1/merchant.payment.request/)
- [merchant.payment.request.outcome](https://settle.dev/api/reference/rest/v1/merchant.payment.request.outcome/)
- [merchant.payment.send](https://settle.dev/api/reference/rest/v1/merchant.payment.send/)
- [merchant.payment.send.outcome](https://settle.dev/api/reference/rest/v1/merchant.payment.send.outcome/)
- [merchant.pos](https://settle.dev/api/reference/rest/v1/merchant.pos/)
- [merchant.profile](https://settle.dev/api/reference/rest/v1/merchant.profile/)
- [merchant.sales.summary](https://settle.dev/api/reference/rest/v1/merchant.sales.summary/)
- [merchant.settlement](https://settle.dev/api/reference/rest/v1/merchant.settlement/)
- [merchant.settlement.account](https://settle.dev/api/reference/rest/v1/merchant.settlement.account/)
- [merchant.settlement.latest](https://settle.dev/api/reference/rest/v1/merchant.settlement.latest/)
- [merchant.settlement.report](https://settle.dev/api/reference/rest/v1/merchant.settlement.report/)
- [merchant.shortlink](https://settle.dev/api/reference/rest/v1/merchant.shortlink/)
- [merchant.statusCodes](https://settle.dev/api/reference/rest/v1/merchant.statusCodes/)

### OAuth 2.0 Authorization Framework - Coming Soon

- [oauth2.auth.code](https://settle.dev/api/reference/rest/v1/oauth2.auth.code/)
- [oauth2.auth.request](https://settle.dev/api/reference/rest/v1/oauth2.auth.request/)
- [oauth2.auth.token](https://settle.dev/api/reference/rest/v1/oauth2.auth.token/)
- [oauth2.error](https://settle.dev/api/reference/rest/v1/oauth2.error/)
- [oauth2.qrImage](https://settle.dev/api/reference/rest/v1/oauth2.qrImage/)
- [oauth2.user.info](https://settle.dev/api/reference/rest/v1/oauth2.user.info/)

### Permissions API - Coming Soon
- [users.permissions](https://settle.dev/api/reference/rest/v1/users.permissions/)
- [users.permissions.request](https://settle.dev/api/reference/rest/v1/users.permissions.request/)
- [users.permissions.request.outcome](https://settle.dev/api/reference/rest/v1/users.permissions.request.outcome/)
- [users.permissions.scope](https://settle.dev/api/reference/rest/v1/users.permissions.scope/)


## Installation

`npm i settle-sdk-node`

## Config

In your projects  **root folder**, create a file named `config.js` containing the following code:

```js
module.exports = {
    environment: string, // 'sandbox' or 'production'
    user: string, // can be obtained by contacting Settle
    merchantId: string, // can be obtained by contacting Settle
    authentication: {
        sandbox: {
            priv: string, // RSA Private Key
            pub: string // RSA Public Key
        },
        production: {
            priv: string, // RSA Private Key
            pub: string // RSA Public Key
        }
    }
}
```

## Usage

```js
merchant.api_keys.list().then(success, failure)
```

## Client Example

```js
const settle = require('settle-sdk-node');
const merchant = settle.merchant;

merchant.api_keys.list()
  .then((success) => {
    console.log(success);
  }, (failure) => {
    throw new Error(failure)
  });
```

## Handler Example

```js
const { handler } = require('settle-sdk-node')
app.use(handler('sandbox'))
app.post( '/', ( req, res, next ) => {
    console.log( 'Settle says:\n%s', req.body );
    res.sendStatus( 200 );
});
```

## Open Source and Contribution

The **SDK** is **Open Source**, licensed under the **Apache 2** license. If you would like to **contribute** to the **SDK**, please feel free to **fork the repo and send us a pull request**. Or if you have a comment, question, or suggestion for improvements, please [raise an issue](https://github.com/SettleAPI/settle-sdk-node/issues).

### License
[Apache 2](https://github.com/SettleAPI/settle-sdk-node/blob/master/LICENSE) © [Settle Group](https://settle.eu/) / [Christian Wick](mailto:christian@settle.eu)

