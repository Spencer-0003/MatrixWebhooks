// Imports
import type { FastifyInstance } from 'fastify';
import type { webhookParameters } from './schemas';

import { db } from '@classes/Database';

// Endpoints
// skipcq: JS-0376
export default async function (server: FastifyInstance) {
	server.get('/:token', async (req, res) => {
		const webhook = await db.getWebhook((req.params as webhookParameters).token);

		return res.send(webhook ?? { error: 'Invalid webhook' });
	});
}
