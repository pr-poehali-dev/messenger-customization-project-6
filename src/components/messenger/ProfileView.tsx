import React from 'react';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';
import { User } from '@/lib/auth';

interface ProfileViewProps {
  user: User | null;
  onLogout?: () => void;
}

export default function ProfileView({ user, onLogout }: ProfileViewProps) {
  const displayName = user?.display_name || 'Пользователь';
  const username = user?.username || 'user';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const color = user?.avatar_color || '#3ecf8e';
  const email = user?.email;
  const phone = user?.phone;

  const infoItems = [
    ...(phone ? [{ icon: 'Smartphone', label: 'Телефон', value: phone }] : []),
    ...(email ? [{ icon: 'Mail', label: 'Email', value: email }] : []),
    { icon: 'AtSign', label: 'Username', value: `@${username}` },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Профиль</h1>
        <button className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>Изменить</button>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        {/* Profile card */}
        <div className="rounded-2xl p-5 mb-4 flex flex-col items-center text-center animate-scale-in" style={{ background: 'hsl(var(--card))' }}>
          <div className="relative mb-3">
            <Avatar initials={initials} color={color} size="xl" online={true} />
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-green)' }}>
              <Icon name="Camera" size={13} style={{ color: 'hsl(var(--background))' }} />
            </button>
          </div>
          <h2 className="text-lg font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{displayName}</h2>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>@{username}</p>
          <div className="flex items-center gap-1.5 mt-1">
            {user?.is_verified && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)' }}>
                <Icon name="BadgeCheck" size={11} />
                Подтверждён
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'Друзья', value: '0' },
            { label: 'Каналы', value: '0' },
            { label: 'Медиа', value: '0' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: 'hsl(var(--card))' }}>
              <div className="text-lg font-bold" style={{ color: 'var(--accent-green)' }}>{stat.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Info */}
        {infoItems.length > 0 && (
          <div className="rounded-2xl overflow-hidden mb-4 animate-fade-in" style={{ background: 'hsl(var(--card))', animationDelay: '0.15s' }}>
            {infoItems.map((item, i) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 py-3.5"
                style={{ borderBottom: i < infoItems.length - 1 ? '1px solid hsl(var(--border))' : 'none' }}
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
        )}

        {/* Actions */}
        <div className="rounded-2xl overflow-hidden animate-fade-in" style={{ background: 'hsl(var(--card))', animationDelay: '0.2s' }}>
          <button className="flex items-center gap-3 px-4 py-3.5 w-full transition-colors hover:bg-white/5" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
            <Icon name="Share2" size={16} style={{ color: 'var(--accent-green)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>Поделиться профилем</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3.5 w-full transition-colors hover:bg-white/5" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
            <Icon name="QrCode" size={16} style={{ color: 'var(--accent-green)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>Мой QR-код</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3.5 w-full transition-colors hover:bg-red-500/10"
          >
            <Icon name="LogOut" size={16} style={{ color: '#ef4444' }} />
            <span className="text-sm font-medium" style={{ color: '#ef4444' }}>Выйти из аккаунта</span>
          </button>
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}
