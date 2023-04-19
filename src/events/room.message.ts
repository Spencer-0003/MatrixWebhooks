// Import classes and functions
import { Event } from '@classes/Event';

const prefix = process.env.PREFIX ?? '!';

// Export class
export class RoomMessage extends Event {
  // Docs say to use "any", ew: https://turt2live.github.io/matrix-bot-sdk/tutorial-bot.html
  async run(roomId: string, event: any): Promise<unknown> {
    if (!event.content?.msgtype || event.sender === (await this.client.getUserId())) return;

    const content = event.content.body;
    if (content.startsWith(prefix)) {
      const args = content.slice(prefix.length).trim().split(/ +/g);
      const cmdName = args.shift().toLowerCase();
      const cmd = this.client.commands.filter(c => c.name === cmdName)[0];

      if (!cmd) return this.client.replyText(roomId, event, 'Unknown command.');

      try {
        return cmd.run({ args, event, roomId });
      } catch (err) {
        return this.client.replyText(
          roomId,
          event,
          `Error while running command:\n${(err as Error).message}`
        );
      }
    }
  }
}
