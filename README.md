# Settle SDK for Node.js

[![Build Status](https://travis-ci.org/flexdinesh/npm-module-boilerplate.svg?branch=master)](https://travis-ci.org/flexdinesh/npm-module-boilerplate) [![dependencies Status](https://david-dm.org/flexdinesh/npm-module-boilerplate/status.svg)](https://david-dm.org/flexdinesh/npm-module-boilerplate) [![devDependencies Status](https://david-dm.org/flexdinesh/npm-module-boilerplate/dev-status.svg)](https://david-dm.org/flexdinesh/npm-module-boilerplate?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Start accepting payments via Settle in seconds** ✨

An easy to use SDK for Node.js with all the best practices to kickstart your integration with Settle.

## Features

* **Requests** - Simplifies calling the Settle APIs by handling signing and authorization.
* **Verifications** - _Express.js_ compatible middleware that verifies signatures of incoming callbacks.

## Functions

- `merchant.api_keys` - https://settle.dev/api/reference/rest/v1/merchant.apiKeys/
- `merchant.balance` - https://settle.dev/api/reference/rest/v1/merchant.balance/
- `merchant.logo` - https://settle.dev/api/reference/rest/v1/merchant.logo/
- `merchant.payment.request` - https://settle.dev/api/reference/rest/v1/merchant.payment.request/
- `merchant.payment.request.outcome` - https://settle.dev/api/reference/rest/v1/merchant.payment.request.outcome/
- `merchant.payment.send` - https://settle.dev/api/reference/rest/v1/merchant.payment.send/
- `merchant.payment.send.outcome` - https://settle.dev/api/reference/rest/v1/merchant.payment.send.outcome/
- `merchant.pos` - https://settle.dev/api/reference/rest/v1/merchant.pos/
- `merchant.profile` - https://settle.dev/api/reference/rest/v1/merchant.profile/
- `merchant.sales.summary` - https://settle.dev/api/reference/rest/v1/merchant.sales.summary/
- `merchant.settlement` - https://settle.dev/api/reference/rest/v1/merchant.settlement/
- `merchant.settlement.account` - https://settle.dev/api/reference/rest/v1/merchant.settlement.account/
- `merchant.settlement.latest` - https://settle.dev/api/reference/rest/v1/merchant.settlement.latest/
- `merchant.settlement.report` - https://settle.dev/api/reference/rest/v1/merchant.settlement.report/
- `merchant.shortlink` - https://settle.dev/api/reference/rest/v1/merchant.shortlink/
- `merchant.statusCodes` - https://settle.dev/api/reference/rest/v1/merchant.statusCodes/

## Installation

`npm i settle-sdk-node`

## Config

TBD

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
