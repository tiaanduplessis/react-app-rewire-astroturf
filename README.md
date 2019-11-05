
# react-app-rewire-astroturf
[![package version](https://img.shields.io/npm/v/react-app-rewire-astroturf.svg?style=flat-square)](https://npmjs.org/package/react-app-rewire-astroturf)
[![package downloads](https://img.shields.io/npm/dm/react-app-rewire-astroturf.svg?style=flat-square)](https://npmjs.org/package/react-app-rewire-astroturf)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![package license](https://img.shields.io/npm/l/react-app-rewire-astroturf.svg?style=flat-square)](https://npmjs.org/package/react-app-rewire-astroturf)
[![make a pull request](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> Add [astroturf CSS-in-JS](https://github.com/4Catalyzer/astroturf) to your react-app-rewired config

## Table of Contents

- [Usage](#usage)
- [Install](#install)
- [Contribute](#contribute)
- [License](#License)

## Usage

```js
const rewireAstroturf = require('react-app-rewire-astroturf')

module.exports = function override(config, env) {

  config = rewireAstroturf(config, env, {
    // config
  })

  return config
}

```


## Install

This project uses [node](https://nodejs.org) and [npm](https://www.npmjs.com).

```sh
$ npm install react-app-rewire-astroturf
$ # OR
$ yarn add react-app-rewire-astroturf
```

## Contribute

1. Fork it and create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -am "Add some feature"`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull request

## License

MIT
