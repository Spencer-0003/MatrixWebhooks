// Import classes
import { Event } from '@classes/Event';

// Export class
export class Ready extends Event {
  // Docs say to use "any", ew: https://turt2live.github.io/matrix-bot-sdk/tutorial-bot.html
  async run(roomId: string, event: any) {
    if (!event.content?.msgtype || event.sender === (await this.client.getUserId())) return;

    const content = event.content.body;

    if (content === '!createwebhook') {
      const webhook = await this.client.db.createWebhook({ roomId, ownerId: event.sender });

      return this.client.replyText(
        roomId,
        event,
        `Webhook created! https://${process.env.DOMAIN}/webhooks/${webhook.token}`
      );
    }
  }
}
