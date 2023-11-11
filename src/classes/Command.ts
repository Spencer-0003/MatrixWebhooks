// Import types
import type { CommandContext, CommandOptions } from '@typings/command';
import type { client as WebhookClient } from '@classes/Bot';

// Export class
export abstract class Command {
  // Properties
  name: string;
  description: string;
  args?: string[];

  // Constructor
  constructor(public readonly client: typeof WebhookClient, options: CommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.args = options.args;
  }

  // Methods
  abstract run(ctx: CommandContext): unknown;
}
