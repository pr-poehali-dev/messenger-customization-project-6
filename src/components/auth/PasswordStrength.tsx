import React from 'react';
import Icon from '@/components/ui/icon';

interface PasswordStrengthProps {
  password: string;
}

function getStrength(p: string): { score: number; label: string; color: string } {
  if (!p) return { score: 0, label: '', color: '' };
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score <= 1) return { score, label: 'Слабый', color: '#ef4444' };
  if (score <= 2) return { score, label: 'Слабый', color: '#f59e0b' };
  if (score <= 3) return { score, label: 'Средний', color: '#f59e0b' };
  if (score <= 4) return { score, label: 'Хороший', color: '#3ecf8e' };
  return { score, label: 'Отличный', color: '#22d3ee' };
}

const checks = [
  { label: 'Минимум 8 символов', test: (p: string) => p.length >= 8 },
  { label: 'Заглавная буква (A–Z)', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Цифра (0–9)', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Спецсимвол (!@#...)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;
  const { score, label, color } = getStrength(password);
  const bars = 5;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {Array.from({ length: bars }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: i < score ? color : 'hsl(var(--border))' }}
            />
          ))}
        </div>
        {label && <span className="text-xs font-medium" style={{ color }}>{label}</span>}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-1.5">
            <Icon
              name={c.test(password) ? 'CheckCircle' : 'Circle'}
              size={12}
              style={{ color: c.test(password) ? 'var(--accent-green)' : 'var(--text-muted)', flexShrink: 0 }}
            />
            <span className="text-[10px]" style={{ color: c.test(password) ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
