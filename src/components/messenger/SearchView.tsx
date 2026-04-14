import React, { useState } from 'react';
import { chats, contacts, channels } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

export default function SearchView() {
  const [query, setQuery] = useState('');

  const allItems = [
    ...chats.map(c => ({ ...c, type: 'chat' as const })),
    ...contacts.map(c => ({ ...c, type: 'contact' as const, lastMessage: c.phone, time: '', unread: 0, online: c.online })),
    ...channels.map(c => ({ ...c, type: 'channel' as const, lastMessage: c.lastPost, time: c.time, unread: 0, online: false })),
  ];

  const results = query.trim()
    ? allItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const typeLabel = { chat: 'Чат', contact: 'Контакт', channel: 'Канал' };
  const typeIcon = { chat: 'MessageSquare', contact: 'User', channel: 'Radio' } as const;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Поиск</h1>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск по чатам, контактам, каналам..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'hsl(var(--secondary))',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--accent-green)',
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {!query.trim() && (
          <div className="flex flex-col items-center justify-center h-full pb-20 text-center animate-fade-in">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'var(--accent-green-dim)' }}
            >
              <Icon name="Search" size={28} style={{ color: 'var(--accent-green)' }} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Начните поиск</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Чаты, контакты, каналы, сообщения</p>
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full pb-20 text-center">
            <Icon name="SearchX" size={40} style={{ color: 'var(--text-muted)' }} className="mb-3" />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Ничего не найдено по «{query}»</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="animate-fade-in">
            <p className="text-xs px-3 mb-2 mt-1" style={{ color: 'var(--text-muted)' }}>
              Найдено {results.length} результатов
            </p>
            {results.map((item, i) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 cursor-pointer transition-colors hover:bg-white/5 animate-fade-in"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <Avatar initials={item.initials} color={item.color} size="sm" online={item.online} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.lastMessage}</div>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                  style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)' }}
                >
                  {typeLabel[item.type]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
