// Import classes and types
import { AutojoinRoomsMixin, MatrixClient } from 'matrix-bot-sdk';

// Create class
export class WebhookClient extends MatrixClient {
  public constructor(accessToken: string, homeserver: string) {
    super(accessToken, homeserver);
  }

  public launch(): void {
    AutojoinRoomsMixin.setupOnClient(this);
    this.start();
  }
}
