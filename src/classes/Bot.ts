// Import classes and types
import {
  AutojoinRoomsMixin,
  MatrixClient,
  SimpleFsStorageProvider,
  RustSdkCryptoStorageProvider
} from 'matrix-bot-sdk';
import { readdirSync } from 'fs';
import { join, parse } from 'path';
import { Database } from '@classes/Database';

// Create class
export class WebhookClient extends MatrixClient {
  // Properties
  public db: Database;

  // Constructor
  public constructor(homeserver: string, accessToken: string) {
    super(
      homeserver,
      accessToken,
      new SimpleFsStorageProvider('./data/state.json'),
      new RustSdkCryptoStorageProvider('./data/encryption')
    );

    this.db = new Database();
  }

  // Methods
  private _loadEvents(dir: string): void {
    readdirSync(dir, { withFileTypes: true }).forEach(async file => {
      const importedEvent = await import(join(dir, file.name));
      const eventClass = importedEvent[Object.keys(importedEvent)[0]];
      const loadedEvent = new eventClass(this);
      const { name } = parse(file.name);

      this.on(name, loadedEvent.run.bind(loadedEvent));
    });
  }

  public launch(): void {
    AutojoinRoomsMixin.setupOnClient(this);
    this._loadEvents(join(__dirname, '../events'));
    this.start();
  }
}
