import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { api } from '../services/api';
import type { Message } from '../types/Message';


const socket = io('http://localhost:3001');

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadHistory();

    socket.on('bot-message', (resposta: string) => {
      setMessages(prev => [
        ...prev.slice(0, -1), // remove "Digitando..."
        {
          role: 'assistant',
          content: resposta,
        },
      ]);
      setLoading(false);
    });

    return () => {
      socket.off('bot-message');
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await api.get<Message[]>('/messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);

    // Mensagem "digitando..."
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: 'Digitando...',
      },
    ]);

    setInput('');
    setLoading(true);

    try {
      await api.post('/messages', { content: userMessage.content });
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-indigo-100 via-white to-pink-100 flex items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm pointer-events-none" />
      <div className="relative z-10 w-full max-w-2xl bg-white shadow-xl rounded-lg p-6 flex flex-col h-[90vh]">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Chat da Pizzaria</h1>

        <div className="flex-1 overflow-y-auto space-y-2 px-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-md max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-blue-100 self-end ml-auto'
                  : 'bg-gray-200 self-start mr-auto'
              }`}
            >
              <span className="block text-xs text-black font-medium mb-1">
                {msg.role === 'user' ? 'Você' : 'Aurora Bianchi'}
              </span>
              <p className="text-black whitespace-pre-line">{msg.content}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="flex-1 border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
