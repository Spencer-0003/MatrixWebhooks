// Import classes and types
import { AutojoinRoomsMixin, MatrixClient } from 'matrix-bot-sdk';
import { Database } from '@classes/Database';

// Create class
export class WebhookClient extends MatrixClient {
  // Properties
  public db: Database;

  // Constructor
  public constructor(accessToken: string, homeserver: string) {
    super(accessToken, homeserver);

    this.db = new Database();
  }

  // Methods
  public launch(): void {
    AutojoinRoomsMixin.setupOnClient(this);
    this.start();
  }
}
