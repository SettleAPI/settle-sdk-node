# Node.js SDK for connecting to the Settle Payment Platform

[![License](https://img.shields.io/badge/license-Apache%202-brightgreen.svg)](https://github.com/SettleAPI/settle-sdk-node/blob/master/LICENSE)
[![Build Status](https://travis-ci.com/SettleAPI/settle-sdk-node.svg?branch=master)](https://travis-ci.com/SettleAPI/settle-sdk-node)

**Start accepting payments via Settle in seconds** ✨

An easy to use **SDK** for **Node.js** with all the best practices to kickstart your integration with the **Settle Payment Platform**.

## Features

### This SDK is divided into two parts:

* **Client** — Simplifies calling the Settle API by handling request signing and authorization.
* **Handler** — [Express.js](https://expressjs.com/) compatible middleware that verifies signatures of incoming callbacks from Settle.

## Usage

### Step 1 — Install the SDK

Add the `settle-sdk-node` NPM package to you project.

```bash
npm i settle-sdk-node
```

### Step 2 — Configure the SDK

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

### Step 3 — Initialize the Handler Function

```js title="Handler Example"
const { handler } = require('settle-sdk-node')
app.use(handler('sandbox'))
app.post( '/', ( req, res, next ) => {
    console.log( 'Settle says:\n%s', req.body );
    res.sendStatus( 200 );
});
```

### Step 4 — Using Client Functions

```js title="Basic Client Function usage"
method.function().then(success, failure)
```
#####
```js title="List all API Keys Example"
const settle = require('settle-sdk-node');
const merchant = settle.merchant;

merchant.api_keys.list()
  .then((success) => {
    console.log(success);
  }, (failure) => {
    throw new Error(failure)
  });
```

> For a full overview of all available **Client Functions**, see our article on [how to use Client Functions in the Settle SDK for Node.js](./ZG9jOjM0ODQwMjA4-using-the-client-functions).


<!-- ### OAuth 2.0 Authorization Framework - Coming Soon

- [oauth2.auth.code](https://settle.dev/api/reference/rest/v1/oauth2.auth.code/)
- [oauth2.auth.request](https://settle.dev/api/reference/rest/v1/oauth2.auth.request/)
- [oauth2.auth.token](https://settle.dev/api/reference/rest/v1/oauth2.auth.token/)
- [oauth2.error](https://settle.dev/api/reference/rest/v1/oauth2.error/)
- [oauth2.qrImage](https://settle.dev/api/reference/rest/v1/oauth2.qrImage/)
- [oauth2.user.info](https://settle.dev/api/reference/rest/v1/oauth2.user.info/) -->


## Open Source and Contribution

The **SDK** is **Open Source**, licensed under the **Apache 2** license. If you would like to **contribute** to the **SDK**, please feel free to **fork the repo and send us a pull request**. Or if you have a comment, question, or suggestion for improvements, please [raise an issue](https://github.com/SettleAPI/settle-sdk-node/issues).

### License
[Apache 2](https://github.com/SettleAPI/settle-sdk-node/blob/master/LICENSE) © [Settle Group](https://settle.eu/) / [Christian Wick](https://github.com/iamchriswick)

