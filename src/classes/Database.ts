// Import classes and types
import type { Webhook } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

export class Database {
  // Properties
  private readonly prisma: PrismaClient;

  // Constructor
	constructor() {
		this.prisma = new PrismaClient();
	}

  // Methods
  public createWebhook(data: Omit<Webhook, 'id' | 'createdAt' | 'token'>): Promise<Webhook> {
    return this.prisma.webhook.create({ data });
  }

  public getWebhook(token: string): Promise<Webhook | null> {
    return this.prisma.webhook.findUnique({ where: { token } });
  }
}