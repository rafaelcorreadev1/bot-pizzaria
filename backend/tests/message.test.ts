import request from 'supertest'
import express from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import messageRoutes from '../src/routes/message.routes'
import * as messageService from '../src/services/message.service'

const app = express()
app.use(express.json())
app.use('/', messageRoutes)

describe('Histórico de mensagens (GET)', () => {
  beforeEach(() => {
    vi.restoreAllMocks() // limpa mocks a cada teste
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
      createdAt: m.createdAt.toISOString(),
    })))
  })  

  it('deve retornar erro 500 ao falhar no histórico', async () => {
    vi.spyOn(messageService.MessageService, 'getAllMessages').mockRejectedValue(new Error('Erro'))

    const res = await request(app).get('/')
    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty('error', 'Erro ao buscar histórico.')
  })
})
