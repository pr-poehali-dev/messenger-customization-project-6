import React, { useState, useRef, useEffect } from 'react';
import { chats, messages as initialMessages, Message } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ChatWindowProps {
  chatId: string | null;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [msgs, setMsgs] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = chats.find(c => c.id === chatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      isOut: true,
      status: 'sent',
    };
    setMsgs(prev => [...prev, newMsg]);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center" style={{ background: 'hsl(var(--chat-bg, var(--background)))' }}>
        <div className="animate-scale-in text-center">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--accent-green-dim)', border: '1px solid var(--accent-green-hover)' }}
          >
            <Icon name="MessageSquare" size={40} style={{ color: 'var(--accent-green)' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Volta</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Выберите чат, чтобы начать общение</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'hsl(220, 16%, 7%)' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 border-b flex-shrink-0"
        style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--background))' }}
      >
        <Avatar initials={chat.initials} color={chat.color} size="sm" online={chat.online} />
        <div className="flex-1">
          <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{chat.name}</div>
          <div className="text-xs" style={{ color: chat.online ? 'var(--accent-green)' : 'var(--text-muted)' }}>
            {chat.typing ? 'печатает...' : chat.online ? 'онлайн' : 'был(а) недавно'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/5">
            <Icon name="Phone" size={17} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/5">
            <Icon name="Video" size={17} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/5">
            <Icon name="Search" size={17} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/5">
            <Icon name="MoreVertical" size={17} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1.5">
        {msgs.map((msg, i) => (
          <MessageBubble key={msg.id} msg={msg} prev={msgs[i - 1]} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 border-t flex-shrink-0"
        style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--background))' }}
      >
        <div
          className="flex items-end gap-2 rounded-2xl px-3 py-2"
          style={{ background: 'hsl(var(--secondary))' }}
        >
          <button className="w-7 h-7 flex items-center justify-center flex-shrink-0 mb-0.5">
            <Icon name="Paperclip" size={18} style={{ color: 'var(--text-muted)' }} />
          </button>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Написать сообщение..."
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed py-0.5"
            style={{ color: 'var(--text-primary)', maxHeight: '120px', scrollbarWidth: 'none' }}
          />
          <button className="w-7 h-7 flex items-center justify-center flex-shrink-0 mb-0.5">
            <Icon name="Smile" size={18} style={{ color: 'var(--text-muted)' }} />
          </button>
          <button
            onClick={handleSend}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150"
            style={{
              background: inputText.trim() ? 'var(--accent-green)' : 'transparent',
              color: inputText.trim() ? 'hsl(var(--background))' : 'var(--text-muted)',
            }}
          >
            <Icon name="Send" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, prev }: { msg: Message; prev?: Message }) {
  const showAvatar = !msg.isOut && (!prev || prev.isOut);
  return (
    <div className={`flex ${msg.isOut ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-[70%] ${msg.isOut ? '' : 'ml-0'}`}>
        <div
          className="px-3.5 py-2 rounded-2xl text-sm leading-relaxed"
          style={{
            background: msg.isOut ? '#1f5c42' : 'hsl(var(--card))',
            color: 'var(--text-primary)',
            borderRadius: msg.isOut ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          }}
        >
          {msg.text}
          {msg.reactions && msg.reactions.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {msg.reactions.map((r, i) => (
                <span key={i} className="text-xs bg-white/10 rounded-full px-1.5 py-0.5">
                  {r.emoji} {r.count}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className={`flex items-center gap-1 mt-0.5 ${msg.isOut ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{msg.time}</span>
          {msg.isOut && msg.status && (
            <Icon
              name={msg.status === 'read' ? 'CheckCheck' : 'Check'}
              size={11}
              style={{ color: msg.status === 'read' ? 'var(--accent-green)' : 'var(--text-muted)' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
