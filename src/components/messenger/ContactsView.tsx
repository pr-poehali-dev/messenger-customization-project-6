import React, { useState } from 'react';
import { contacts } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

export default function ContactsView() {
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const grouped = filtered.reduce((acc, contact) => {
    const letter = contact.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(contact);
    return acc;
  }, {} as Record<string, typeof contacts>);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Контакты</h1>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск контактов..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: 'hsl(var(--secondary))',
              color: 'var(--text-primary)',
              border: '1px solid transparent',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent-green)')}
            onBlur={e => (e.target.style.borderColor = 'transparent')}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="px-3 py-2 mb-1">
          <button
            className="flex items-center gap-3 w-full py-2 rounded-xl px-2 transition-colors hover:bg-white/5"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-green-dim)' }}>
              <Icon name="UserPlus" size={18} style={{ color: 'var(--accent-green)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>Добавить контакт</span>
          </button>
        </div>

        {Object.entries(grouped).sort().map(([letter, group]) => (
          <div key={letter} className="animate-fade-in">
            <div className="px-5 py-1.5">
              <span className="text-xs font-bold" style={{ color: 'var(--accent-green)' }}>{letter}</span>
            </div>
            {group.map(contact => (
              <div
                key={contact.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mx-2 mb-0.5 cursor-pointer transition-colors hover:bg-white/5"
              >
                <Avatar initials={contact.initials} color={contact.color} size="sm" online={contact.online} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{contact.name}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {contact.online ? 'онлайн' : contact.lastSeen || contact.phone}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Icon name="MessageCircle" size={16} style={{ color: 'var(--text-secondary)' }} />
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Icon name="Phone" size={16} style={{ color: 'var(--text-secondary)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
