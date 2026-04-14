import React, { useState } from 'react';
import Sidebar, { Section } from '@/components/messenger/Sidebar';
import ChatList from '@/components/messenger/ChatList';
import ChatWindow from '@/components/messenger/ChatWindow';
import ContactsView from '@/components/messenger/ContactsView';
import CallsView from '@/components/messenger/CallsView';
import ChannelsView from '@/components/messenger/ChannelsView';
import SearchView from '@/components/messenger/SearchView';
import SettingsView from '@/components/messenger/SettingsView';
import ProfileView from '@/components/messenger/ProfileView';

export default function Index() {
  const [section, setSection] = useState<Section>('chats');
  const [activeChat, setActiveChat] = useState<string | null>('1');

  const handleNavigate = (s: Section) => {
    setSection(s);
  };

  const renderLeftPanel = () => {
    switch (section) {
      case 'chats':
        return (
          <ChatList
            activeChat={activeChat}
            onSelectChat={(id) => setActiveChat(id)}
          />
        );
      case 'contacts': return <ContactsView />;
      case 'calls': return <CallsView />;
      case 'channels': return <ChannelsView />;
      case 'search': return <SearchView />;
      case 'settings': return <SettingsView />;
      case 'profile': return <ProfileView />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-golos" style={{ background: 'hsl(var(--background))' }}>
      <Sidebar active={section} onNavigate={handleNavigate} />

      {/* Left panel */}
      <div
        className="flex flex-col flex-shrink-0 border-r overflow-hidden"
        style={{
          width: '300px',
          borderColor: 'hsl(var(--border))',
          background: 'hsl(var(--background))',
        }}
      >
        {renderLeftPanel()}
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {section === 'chats' ? (
          <ChatWindow chatId={activeChat} />
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center"
            style={{ background: 'hsl(220, 16%, 7%)' }}
          >
            <div className="animate-scale-in text-center">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'var(--accent-green-dim)', border: '1px solid var(--accent-green-hover)' }}
              >
                <span className="text-4xl font-black" style={{ color: 'var(--accent-green)' }}>V</span>
              </div>
              <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Volta</h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Мессенджер нового поколения</p>
              <div className="flex items-center justify-center gap-3 mt-6 flex-wrap px-4">
                {['🔒 Шифрование', '⚡ WebSocket', '🌍 Кроссплатформа'].map(f => (
                  <span
                    key={f}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)' }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
