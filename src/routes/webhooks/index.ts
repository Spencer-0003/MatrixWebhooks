// Imports
import type { MatrixError } from 'matrix-bot-sdk';
import type { FastifyInstance } from 'fastify';
import type { WebhookParameters } from './schemas';
import { Converter } from 'showdown';
import { client } from '@classes/Bot';
import { db } from '@classes/Database';

const converter = new Converter();

// Endpoints
// skipcq: JS-0376, JS-0116
export default async function (server: FastifyInstance) {
	// Sender
	const send = (webhookClient: typeof client, roomId: string, body: string): void => {
		webhookClient.sendMessage(roomId, { body, msgtype: 'm.text', format: 'org.matrix.custom.html', formatted_body: converter.makeHtml(body) }).catch((err: MatrixError) => {
			if (err.body.errcode === 'M_LIMIT_EXCEEDED')
				setTimeout(() => send(client, roomId, body), err.retryAfterMs);
		});
	}

	// Base endpoints
	server.get('/:token', async (req, res) => {
		const webhook = await db.getWebhook((req.params as WebhookParameters).token);
		if (webhook)
			return res.send({
				id: webhook.id,
				token: webhook.token,
				roomId: webhook.roomId,
				ownerId: webhook.ownerId,
				createdAt: webhook.createdAt
			});


		return res.send({ error: 'Invalid webhook' });
	});

	server.post('/:token', async (req, res) => {
		const webhook = await db.getWebhook((req.params as WebhookParameters).token);
		const body = (req.body as Record<string, string>);
		const { content } = body;

		if (!webhook || !content)
			return res.send({ error: !webhook ? 'Invalid webhook.' : 'You didn\'t specify any content.' });
		else if (webhook.secret && body.secret !== webhook.secret)
			return res.send({ error: 'This webhook is protected with a secret.' });

		send(client, webhook.roomId, content);
		return res.send('OK');
	});

	server.delete('/:token', async (req, res) => {
		const webhook = await db.getWebhook((req.params as WebhookParameters).token);

		if (!webhook || (webhook.secret && (req.body as Record<string, string>).secret !== webhook.secret))
			return res.send({ error: !webhook ? 'Invalid webhook' : 'This webhook is protected with a secret.' });

		await db.deleteWebhook(webhook.token);
		return res.send('OK');
	});

	// Platform specific
	server.post('/:token/apprise', async (req, res) => {
		const webhook = await db.getWebhook((req.params as WebhookParameters).token);
		const body = (req.body as Record<string, string>);
		const { message, title } = body;

		if (!webhook || !message)
			return res.send({ error: !webhook ? 'Invalid webhook.' : 'You didn\'t specify any content.' });
		else if (webhook.secret && body.secret !== webhook.secret)
			return res.send({ error: 'This webhook is protected with a secret.' });

		send(client, webhook.roomId, `${title}\n${message}`);
		return res.send('OK');
	});
}
