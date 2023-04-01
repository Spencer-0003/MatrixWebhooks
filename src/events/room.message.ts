// Import classes
import { Event } from '@classes/Event';

const prefix = process.env.PREFIX ?? '!';

// Export class
export class Ready extends Event {
  // Docs say to use "any", ew: https://turt2live.github.io/matrix-bot-sdk/tutorial-bot.html
  async run(roomId: string, event: any): Promise<string | undefined> {
    if (!event.content?.msgtype || event.sender === (await this.client.getUserId())) return;

    const content = event.content.body;

    if (content === `${prefix}createwebhook`) {
      const webhook = await this.client.db.createWebhook({ roomId, ownerId: event.sender });

      return this.client.replyText(
        roomId,
        event,
        `Webhook created! https://${process.env.DOMAIN}/webhooks/${webhook.token}`
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
          : webhooks.map(webhook => webhook.token).join('\n')
      );
    }
  }
}
