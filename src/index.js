const SettleRequest = require('./client');

exports.send = new SettleRequest({
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
