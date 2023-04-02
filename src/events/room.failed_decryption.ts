// Import classes
import { Event } from '@classes/Event';

// Export class
// skipcq: JS-0105
export class FailedDecryption extends Event {
  // Docs say to use "any", ew: https://turt2live.github.io/matrix-bot-sdk/tutorial-bot.html
  run(roomId: string, _: any, e: Error): void {
    console.log(`Failed to decrypt message in ${roomId}, error:\n${e}`);
  }
}
