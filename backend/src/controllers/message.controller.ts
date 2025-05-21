import { Request, Response } from 'express';
import { MessageService } from '../services/message.service';
import { emitBotResponse } from '../websocket/socket';

export async function sendMessage(req: Request, res: Response) {
  const { content } = req.body;

  try {
    const botReply = await MessageService.process(content);
    emitBotResponse(botReply);
    res.json({ reply: botReply });
  } catch (error) {
    console.error('Erro no controller:', error);
    res.status(500).json({ error: 'Erro ao processar a mensagem.' });
  }
}

export async function getMessages(_: Request, res: Response) {
  try {
    const messages = await MessageService.getAllMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar histórico.' });
  }
}
