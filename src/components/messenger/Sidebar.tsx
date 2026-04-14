import React from 'react';
import Icon from '@/components/ui/icon';

export type Section = 'chats' | 'contacts' | 'calls' | 'channels' | 'search' | 'settings' | 'profile';

interface NavItem {
  id: Section;
  icon: string;
  label: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'profile', icon: 'User', label: 'Профиль' },
  { id: 'chats', icon: 'MessageSquare', label: 'Чаты', badge: 4 },
  { id: 'channels', icon: 'Radio', label: 'Каналы' },
  { id: 'contacts', icon: 'Users', label: 'Контакты' },
  { id: 'calls', icon: 'Phone', label: 'Звонки' },
  { id: 'search', icon: 'Search', label: 'Поиск' },
];

const bottomItems: NavItem[] = [
  { id: 'settings', icon: 'Settings', label: 'Настройки' },
];

interface SidebarProps {
  active: Section;
  onNavigate: (section: Section) => void;
}

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <div
      className="flex flex-col items-center py-4 gap-1 flex-shrink-0"
      style={{
        width: '64px',
        background: 'hsl(220, 16%, 7%)',
        borderRight: '1px solid hsl(var(--border))',
      }}
    >
      {/* Logo */}
      <div className="mb-4 mt-1">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
          style={{ background: 'var(--accent-green)', color: 'hsl(var(--background))' }}
        >
          V
        </div>
      </div>

      {/* Nav */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {navItems.map(item => (
          <SidebarBtn key={item.id} item={item} active={active === item.id} onClick={() => onNavigate(item.id)} />
        ))}
      </div>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-1">
        {bottomItems.map(item => (
          <SidebarBtn key={item.id} item={item} active={active === item.id} onClick={() => onNavigate(item.id)} />
        ))}
      </div>
    </div>
  );
}

function SidebarBtn({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={item.label}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 group"
      style={{
        background: active ? 'var(--accent-green-dim)' : 'transparent',
        color: active ? 'var(--accent-green)' : 'var(--text-muted)',
      }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
          (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
        }
      }}
    >
      <Icon name={item.icon} size={20} />
      {item.badge && item.badge > 0 && (
        <div
          className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{ background: 'var(--accent-green)', color: 'hsl(var(--background))' }}
        >
          {item.badge}
        </div>
      )}
      {active && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
          style={{ background: 'var(--accent-green)', left: '-4px' }}
        />
      )}
    </button>
  );
}
