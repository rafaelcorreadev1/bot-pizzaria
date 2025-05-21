import { responderComDeepseek } from './deepseek.service';
import { prisma } from '../config/prisma';

export class MessageService {
  static async process(message: string): Promise<string> {
    // Salva mensagem do usuário
    await prisma.message.create({
      data: {
        role: 'user',
        content: message,
      },
    });

    // Processa com DeepSeek
    const botReply = await responderComDeepseek([
      ...((await this.getHistoryAsChat()).slice(-5)),
      { role: 'user', content: message },
    ]);

    // Salva resposta do bot
    await prisma.message.create({
      data: {
        role: 'assistant',
        content: botReply,
      },
    });

    return botReply;
  }

  static async getAllMessages() {
    return prisma.message.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  static async getHistoryAsChat(): Promise<{ role: 'user' | 'assistant'; content: string }[]> {
    const messages = await this.getAllMessages();
    return messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
  }
}
