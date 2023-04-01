// Imports
import type { FastifyInstance } from 'fastify';
import type { webhookParameters } from './schemas';

import { client } from '@classes/Bot';
import { db } from '@classes/Database';

// Endpoints
// skipcq: JS-0376
export default async function (server: FastifyInstance) {
	server.get('/:token', async (req, res) => {
		const webhook = await db.getWebhook((req.params as webhookParameters).token);

		return res.send(webhook ?? { error: 'Invalid webhook' });
	});

	server.post('/:token', async (req, res) => {
		const webhook = await db.getWebhook((req.params as webhookParameters).token);
		const content = (req.body as Record<string, string>).content;

		if (!webhook || !content)
			return res.send({ error: !webhook ? 'Invalid webhook.' : 'You didn\'t specify any content.' });

		client.sendMessage(webhook.roomId, { body: content, msgtype: 'm.text' });
		return res.send('OK');
	});
}
