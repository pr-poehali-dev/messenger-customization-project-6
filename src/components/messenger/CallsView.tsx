import React from 'react';
import { calls } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

export default function CallsView() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Звонки</h1>
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105"
          style={{ background: 'var(--accent-green)', color: 'hsl(var(--background))' }}
        >
          <Icon name="Phone" size={14} />
          Новый
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {calls.map((call, i) => (
          <div
            key={call.id}
            className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1 cursor-pointer transition-colors hover:bg-white/5 animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <Avatar initials={call.initials} color={call.color} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold mb-0.5 truncate" style={{ color: 'var(--text-primary)' }}>
                {call.name}
              </div>
              <div className="flex items-center gap-1.5">
                <Icon
                  name={
                    call.type === 'missed' ? 'PhoneMissed' :
                    call.type === 'incoming' ? 'PhoneIncoming' : 'PhoneOutgoing'
                  }
                  size={12}
                  style={{
                    color: call.type === 'missed' ? '#ef4444' :
                           call.type === 'incoming' ? 'var(--accent-green)' : 'hsl(var(--muted-foreground))'
                  }}
                />
                <span className="text-xs" style={{ color: call.type === 'missed' ? '#ef4444' : 'var(--text-muted)' }}>
                  {call.type === 'missed' ? 'Пропущенный' :
                   call.type === 'incoming' ? 'Входящий' : 'Исходящий'}
                  {call.duration && ` · ${call.duration}`}
                </span>
                {call.video && (
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)' }}>
                    видео
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{call.time}</span>
              <div className="flex gap-1">
                <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Icon name={call.video ? 'Video' : 'Phone'} size={13} style={{ color: 'var(--accent-green)' }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
