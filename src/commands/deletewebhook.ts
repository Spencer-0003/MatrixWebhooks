// Import classes, types & constants
import type { client as WebhookClient } from '@classes/Bot';
import type { CommandContext } from '@typings/command';
import { Command } from '@classes/Command';

// Export class
export class DeleteWebhook extends Command {
  constructor(client: typeof WebhookClient) {
    super(client, {
      name: 'deletewebhook',
      description: 'Delete a webhook.',
      args: ['token: string']
    });
  }

  async run({ args, event, roomId }: CommandContext): Promise<string> {
    const token = args[0];

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
  }
}
