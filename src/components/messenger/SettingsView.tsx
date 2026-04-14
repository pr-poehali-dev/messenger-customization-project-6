import React, { useState } from 'react';
import Icon from '@/components/ui/icon';

type FontSize = 'small' | 'medium' | 'large';
type BubbleStyle = 'rounded' | 'sharp' | 'minimal';

// ── 10 App Icons ──────────────────────────────────────────────────────────
const APP_ICONS = [
  {
    id: 'bolt', label: 'Молния',
    render: (c: string) => (
      <div className="w-full h-full rounded-2xl flex items-center justify-center font-black text-xl" style={{ background: `linear-gradient(135deg, ${c}, ${c}aa)` }}>
        ⚡
      </div>
    ),
  },
  {
    id: 'letter', label: 'Буква V',
    render: (c: string) => (
      <div className="w-full h-full rounded-2xl flex items-center justify-center font-black text-2xl" style={{ background: `linear-gradient(135deg, ${c}dd, ${c}88)`, color: '#fff' }}>
        V
      </div>
    ),
  },
  {
    id: 'wave', label: 'Волна',
    render: (_c: string) => (
      <div className="w-full h-full rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: '#111' }}>
        <div style={{ fontSize: '26px' }}>〰️</div>
      </div>
    ),
  },
  {
    id: 'chat-bubble', label: 'Пузырь',
    render: (c: string) => (
      <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${c}22, ${c}44)`, border: `2px solid ${c}66` }}>
        <div style={{ fontSize: '22px' }}>💬</div>
      </div>
    ),
  },
  {
    id: 'shield', label: 'Щит',
    render: (_c: string) => (
      <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
        <div style={{ fontSize: '22px' }}>🛡️</div>
      </div>
    ),
  },
  {
    id: 'neon', label: 'Неон',
    render: (c: string) => (
      <div className="w-full h-full rounded-2xl flex items-center justify-center font-black text-2xl" style={{ background: '#000', color: c, textShadow: `0 0 10px ${c}, 0 0 20px ${c}` }}>
        V
      </div>
    ),
  },
  {
    id: 'gradient', label: 'Градиент',
    render: (_c: string) => (
      <div className="w-full h-full rounded-2xl flex items-center justify-center font-black text-xl text-white" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)' }}>
        V
      </div>
    ),
  },
  {
    id: 'minimal', label: 'Минимал',
    render: (c: string) => (
      <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: '#fff' }}>
        <div className="font-black text-2xl" style={{ color: c }}>V</div>
      </div>
    ),
  },
  {
    id: 'planet', label: 'Планета',
    render: (_c: string) => (
      <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
        <div style={{ fontSize: '22px' }}>🌍</div>
      </div>
    ),
  },
  {
    id: 'fire', label: 'Огонь',
    render: (_c: string) => (
      <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f7971e, #ffd200)' }}>
        <div style={{ fontSize: '24px' }}>🔥</div>
      </div>
    ),
  },
];

// ── Full Color Palette ─────────────────────────────────────────────────────
const COLOR_PALETTE = [
  '#22c55e', '#3ecf8e', '#10b981', '#059669', '#16a34a', '#4ade80',
  '#3b82f6', '#2563eb', '#1d4ed8', '#60a5fa', '#0ea5e9', '#38bdf8',
  '#8b5cf6', '#7c3aed', '#6d28d9', '#a855f7', '#9333ea', '#c084fc',
  '#ec4899', '#db2777', '#be185d', '#f43f5e', '#ef4444', '#dc2626',
  '#f59e0b', '#d97706', '#f97316', '#ea580c', '#fbbf24', '#fde047',
  '#06b6d4', '#0891b2', '#14b8a6', '#0d9488', '#22d3ee', '#67e8f9',
  '#6366f1', '#4f46e5', '#e11d48', '#64748b', '#94a3b8', '#ffffff',
];

// ── Preview Component ──────────────────────────────────────────────────────
function InterfacePreview({
  accentColor, fontSize, bubbleStyle, compactMode, selectedIcon,
}: {
  accentColor: string; fontSize: FontSize; bubbleStyle: BubbleStyle;
  compactMode: boolean; selectedIcon: string;
}) {
  const fontSizes = { small: '10px', medium: '12px', large: '14px' };
  const bubbleRadius = { rounded: '16px 16px 4px 16px', sharp: '6px 6px 2px 6px', minimal: '4px' };
  const padding = compactMode ? '5px 9px' : '7px 11px';
  const icon = APP_ICONS.find(i => i.id === selectedIcon) || APP_ICONS[1];

  return (
    <div className="rounded-xl overflow-hidden animate-scale-in" style={{ background: 'hsl(220, 16%, 9%)', border: '1px solid hsl(var(--border))' }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(220, 16%, 11%)' }}>
        <div className="w-6 h-6 flex-shrink-0">{icon.render(accentColor)}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate" style={{ color: 'var(--text-primary)', fontSize: '10px' }}>Алексей Кравцов</div>
          <div style={{ color: accentColor, fontSize: '9px' }}>онлайн</div>
        </div>
        <div className="flex gap-1">
          {['Phone', 'Video'].map(ic => (
            <div key={ic} className="w-5 h-5 flex items-center justify-center rounded-full" style={{ background: `${accentColor}22` }}>
              <Icon name={ic} size={9} style={{ color: accentColor }} />
            </div>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 space-y-1.5" style={{ background: 'hsl(220, 16%, 7%)' }}>
        <div className="flex justify-start">
          <div style={{ background: 'hsl(220, 12%, 18%)', borderRadius: bubbleRadius[bubbleStyle], padding, fontSize: fontSizes[fontSize], color: 'var(--text-primary)', maxWidth: '70%' }}>
            Привет! Как дела? 👋
          </div>
        </div>
        <div className="flex justify-end">
          <div style={{ background: accentColor + '55', borderRadius: bubbleStyle === 'rounded' ? '16px 16px 16px 4px' : bubbleStyle === 'sharp' ? '6px 6px 6px 2px' : '4px', padding, fontSize: fontSizes[fontSize], color: 'var(--text-primary)', maxWidth: '70%', border: `1px solid ${accentColor}44` }}>
            Всё отлично! 🚀
          </div>
        </div>
        <div className="flex justify-start">
          <div style={{ background: 'hsl(220, 12%, 18%)', borderRadius: bubbleRadius[bubbleStyle], padding, fontSize: fontSizes[fontSize], color: 'var(--text-primary)', maxWidth: '70%' }}>
            Встретимся в 10?
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 border-t" style={{ borderColor: 'hsl(var(--border))', background: 'hsl(220, 16%, 11%)' }}>
        <div className="flex-1 rounded-lg px-2.5 py-1.5 text-[10px]" style={{ background: 'hsl(220, 12%, 16%)', color: 'var(--text-muted)' }}>Написать...</div>
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: accentColor }}>
          <Icon name="Send" size={10} style={{ color: '#000' }} />
        </div>
      </div>
    </div>
  );
}

// ── Main SettingsView ──────────────────────────────────────────────────────
export default function SettingsView() {
  const [activeSection, setActiveSection] = useState<string | null>('appearance');

  const sections = [
    { id: 'appearance', icon: 'Palette', label: 'Внешний вид', desc: 'Тема, цвета, шрифты, иконка' },
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
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Разделы</span>
        </div>
        {sections.map((section, i) => (
          <div key={section.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
            <button
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl w-full transition-colors hover:bg-white/5 mb-0.5"
              style={{ background: activeSection === section.id ? 'var(--accent-green-dim)' : 'transparent' }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: activeSection === section.id ? 'var(--accent-green)' : 'hsl(var(--secondary))' }}>
                <Icon name={section.icon} size={17} style={{ color: activeSection === section.id ? 'hsl(var(--background))' : 'var(--text-secondary)' }} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{section.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{section.desc}</div>
              </div>
              <Icon name={activeSection === section.id ? 'ChevronUp' : 'ChevronDown'} size={15} style={{ color: 'var(--text-muted)' }} />
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

// ── Appearance Panel ───────────────────────────────────────────────────────
function AppearancePanel() {
  const [accentColor, setAccentColor] = useState('#3ecf8e');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [bubbleStyle, setBubbleStyle] = useState<BubbleStyle>('rounded');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState('letter');
  const [previewTab, setPreviewTab] = useState<'chat' | 'icon'>('chat');

  const applyAccent = (color: string) => {
    setAccentColor(color);
  };

  return (
    <div className="mx-3 mb-3 rounded-xl overflow-hidden animate-scale-in" style={{ background: 'hsl(var(--card))' }}>
      {/* Live Preview */}
      <div className="p-4 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Предпросмотр</span>
          <div className="flex rounded-lg overflow-hidden" style={{ background: 'hsl(var(--secondary))' }}>
            {(['chat', 'icon'] as const).map(t => (
              <button key={t} onClick={() => setPreviewTab(t)}
                className="px-2.5 py-1 text-xs font-medium transition-all"
                style={{ background: previewTab === t ? accentColor : 'transparent', color: previewTab === t ? '#000' : 'var(--text-muted)', borderRadius: '6px', margin: '2px' }}
              >
                {t === 'chat' ? 'Чат' : 'Иконка'}
              </button>
            ))}
          </div>
        </div>
        {previewTab === 'chat' ? (
          <InterfacePreview accentColor={accentColor} fontSize={fontSize} bubbleStyle={bubbleStyle} compactMode={compactMode} selectedIcon={selectedIcon} />
        ) : (
          <div className="flex items-center justify-center py-4 gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20">{APP_ICONS.find(i => i.id === selectedIcon)?.render(accentColor)}</div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{APP_ICONS.find(i => i.id === selectedIcon)?.label}</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12">{APP_ICONS.find(i => i.id === selectedIcon)?.render(accentColor)}</div>
              <div className="w-8 h-8">{APP_ICONS.find(i => i.id === selectedIcon)?.render(accentColor)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Color Palette */}
      <div className="p-4 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Акцентный цвет</div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {COLOR_PALETTE.map(color => (
            <button key={color} onClick={() => applyAccent(color)}
              className="rounded-full transition-all hover:scale-110 flex-shrink-0"
              style={{
                width: '24px', height: '24px', background: color,
                border: accentColor === color ? '2.5px solid white' : '2px solid transparent',
                boxShadow: accentColor === color ? `0 0 0 2px ${color}` : 'none',
                transform: accentColor === color ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg border-2 border-dashed flex items-center justify-center" style={{ background: accentColor, borderColor: 'rgba(255,255,255,0.3)' }}>
                <Icon name="Pipette" size={13} style={{ color: 'rgba(255,255,255,0.8)' }} />
              </div>
              <input type="color" value={accentColor} onChange={e => applyAccent(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
            </div>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Любой цвет</span>
          </label>
          <div className="flex-1 text-xs font-mono px-2 py-1 rounded-lg" style={{ background: 'hsl(var(--secondary))', color: 'var(--text-muted)' }}>
            {accentColor.toUpperCase()}
          </div>
        </div>
      </div>

      {/* App Icons */}
      <div className="p-4 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Иконка приложения</div>
        <div className="grid grid-cols-5 gap-2">
          {APP_ICONS.map(icon => (
            <button key={icon.id} onClick={() => setSelectedIcon(icon.id)} className="flex flex-col items-center gap-1 transition-all hover:scale-105">
              <div className="w-11 h-11 transition-all" style={{ outline: selectedIcon === icon.id ? `2.5px solid ${accentColor}` : '2px solid transparent', outlineOffset: '2px', borderRadius: '14px', overflow: 'hidden' }}>
                {icon.render(accentColor)}
              </div>
              <span className="text-[9px] text-center leading-tight" style={{ color: selectedIcon === icon.id ? accentColor : 'var(--text-muted)' }}>
                {icon.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="p-4 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Размер шрифта</div>
        <div className="flex gap-2">
          {([['small', 'A', 'Мелкий'], ['medium', 'A', 'Средний'], ['large', 'A', 'Крупный']] as [FontSize, string, string][]).map(([size, letter, label]) => (
            <button key={size} onClick={() => setFontSize(size)}
              className="flex-1 py-2 rounded-lg font-medium transition-all flex flex-col items-center gap-0.5"
              style={{ background: fontSize === size ? accentColor : 'hsl(var(--secondary))', color: fontSize === size ? '#000' : 'var(--text-secondary)', fontSize: size === 'small' ? '14px' : size === 'medium' ? '17px' : '20px' }}
            >
              {letter}
              <span style={{ fontSize: '9px' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bubble Style */}
      <div className="p-4 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
        <div className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Стиль пузырьков</div>
        <div className="flex gap-2">
          {(['rounded', 'sharp', 'minimal'] as BubbleStyle[]).map(style => (
            <button key={style} onClick={() => setBubbleStyle(style)}
              className="flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-lg transition-all"
              style={{ background: bubbleStyle === style ? `${accentColor}22` : 'hsl(var(--secondary))', border: `1.5px solid ${bubbleStyle === style ? accentColor : 'transparent'}` }}
            >
              <div className="w-12 h-5 text-white flex items-center justify-center" style={{ background: accentColor + '88', borderRadius: style === 'rounded' ? '10px 10px 2px 10px' : style === 'sharp' ? '3px 3px 1px 3px' : '2px', fontSize: '8px' }}>
                Текст
              </div>
              <span className="text-[10px]" style={{ color: bubbleStyle === style ? accentColor : 'var(--text-muted)' }}>
                {style === 'rounded' ? 'Округлый' : style === 'sharp' ? 'Острый' : 'Минимал'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles + Apply */}
      <div className="p-4">
        {[
          { label: 'Компактный режим', desc: 'Меньше отступов', value: compactMode, toggle: () => setCompactMode(!compactMode) },
          { label: 'Анимации', desc: 'Плавные переходы и эффекты', value: animations, toggle: () => setAnimations(!animations) },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-2.5">
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
            <button onClick={item.toggle}
              className="w-11 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0"
              style={{ background: item.value ? accentColor : 'hsl(var(--secondary))' }}
            >
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm" style={{ transform: item.value ? 'translateX(22px)' : 'translateX(4px)' }} />
            </button>
          </div>
        ))}
        <button
          className="w-full mt-3 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: accentColor, color: '#000' }}
          onClick={() => {
            document.documentElement.style.setProperty('--accent-green', accentColor);
            document.documentElement.style.setProperty('--accent-green-dim', `${accentColor}1a`);
            document.documentElement.style.setProperty('--accent-green-hover', `${accentColor}33`);
          }}
        >
          ✓ Применить настройки
        </button>
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
          <button onClick={item.toggle} className="w-11 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0" style={{ background: item.value ? 'var(--accent-green)' : 'hsl(var(--secondary))' }}>
            <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm" style={{ transform: item.value ? 'translateX(22px)' : 'translateX(4px)' }} />
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
