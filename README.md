### Migrated to [usesarchbtw.lol](https://git.usesarchbtw.lol/usesarchbtw.lol/MatrixWebhooks)

# Matrix Webhooks
A simple way to receive notifications.

## How To Use
Using MatrixWebhooks is simple. After deploying, just invite the bot user to a room and you're good to go. Here are the available commands:

* `createwebhook <protected>` - Creates a new webhook for the current room. If protected is true, a secret will be generated to prevent people from spamming your webhook. Defaults to false.
* `deletewebhook <webhook_token>` - Deletes an existing webhook with the matching token.
* `webhooks` - Displays a list of all webhooks you've created along with their associated room IDs.

To get your access token run this command:
```
curl -XPOST -d '{"type":"m.login.password", "user":"example", "password":"example"}' "HOME_SERVER_URL/_matrix/client/r0/login"
```

To deploy, use the following Docker Compose configuration:
```yml
version: '3.9'

services:
  matrix_webhooks:
    image: spencer0003/matrixwebhooks:latest # Or ghcr.io/spencer-0003/matrixwebhooks:latest
    container_name: MatrixWebhooks
    restart: unless-stopped
    environment:
      ACCESS_TOKEN: YOUR_ACCESS_TOKEN
      DATABASE_URL: postgres://user:pass@postgresql/matrix_webhooks
      DOMAIN: webhooks.DOMAIN.TLD # Don't include https
      HOMESERVER: https://matrix.org
      HOMESERVER_RESTRICTED: true # Only allow users on the same homeserver as the bot to run commands.
      PORT: 3000
      PREFIX: '!'
      SHADOW_DATABASE_URL: postgres://user:pass@postgresql/matrix_webhooks_shadow
    volumes:
      - ${PWD}/matrixwebhooks:/app/data
```

## Donate
If you find MatrixWebhooks useful and want to support its development, consider donating using one of the following methods:
BTC: `bc1qynuzxakxn23a0vrt5ck8y6vl24hu0rtx30r2kx` <br />
XMR: `8AjCpJRHnh1T7waLq9fvtbXQ3FSGYRYVPAv1CgRKHQuwGMvHGpWzb3kFLmV4pqUdm99YXT3mK14D4NRz6dm6aHTFJmu84aN`
