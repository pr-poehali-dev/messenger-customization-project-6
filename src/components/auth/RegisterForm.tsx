import React, { useState } from 'react';
import { apiRegister, validatePassword } from '@/lib/auth';
import MathCaptcha from './MathCaptcha';
import PasswordStrength from './PasswordStrength';
import Icon from '@/components/ui/icon';

interface RegisterFormProps {
  onSuccess: (identifier: string, otpDemo?: string) => void;
  onLogin: () => void;
}

export default function RegisterForm({ onSuccess, onLogin }: RegisterFormProps) {
  const [identifierType, setIdentifierType] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pwErr = validatePassword(password);
  const canSubmit = identifier.trim() && displayName.trim() && password && !pwErr &&
    password === confirmPassword && captchaToken && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRegister({
        identifier: identifier.trim(),
        password,
        display_name: displayName.trim(),
        captcha_token: captchaToken,
      });
      onSuccess(identifier.trim(), data.otp_demo);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка регистрации');
      setCaptchaToken('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Создать аккаунт</h2>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Быстрая регистрация</p>
      </div>

      {/* Toggle email/phone */}
      <div className="flex rounded-xl overflow-hidden" style={{ background: 'hsl(var(--secondary))' }}>
        {(['email', 'phone'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => { setIdentifierType(t); setIdentifier(''); }}
            className="flex-1 py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
            style={{
              background: identifierType === t ? 'var(--accent-green)' : 'transparent',
              color: identifierType === t ? 'hsl(var(--background))' : 'var(--text-muted)',
              borderRadius: '10px',
              margin: '3px',
            }}
          >
            <Icon name={t === 'email' ? 'Mail' : 'Smartphone'} size={14} />
            {t === 'email' ? 'Email' : 'Телефон'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Ваше имя
          </label>
          <div className="relative">
            <Icon name="User" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Иван Иванов"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: 'hsl(var(--secondary))', color: 'var(--text-primary)', border: '1.5px solid hsl(var(--border))' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-green)')}
              onBlur={e => (e.target.style.borderColor = 'hsl(var(--border))')}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            {identifierType === 'email' ? 'Email-адрес' : 'Номер телефона'}
          </label>
          <div className="relative">
            <Icon name={identifierType === 'email' ? 'Mail' : 'Smartphone'} size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type={identifierType === 'email' ? 'email' : 'tel'}
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder={identifierType === 'email' ? 'you@example.com' : '+7 900 000-00-00'}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: 'hsl(var(--secondary))', color: 'var(--text-primary)', border: '1.5px solid hsl(var(--border))' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-green)')}
              onBlur={e => (e.target.style.borderColor = 'hsl(var(--border))')}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Пароль</label>
          <div className="relative">
            <Icon name="Lock" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Минимум 8 символов"
              className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: 'hsl(var(--secondary))', color: 'var(--text-primary)', border: '1.5px solid hsl(var(--border))' }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-green)')}
              onBlur={e => (e.target.style.borderColor = 'hsl(var(--border))')}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={15} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Подтвердите пароль</label>
          <div className="relative">
            <Icon name="ShieldCheck" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Повторите пароль"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'hsl(var(--secondary))',
                color: 'var(--text-primary)',
                border: `1.5px solid ${confirmPassword && password !== confirmPassword ? '#ef4444' : 'hsl(var(--border))'}`,
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent-green)')}
              onBlur={e => (e.target.style.borderColor = confirmPassword && password !== confirmPassword ? '#ef4444' : 'hsl(var(--border))')}
            />
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-[11px] mt-1" style={{ color: '#ef4444' }}>Пароли не совпадают</p>
          )}
        </div>
      </div>

      <MathCaptcha onVerify={setCaptchaToken} onReset={() => setCaptchaToken('')} />

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
            Регистрируем...
          </span>
        ) : 'Зарегистрироваться'}
      </button>

      <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        Уже есть аккаунт?{' '}
        <button type="button" onClick={onLogin} style={{ color: 'var(--accent-green)' }} className="font-medium">
          Войти
        </button>
      </p>
    </form>
  );
}
