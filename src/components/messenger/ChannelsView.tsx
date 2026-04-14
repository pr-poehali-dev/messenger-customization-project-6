import React from 'react';
import { channels } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

export default function ChannelsView() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Каналы</h1>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
          style={{ border: '1.5px solid hsl(var(--border))' }}
        >
          <Icon name="Plus" size={16} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {channels.map((ch, i) => (
          <div
            key={ch.id}
            className="flex items-start gap-3 px-3 py-3.5 rounded-xl mb-1 cursor-pointer transition-colors hover:bg-white/5 animate-fade-in"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <Avatar initials={ch.initials} color={ch.color} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{ch.name}</span>
                {ch.verified && (
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-green)' }}>
                    <Icon name="Check" size={9} style={{ color: 'hsl(var(--background))' }} />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon name="Users" size={11} style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{ch.subscribers} подписчиков</span>
              </div>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                {ch.lastPost}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{ch.time}</span>
              <button
                className="text-xs px-2.5 py-1 rounded-full font-medium transition-all hover:opacity-80"
                style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)', border: '1px solid var(--accent-green-hover)' }}
              >
                Читать
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
