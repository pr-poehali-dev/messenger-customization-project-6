import React from 'react';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

export default function ProfileView() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Профиль</h1>
        <button className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>Изменить</button>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        {/* Profile card */}
        <div
          className="rounded-2xl p-5 mb-4 flex flex-col items-center text-center animate-scale-in"
          style={{ background: 'hsl(var(--card))' }}
        >
          <div className="relative mb-3">
            <Avatar initials="ВЯ" color="#3ecf8e" size="xl" online={true} />
            <button
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'var(--accent-green)' }}
            >
              <Icon name="Camera" size={13} style={{ color: 'hsl(var(--background))' }} />
            </button>
          </div>
          <h2 className="text-lg font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>Владимир Яковлев</h2>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>@vladimir_y</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>🚀 Строю будущее</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'Друзья', value: '248' },
            { label: 'Каналы', value: '12' },
            { label: 'Медиа', value: '1.4K' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: 'hsl(var(--card))' }}>
              <div className="text-lg font-bold" style={{ color: 'var(--accent-green)' }}>{stat.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="rounded-2xl overflow-hidden mb-4 animate-fade-in" style={{ background: 'hsl(var(--card))', animationDelay: '0.15s' }}>
          {[
            { icon: 'Phone', label: 'Телефон', value: '+7 916 999-00-11' },
            { icon: 'Mail', label: 'Email', value: 'vladimir@volta.app' },
            { icon: 'MapPin', label: 'Город', value: 'Москва, Россия' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: i < 2 ? '1px solid hsl(var(--border))' : 'none' }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-green-dim)' }}>
                <Icon name={item.icon} size={15} style={{ color: 'var(--accent-green)' }} />
              </div>
              <div>
                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="rounded-2xl overflow-hidden animate-fade-in" style={{ background: 'hsl(var(--card))', animationDelay: '0.2s' }}>
          {[
            { icon: 'Share2', label: 'Поделиться профилем', color: 'var(--accent-green)' },
            { icon: 'QrCode', label: 'Мой QR-код', color: 'var(--accent-green)' },
            { icon: 'LogOut', label: 'Выйти из аккаунта', color: '#ef4444' },
          ].map((item, i) => (
            <button
              key={item.label}
              className="flex items-center gap-3 px-4 py-3.5 w-full transition-colors hover:bg-white/5"
              style={{ borderBottom: i < 2 ? '1px solid hsl(var(--border))' : 'none' }}
            >
              <Icon name={item.icon} size={16} style={{ color: item.color }} />
              <span className="text-sm font-medium" style={{ color: item.color }}>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}