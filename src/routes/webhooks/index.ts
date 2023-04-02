// Imports
import type { FastifyInstance } from 'fastify';
import type { webhookParameters } from './schemas';

import { client } from '@classes/Bot';
import { db } from '@classes/Database';

// Endpoints
// skipcq: JS-0376, JS-0116
export default async function (server: FastifyInstance) {
	server.get('/:token', async (req, res) => {
		const webhook = await db.getWebhook((req.params as webhookParameters).token);
		if (webhook) {
			return res.send({
				id: webhook.id,
				token: webhook.token,
				roomId: webhook.roomId,
				ownerId: webhook.ownerId,
				createdAt: webhook.createdAt
			});
		}

		return res.send({ error: 'Invalid webhook' });
	});

	server.post('/:token', async (req, res) => {
		const webhook = await db.getWebhook((req.params as webhookParameters).token);
		const body = (req.body as Record<string, string>);
		const content = body.content;

		if (!webhook || !content)
			return res.send({ error: !webhook ? 'Invalid webhook.' : 'You didn\'t specify any content.' });
		else if (webhook.secret && body.secret !== webhook.secret)
			return res.send({ error: 'This webhook is protected with a secret.' });

		client.sendMessage(webhook.roomId, { body: content, msgtype: 'm.text' });
		return res.send('OK');
	});

	server.delete('/:token', async (req, res) => {
		const webhook = await db.getWebhook((req.params as webhookParameters).token);

		if (!webhook || (webhook.secret && (req.body as Record<string, string>).secret !== webhook.secret))
			return res.send({ error: !webhook ? 'Invalid webhook' : 'This webhook is protected with a secret.' });

		await db.deleteWebhook(webhook.token);
		return res.send('OK');
	});
}
