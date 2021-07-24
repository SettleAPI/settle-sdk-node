# Settle SDK for Node.js

[![Build Status](https://travis-ci.com/SettleAPI/settle-sdk-node.svg?branch=master)](https://travis-ci.com/SettleAPI/settle-sdk-node) [![dependencies Status](https://david-dm.org/SettleAPI/settle-sdk-node/status.svg)](https://david-dm.org/SettleAPI/settle-sdk-node) [![devDependencies Status](https://david-dm.org/SettleAPI/settle-sdk-node/dev-status.svg)](https://david-dm.org/SettleAPI/settle-sdk-node?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Start accepting payments via Settle in seconds** ✨

An easy to use **SDK** for **Node.js** with all the best practices to kickstart your integration with the **Settle Payment Platform**.

## Features

* **Requests** - Simplifies calling the Settle APIs by handling signing and authorization.
* ~~**Verifications** - _Express.js_ compatible middleware that verifies signatures of incoming callbacks.~~

## Functions

### Available Now

- [merchant.api_keys](https://settle.dev/api/reference/rest/v1/merchant.apiKeys/)
  
### Coming Soon

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

## Example

```js
const settle = require('settle-sdk-node');
const merchant = settle.merchant;

// Available parameters: https://settle.dev/api/reference/rest/v1/merchant.apiKeys/list/
merchant.api_keys.list()
  .then((success) => {
    console.log(success);
  }, (failure) => {
    console.log(failure);
  });
```

## License

MIT © Christian Wick
