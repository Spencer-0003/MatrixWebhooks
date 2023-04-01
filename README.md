# Matrix Webhooks
A simple way to receive notifications.

## Known Issues
Currently you can't use webhooks in encrypted rooms, this seems to be an issue with the matrix-bot-sdk and should be resolved after they merge support for pre-shared keys.

## Deploy
```yml
version: '3.9'

services:
  matrix_webhooks:
    image: spencer0003/matrixwebhooks:latest
    container_name: MatrixWebhooks
    restart: unless-stopped
    environment:
      ACCESS_TOKEN: Check out https://t2bot.io/docs/access_tokens for additional information
      DATABASE_URL: postgres://user:pass@postgresql/matrix_webhooks
      DOMAIN: webhooks.DOMAIN.TLD # Don't include https
      HOMESERVER: https://matrix.org
      PORT: 3000
      SHADOW_DATABASE_URL: postgres://user:pass@postgresql/matrix_webhooks_shadow
    volumes:
      - ${PWD}/matrixwebhooks:/data
```

## Donate
BTC: bc1qynuzxakxn23a0vrt5ck8y6vl24hu0rtx30r2kx <br />
XMR: 8AjCpJRHnh1T7waLq9fvtbXQ3FSGYRYVPAv1CgRKHQuwGMvHGpWzb3kFLmV4pqUdm99YXT3mK14D4NRz6dm6aHTFJmu84aN