export interface CommandContext {
  args: Record<string, string>;
  event: any; // Eww
  roomId: string;
}

export interface CommandOptions {
  name: string;
  description: string;
}
