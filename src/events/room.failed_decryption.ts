// Import classes
import { Event } from '@classes/Event';

// Export class
export class FailedDecryption extends Event {
  // Docs say to use "any", ew: https://turt2live.github.io/matrix-bot-sdk/tutorial-bot.html
  // skipcq: JS-0105 JS-0323
  run(roomId: string, _: any, e: Error): void {
    console.log(`[MatrixWebhooks]: Failed to decrypt message in ${roomId}, error:\n${e}`);
  }
}
