# Web AOA Frontend

This web application aims to implement the AOA method according to Meyer & Pebesma (2021) and provide the user an easy-to-use interface.

## Installation

> Please make sure you are using NodeJS 16.x or above.

```
npm install
```

### Development

Using the local API:

> Please make sure you are started the API from the repository [digital-peaks/web-aoa](https://github.com/digital-peaks/web-aoa).

```
npm run serve
```

Using the AWS API (no local API needed):

```
VUE_APP_API_URL=https://web-aoa.schnierer.info:8780/api npm run serve
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

## Configuration

There are a few environment variables that can be set to configure the frontend dynamically.

| Variable          | Default                | Description |
| ----------------- | ---------------------- | ----------- |
| `VUE_APP_API_URL` | `http://localhost/api` | API URL.    |

> For the Docker container you don't need to pass the `VUE_APP_` prefix.
> E.g.: `docker run -e API_URL=https://example.com ...`

# Used technologies

- [Vue.js](https://github.com/vuejs/vue)
- [Vuetify](https://github.com/vuetifyjs/vuetify)
- [Leaflet](https://github.com/Leaflet/Leaflet)
- [georaster-layer-for-leaflet](https://github.com/GeoTIFF/georaster-layer-for-leaflet)

# License

[MIT](https://github.com/digital-peaks/web-aoa-frontend/blob/main/LICENSE)
