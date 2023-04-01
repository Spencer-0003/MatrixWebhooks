// Import types
import type { WebhookClient } from '@classes/Bot';

// Export class
export abstract class Event {
  // Properties
  public client: WebhookClient;

  // Constructor
  protected constructor(client: WebhookClient) {
    this.client = client;
  }

  // Methods
  abstract run(...args: unknown[]): Promise<unknown> | unknown;
}
