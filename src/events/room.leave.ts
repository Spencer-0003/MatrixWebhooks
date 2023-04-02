// Import classes
import { Event } from '@classes/Event';

// Export class
export class RoomLeave extends Event {
  async run(roomId: string): Promise<void> {
    await this.client.db.clearRoom(roomId);
    console.log(`[MatrixWebhooks]: Removed from ${roomId}, cleared webhooks.`);
  }
}
