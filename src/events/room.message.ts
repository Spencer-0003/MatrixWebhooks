// Import classes and functions
import { randomBytes } from 'crypto';
import { Event } from '@classes/Event';

const prefix = process.env.PREFIX ?? '!';

// Export class
// TODO: Refactor into command handler but only if I add more commands, no point for just 3 commands imo.
export class RoomMessage extends Event {
  // Docs say to use "any", ew: https://turt2live.github.io/matrix-bot-sdk/tutorial-bot.html
  async run(roomId: string, event: any): Promise<string | undefined> {
    if (!event.content?.msgtype || event.sender === (await this.client.getUserId())) return;

    const content = event.content.body;

    if (content === `${prefix}createwebhook`) {
      const secret = content.split(' ')[1] === 'true' ? randomBytes(16).toString('hex') : undefined;
      const webhook = await this.client.db.createWebhook({ roomId, ownerId: event.sender, secret });

      return this.client.replyText(
        roomId,
        event,
        `Webhook created! https://${process.env.DOMAIN}/webhooks/${webhook.token}${
          secret ? ` - Secret: ${secret}` : ''
        }`
      );
    } else if (content.startsWith(`${prefix}deletewebhook`)) {
      const token = content.split(' ')[1];

      if (!token) return this.client.replyText(roomId, event, 'You must provide a webhook token.');

      const webhook = await this.client.db.getWebhook(token);

      if (!webhook || webhook.ownerId !== event.sender)
        return this.client.replyText(
          roomId,
          event,
          !webhook ? 'Invalid webhook token.' : 'This is not your webhook.'
        );

      await this.client.db.deleteWebhook(token);
      return this.client.replyText(roomId, event, 'Webhook successfully deleted.');
    } else if (content === `${prefix}webhooks`) {
      const webhooks = (await this.client.db.getWebhooks()).filter(
        webhook => webhook.ownerId === event.sender
      );
      return this.client.replyText(
        roomId,
        event,
        !webhooks.length
          ? 'You have no webhooks.'
          : webhooks
              .map(webhook => `Token: ${webhook.token} - Room ID: ${webhook.roomId}`)
              .join('\n')
      );
    }
  }
}
