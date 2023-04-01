/*
  Matrix Webhooks
  A simple way to receive notifications.
*/

import 'module-alias/register';
import 'dotenv/config';
import fastify from 'fastify';

// Create server
const server = fastify()
  .register(import('@fastify/helmet'))
  .get('/', () => 'Ready to receive events.');

// Listen
server.listen({ host: '0.0.0.0', port: process.env.PORT ?? 3000 }, err => console.log(`[MatrixWebhooks]: ${err ? 'Port in use.' : 'Server listening on designated port.'}`));