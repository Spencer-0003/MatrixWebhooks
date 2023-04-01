/*
  Matrix Webhooks
  A simple way to receive notifications.
*/

import 'module-alias/register';
import 'dotenv/config';
import fastify from 'fastify';
import { WebhookClient } from '@classes/Bot';

// Environment variables
const { ACCESS_TOKEN, DATABASE_URL, DOMAIN, HOMESERVER, SHADOW_DATABASE_URL } = process.env;

if (!ACCESS_TOKEN || !DATABASE_URL || !DOMAIN || !HOMESERVER ||!SHADOW_DATABASE_URL)
  throw new Error('[MatrixWebhooks]: Missing environment variables.');

// Create server
const server = fastify()
  .register(import('@fastify/helmet'))
  .get('/', () => 'Ready to receive events.');

// Start server and create bot
server.listen({ host: '0.0.0.0', port: process.env.PORT ?? 3000 }, err => console.log(`[MatrixWebhooks]: ${err ? 'Port in use.' : 'Server listening on designated port.'}`));
new WebhookClient(HOMESERVER, ACCESS_TOKEN).launch();