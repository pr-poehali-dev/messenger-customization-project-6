import React from 'react';
import { chats, Chat } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';
import StoriesBar from './StoriesBar';

interface ChatListProps {
  activeChat: string | null;
  onSelectChat: (id: string) => void;
}

export default function ChatList({ activeChat, onSelectChat }: ChatListProps) {
  return (
    <div className="flex flex-col h-full">
      <StoriesBar />
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat, i) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            active={chat.id === activeChat}
            onClick={() => onSelectChat(chat.id)}
            delay={i * 0.04}
          />
        ))}
      </div>
    </div>
  );
}

function ChatItem({ chat, active, onClick, delay }: { chat: Chat; active: boolean; onClick: () => void; delay: number }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 animate-fade-in"
      style={{
        animationDelay: `${delay}s`,
        background: active ? 'var(--accent-green-dim)' : 'transparent',
        borderLeft: active ? '2px solid var(--accent-green)' : '2px solid transparent',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <Avatar initials={chat.initials} color={chat.color} size="md" online={chat.online} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5">
            {chat.pinned && <Icon name="Pin" size={11} style={{ color: 'var(--text-muted)' }} />}
            <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
              {chat.name}
            </span>
          </div>
          <span className="text-[11px] flex-shrink-0 ml-2" style={{ color: chat.unread ? 'var(--accent-green)' : 'var(--text-muted)' }}>
            {chat.time}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0">
            {chat.typing ? (
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  <span className="typing-dot w-1.5 h-1.5 rounded-full block" style={{ background: 'var(--accent-green)' }} />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full block" style={{ background: 'var(--accent-green)' }} />
                  <span className="typing-dot w-1.5 h-1.5 rounded-full block" style={{ background: 'var(--accent-green)' }} />
                </div>
                <span className="text-xs" style={{ color: 'var(--accent-green)' }}>печатает</span>
              </div>
            ) : (
              <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {chat.lastMessage}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {chat.muted && <Icon name="BellOff" size={12} style={{ color: 'var(--text-muted)' }} />}
            {chat.unread > 0 && (
              <div
                className="min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold px-1"
                style={{
                  background: chat.muted ? 'hsl(var(--border))' : 'var(--accent-green)',
                  color: chat.muted ? 'var(--text-muted)' : 'hsl(var(--background))'
                }}
              >
                {chat.unread > 99 ? '99+' : chat.unread}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
