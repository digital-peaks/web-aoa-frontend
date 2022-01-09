# Web AOA Frontend

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
