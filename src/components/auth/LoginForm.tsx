import React, { useState } from 'react';
import { apiLogin, storeToken, User, validatePassword } from '@/lib/auth';
import MathCaptcha from './MathCaptcha';
import Icon from '@/components/ui/icon';

interface LoginFormProps {
  onSuccess: (user: User, token: string) => void;
  onRegister: () => void;
  onForgot: () => void;
}

export default function LoginForm({ onSuccess, onRegister, onForgot }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = identifier.trim() && password && captchaToken && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiLogin({ identifier: identifier.trim(), password, captcha_token: captchaToken });
      storeToken(data.token);
      onSuccess(data.user, data.token);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка входа');
      setCaptchaToken('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Вход в аккаунт</h2>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Email или номер телефона</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Email или телефон
          </label>
          <div className="relative">
            <Icon
              name={identifier.includes('@') ? 'Mail' : 'Smartphone'}
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="you@example.com или +7 900..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'hsl(var(--secondary))',
                color: 'var(--text-primary)',
                border: '1.5px solid hsl(var(--border))',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-green)')}
              onBlur={e => (e.target.style.borderColor = 'hsl(var(--border))')}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Пароль
          </label>
          <div className="relative">
            <Icon name="Lock" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'hsl(var(--secondary))',
                color: 'var(--text-primary)',
                border: '1.5px solid hsl(var(--border))',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-green)')}
              onBlur={e => (e.target.style.borderColor = 'hsl(var(--border))')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={15} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>
      </div>

      <MathCaptcha
        onVerify={setCaptchaToken}
        onReset={() => setCaptchaToken('')}
      />

      {error && (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm animate-fade-in"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <Icon name="AlertCircle" size={15} />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-150"
        style={{
          background: canSubmit ? 'var(--accent-green)' : 'hsl(var(--secondary))',
          color: canSubmit ? 'hsl(var(--background))' : 'var(--text-muted)',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Icon name="Loader2" size={15} className="animate-spin" />
            Входим...
          </span>
        ) : 'Войти'}
      </button>

      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onForgot}
          className="transition-colors hover:opacity-80"
          style={{ color: 'var(--accent-green)' }}
        >
          Забыли пароль?
        </button>
        <button
          type="button"
          onClick={onRegister}
          className="transition-colors hover:opacity-80"
          style={{ color: 'var(--text-muted)' }}
        >
          Создать аккаунт →
        </button>
      </div>
    </form>
  );
}
