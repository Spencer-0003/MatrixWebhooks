// Import classes, types & constants
import type { client as WebhookClient } from '@classes/Bot';
import type { CommandContext } from '@typings/command';
import { randomBytes } from 'crypto';
import { Command } from '@classes/Command';

// Export class
export class CreateWebhook extends Command {
  constructor(client: typeof WebhookClient) {
    super(client, {
      name: 'createwebhook',
      description: 'Create a webhook.',
      args: ['protected: boolean']
    });
  }

  async run({ args, event, roomId }: CommandContext): Promise<string> {
    const secret = args[0] === 'true' ? randomBytes(16).toString('hex') : undefined;
    const webhook = await this.client.db.createWebhook({ roomId, ownerId: event.sender, secret });

    return this.client.replyText(
      roomId,
      event,
      `Webhook created! https://${process.env.DOMAIN}/webhooks/${webhook.token}${
        secret ? ` - Secret: ${secret}` : ''
      }`
    );
  }
}
