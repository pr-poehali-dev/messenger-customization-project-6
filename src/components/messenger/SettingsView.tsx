import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

type ThemeColor = 'green' | 'blue' | 'purple' | 'orange' | 'pink' | 'cyan';
type FontSize = 'small' | 'medium' | 'large';
type BubbleStyle = 'rounded' | 'sharp' | 'minimal';

const themeColors: { id: ThemeColor; color: string; label: string }[] = [
  { id: 'green', color: '#3ecf8e', label: 'Зелёный' },
  { id: 'blue', color: '#3b82f6', label: 'Синий' },
  { id: 'purple', color: '#8b5cf6', label: 'Фиолетовый' },
  { id: 'orange', color: '#f59e0b', label: 'Оранжевый' },
  { id: 'pink', color: '#ec4899', label: 'Розовый' },
  { id: 'cyan', color: '#06b6d4', label: 'Голубой' },
];

export default function SettingsView() {
  const [activeSection, setActiveSection] = useState<string | null>('appearance');

  const sections = [
    { id: 'appearance', icon: 'Palette', label: 'Внешний вид', desc: 'Тема, цвета, шрифты' },
    { id: 'notifications', icon: 'Bell', label: 'Уведомления', desc: 'Звуки, вибрация, баннеры' },
    { id: 'privacy', icon: 'Shield', label: 'Конфиденциальность', desc: 'Кто видит мои данные' },
    { id: 'security', icon: 'Lock', label: 'Безопасность', desc: 'Двухфакторная аутентификация' },
    { id: 'storage', icon: 'HardDrive', label: 'Хранилище', desc: 'Кэш и загруженные файлы' },
    { id: 'language', icon: 'Globe', label: 'Язык', desc: 'Русский' },
    { id: 'about', icon: 'Info', label: 'О приложении', desc: 'Volta 1.0.0 Beta' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Настройки</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <div className="mb-2 px-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Разделы
          </span>
        </div>
        {sections.map((section, i) => (
          <div key={section.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
            <button
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl w-full transition-colors hover:bg-white/5 mb-0.5"
              style={{
                background: activeSection === section.id ? 'var(--accent-green-dim)' : 'transparent',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: activeSection === section.id ? 'var(--accent-green)' : 'hsl(var(--secondary))' }}
              >
                <Icon
                  name={section.icon}
                  size={17}
                  style={{ color: activeSection === section.id ? 'hsl(var(--background))' : 'var(--text-secondary)' }}
                />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{section.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{section.desc}</div>
              </div>
              <Icon
                name={activeSection === section.id ? 'ChevronUp' : 'ChevronDown'}
                size={15}
                style={{ color: 'var(--text-muted)' }}
              />
            </button>

            {activeSection === section.id && section.id === 'appearance' && <AppearancePanel />}
            {activeSection === section.id && section.id === 'notifications' && <NotificationsPanel />}
            {activeSection === section.id && section.id === 'privacy' && <PrivacyPanel />}
          </div>
        ))}
      </div>
    </div>
  );
}

function AppearancePanel() {
  const [selectedColor, setSelectedColor] = useState<ThemeColor>('green');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [bubbleStyle, setBubbleStyle] = useState<BubbleStyle>('rounded');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  return (
    <div className="mx-3 mb-3 rounded-xl p-4 animate-scale-in" style={{ background: 'hsl(var(--card))' }}>
      <div className="mb-4">
        <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Акцентный цвет
        </div>
        <div className="flex gap-2 flex-wrap">
          {themeColors.map(tc => (
            <button
              key={tc.id}
              onClick={() => setSelectedColor(tc.id)}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className="w-9 h-9 rounded-full transition-transform hover:scale-110"
                style={{
                  background: tc.color,
                  border: selectedColor === tc.id ? `3px solid white` : '3px solid transparent',
                  boxShadow: selectedColor === tc.id ? `0 0 0 2px ${tc.color}` : 'none',
                  transform: selectedColor === tc.id ? 'scale(1.15)' : 'scale(1)',
                }}
              />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{tc.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 mb-4" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Размер шрифта
        </div>
        <div className="flex gap-2">
          {(['small', 'medium', 'large'] as FontSize[]).map(size => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: fontSize === size ? 'var(--accent-green)' : 'hsl(var(--secondary))',
                color: fontSize === size ? 'hsl(var(--background))' : 'var(--text-secondary)',
              }}
            >
              {size === 'small' ? 'Мелкий' : size === 'medium' ? 'Средний' : 'Крупный'}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 mb-4" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Стиль пузырьков
        </div>
        <div className="flex gap-2">
          {(['rounded', 'sharp', 'minimal'] as BubbleStyle[]).map(style => (
            <button
              key={style}
              onClick={() => setBubbleStyle(style)}
              className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: bubbleStyle === style ? 'var(--accent-green)' : 'hsl(var(--secondary))',
                color: bubbleStyle === style ? 'hsl(var(--background))' : 'var(--text-secondary)',
              }}
            >
              {style === 'rounded' ? 'Округлый' : style === 'sharp' ? 'Острый' : 'Минимал'}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-4" style={{ borderColor: 'hsl(var(--border))' }}>
        {[
          { label: 'Компактный режим', desc: 'Меньше отступов', value: compactMode, toggle: () => setCompactMode(!compactMode) },
          { label: 'Анимации', desc: 'Плавные переходы', value: animations, toggle: () => setAnimations(!animations) },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
            <button
              onClick={item.toggle}
              className="w-11 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0"
              style={{ background: item.value ? 'var(--accent-green)' : 'hsl(var(--secondary))' }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm"
                style={{ transform: item.value ? 'translateX(22px)' : 'translateX(4px)' }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const [sound, setSound] = useState(true);
  const [preview, setPreview] = useState(true);
  const [groups, setGroups] = useState(true);

  const items = [
    { label: 'Звук уведомлений', value: sound, toggle: () => setSound(!sound) },
    { label: 'Предпросмотр сообщений', value: preview, toggle: () => setPreview(!preview) },
    { label: 'Уведомления групп', value: groups, toggle: () => setGroups(!groups) },
  ];

  return (
    <div className="mx-3 mb-3 rounded-xl p-4 animate-scale-in" style={{ background: 'hsl(var(--card))' }}>
      {items.map(item => (
        <div key={item.label} className="flex items-center justify-between py-2.5">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
          <button
            onClick={item.toggle}
            className="w-11 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0"
            style={{ background: item.value ? 'var(--accent-green)' : 'hsl(var(--secondary))' }}
          >
            <div
              className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm"
              style={{ transform: item.value ? 'translateX(22px)' : 'translateX(4px)' }}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

function PrivacyPanel() {
  return (
    <div className="mx-3 mb-3 rounded-xl p-4 animate-scale-in" style={{ background: 'hsl(var(--card))' }}>
      {[
        { label: 'Последняя активность', value: 'Мои контакты' },
        { label: 'Фото профиля', value: 'Все' },
        { label: 'Номер телефона', value: 'Никто' },
      ].map(item => (
        <div key={item.label} className="flex items-center justify-between py-2.5">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
          <span className="text-sm" style={{ color: 'var(--accent-green)' }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
