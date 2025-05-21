import request from 'supertest'
import express from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import messageRoutes from '../src/routes/message.routes'
import * as messageService from '../src/services/message.service'
import * as socketModule from '../src/websocket/socket'

const app = express()
app.use(express.json())
app.use('/', messageRoutes)

describe('Rotas de mensagens', () => {
  beforeEach(() => {
    vi.restoreAllMocks() // limpa mocks a cada teste
  })

  it('deve responder com erro se MessageService.process falhar', async () => {
    vi.spyOn(messageService.MessageService, 'process').mockRejectedValue(new Error('Falha'))

    const res = await request(app).post('/').send({ content: 'teste' })
    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty('error', 'Erro ao processar a mensagem.')
  })

  it('deve responder com a mensagem da IA', async () => {
    const fakeReply = 'Olá! Eu sou o atendente virtual.'
    vi.spyOn(messageService.MessageService, 'process').mockResolvedValue(fakeReply)
    const emitMock = vi.spyOn(socketModule, 'emitBotResponse').mockImplementation(() => {})

    const res = await request(app).post('/').send({ content: 'Oi' })

    expect(res.status).toBe(200)
    expect(res.body.reply).toBe(fakeReply)
    expect(emitMock).toHaveBeenCalledWith(fakeReply)
  })

  it('deve retornar histórico de mensagens', async () => {

    
  const fakeMessages = [
    {
      id: 1,
      content: 'Oi',
      role: 'user',
      createdAt: new Date(),
    },
    {
      id: 2,
      content: 'Olá, posso ajudar com o pedido?',
      role: 'assistant',
      createdAt: new Date(),
    }
  ];

    vi.spyOn(messageService.MessageService, 'getAllMessages').mockResolvedValue(fakeMessages)

    const res = await request(app).get('/')

    expect(res.status).toBe(200)
    expect(res.body).toEqual(fakeMessages.map(m => ({
      ...m,
      createdAt: m.createdAt.toISOString(), // converte para string como viria no JSON
    })))
  })

  it('deve retornar erro 500 ao falhar no histórico', async () => {
    vi.spyOn(messageService.MessageService, 'getAllMessages').mockRejectedValue(new Error('Erro'))

    const res = await request(app).get('/')
    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty('error', 'Erro ao buscar histórico.')
  })
})
