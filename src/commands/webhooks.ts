// Import classes, types & constants
import type { client as WebhookClient } from '@classes/Bot';
import type { CommandContext } from '@typings/command';
import { Command } from '@classes/Command';

// Export class
export class Webhooks extends Command {
  constructor(client: typeof WebhookClient) {
    super(client, {
      name: 'webhooks',
      description: 'List your webhooks.'
    });
  }

  async run({ event, roomId }: CommandContext): Promise<string> {
    const webhooks = (await this.client.db.getWebhooks()).filter(
      webhook => webhook.ownerId === event.sender
    );
    return this.client.replyText(
      roomId,
      event,
      !webhooks.length
        ? 'You have no webhooks.'
        : webhooks.map(webhook => `Token: ${webhook.token} - Room ID: ${webhook.roomId}`).join('\n')
    );
  }
}
