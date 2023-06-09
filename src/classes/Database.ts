// Import classes and types
import type { Webhook } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

// Class
class Database {
  // Properties
  private readonly prisma: PrismaClient;

  // Constructor
  constructor() {
    this.prisma = new PrismaClient();
  }

  // Methods

  /**
   * createWebhook
   * @param data Webhook data - { ownerId: string, roomId: string }
   * @returns Webhook database entry
   */
  public createWebhook(data: {
    roomId: string;
    ownerId: string;
    secret?: string;
  }): Promise<Webhook> {
    return this.prisma.webhook.create({ data });
  }

  /**
   * getWebhook
   * @param token - string
   * @returns Webhook database entry if found
   */
  public getWebhook(token: string): Promise<Webhook | null> {
    return this.prisma.webhook.findUnique({ where: { token } });
  }

  /**
   * getWebhooks
   * @returns All webhooks
   */
  public getWebhooks(): Promise<Webhook[]> {
    return this.prisma.webhook.findMany();
  }

  /**
   * clearRoom
   * @param roomId
   * @returns void
   */
  public clearRoom(roomId: string) {
    return this.prisma.webhook.deleteMany({ where: { roomId } });
  }

  /**
   * deleteWebhook
   * @param token - string
   * @returns void
   */
  public deleteWebhook(token: string): Promise<Webhook> {
    return this.prisma.webhook.delete({ where: { token } });
  }
}

// Export
export const db = new Database();
