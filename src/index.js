const SettleRequest = require('./client');

const send = new SettleRequest({
  environment: 'sandbox',
  user: 't1m7fw50',
  merchantId: 'fzkmhy0q',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----\n'
        + 'MIICXAIBAAKBgQCbOqFG0CQiFPFoYuWqXyteHDxzow0iSSTk0x/ITTwAWVVbugWhem+HFTNP\n'
        + 'GVVmjyV9tloSnHcGUPkjGNjh50fC7JN3doa5eR7dEr0KGPu3XgeP7IK1/mVpxjBZEINTa1f0\n'
        + '0khgc6wzoYIGMvXen4PCIcBO0TmCwTyxM0+oRbNRzwIDAQABAoGAfut8TFsJADjhfblHEXuJ\n'
        + 'CQTLRL1vkrX9jX82QF8uDRb93OcHjZV/NRLXhfgvxJCMVfJQSWFXTHnOiqzZQDQLjoXxeTHR\n'
        + 'P4+w1WhyJTeDgFoULugI2giwOLw6ExB3WUTumlYP6wyfWiH+ZmG9OcfUfU2BgNNqRO0GkHiW\n'
        + 'YTUZC7kCQQDQh8uBX9QfnX+kvN3u2s1oUMuX/RNwlG2dDoGdIAEBgD9YP+vQLLaTsSNC4oGP\n'
        + '91F3XJkluBKL8Mbg91adRS1rAkEAvpCrsE6CPdjEnxTk2mToRUZvRXNGXtCDySYzuE47EI6t\n'
        + '7g6fbrqk5XQWXc+XwtXvlCf4gwB7zAD7uuBfUu6CLQJAJGGsxbOcZK+r12gEKGoQMET4YFoN\n'
        + 'DDU5Mo+XWXx98G8ZniH42GcUq4vaJQ8zn5R8qCCFr6j/w16MtC8y81lgZQJBAI4rJjthRt9X\n'
        + 'IdFA6D9aesJ7+rWIe55u13KwsnM0wfHnUDFC7YTRcAXS5oDUR/dOXe9dJpStPq6CqUrQ66zW\n'
        + 'TX0CQDARMbH2h498sEo5VsDASGZwy4YWuHTP8f0JnLKRXRtZ9LNADedHOEndiN2ak6Tt4Kr+\n'
        + 'guwEj2euvbP4Fi52QJA=\n'
        + '-----END RSA PRIVATE KEY-----'
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
