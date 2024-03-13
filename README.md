<h1 align="center">vite-plugin-const</h1>

<p align="center">
  A Vite plugin for compile-time execution of ESM modules.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vite-plugin-const">
    <img src="https://img.shields.io/npm/v/vite-plugin-const?style=for-the-badge" alt="downloads" height="24">
  </a>
  <a href="https://www.npmjs.com/package/vite-plugin-const">
    <img src="https://img.shields.io/github/actions/workflow/status/zebp/vite-plugin-const/ci.yaml?branch=main&style=for-the-badge" alt="npm version" height="24">
  </a>
  <a href="https://github.com/zebp/streaming-tar">
    <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="MIT license" height="24">
  </a>
</p>

## Installation

```bash
# NPM
$ npm install --save-dev vite-plugin-const
# Yarn
$ yarn add -D vite-plugin-const
# PNPM
$ pnpm add -D vite-plugin-const
# Bun
$ bun add -D vite-plugin-const
```

## Usage

Depending on what framework you are using your configuration will look slightly different. If you
are using a [Webpack](https://webpack.js.org/) based framework you should instead look towards
[const-module-loader](https://github.com/zebp/const-module-loader), which is the same functionality
but for Vite based frameworks.

### Vite

Most frameworks will use the regular `vite.config.js` file where you can register the plugin like:

```js
import constPlugin from "vite-plugin-const";

export default defineConfig({
  plugins: [constPlugin()],
});
```

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
