// Import classes and types
import {
  AutojoinRoomsMixin,
  AutojoinUpgradedRoomsMixin,
  MatrixClient,
  SimpleFsStorageProvider,
  RustSdkCryptoStorageProvider
} from 'matrix-bot-sdk';
import { readdirSync } from 'fs';
import { join, parse } from 'path';
import { Command } from '@classes/Command';
import { db } from '@classes/Database';

// Create class
class WebhookClient extends MatrixClient {
  // Properties
  public commands: Command[];
  public db: typeof db;

  // Constructor
  public constructor(homeserver: string, accessToken: string) {
    super(
      homeserver,
      accessToken,
      new SimpleFsStorageProvider('./data/state.json'),
      new RustSdkCryptoStorageProvider('./data/encryption')
    );

    this.commands = [];
    this.db = db;
  }

  // Methods
  private _loadCommands(dir: string): void {
    readdirSync(dir, { withFileTypes: true }).forEach(async file => {
      const importedCommand = await import(join(dir, file.name));
      const commandClass = importedCommand[Object.keys(importedCommand)[0]];
      const cmd = new commandClass(this);

      this.commands.push(cmd);
    });
  }

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
    AutojoinUpgradedRoomsMixin.setupOnClient(this);
    this._loadCommands(join(__dirname, '../commands'));
    this._loadEvents(join(__dirname, '../events'));
    this.start();
  }
}

// Export
export const client = new WebhookClient(process.env.HOMESERVER, process.env.ACCESS_TOKEN);
