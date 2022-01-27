# Web AOA Frontend

This web application aims to implement the AOA method according to Meyer & Pebesma (2021) and provide the user an easy-to-use interface.

# Configuration

## Configuration

There are a few environment variables that can be set to configure the frontend dynamically.

| Variable          | Default                | Description |
| ----------------- | ---------------------- | ----------- |
| `VUE_APP_API_URL` | `http://localhost/api` | API URL.    |

> For the Docker container you don't need to pass the `VUE_APP_` prefix.
> E.g.: `docker run -e API_URL=https://example.com ...`

## Installation

> Please make sure you are using NodeJS 16.x or above.

```
npm install
```

### Development

```
npm run serve
```

Using a different API URL:

```
VUE_APP_API_URL=https://example.com npm run serve
```

> For more details see the section [Configuration](#configuration).

### Production

```
npm run build
```

### Test & Lint

```
npm run test:unit
```

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

# Used technologies

* [Vue.js](https://github.com/vuejs/vue)
* [Vuetify](https://github.com/vuetifyjs/vuetify)
* [Leaflet](https://github.com/Leaflet/Leaflet)
* [georaster-layer-for-leaflet](https://github.com/GeoTIFF/georaster-layer-for-leaflet)

# License 

[MIT](https://github.com/digital-peaks/web-aoa-frontend/blob/main/LICENSE)
