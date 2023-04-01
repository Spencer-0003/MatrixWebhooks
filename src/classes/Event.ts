// Import types
import { client } from '@classes/Bot';

// Export class
export abstract class Event {
  // Properties
  public client: typeof client;

  // Constructor
  protected constructor(webhookClient: typeof client) {
    this.client = webhookClient;
  }

  // Methods
  abstract run(...args: unknown[]): Promise<unknown> | unknown;
}
