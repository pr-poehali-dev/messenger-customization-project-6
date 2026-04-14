import React, { useState } from 'react';
import { apiSendOtp, apiResetPassword, validatePassword } from '@/lib/auth';
import MathCaptcha from './MathCaptcha';
import OtpInput from './OtpInput';
import PasswordStrength from './PasswordStrength';
import Icon from '@/components/ui/icon';

type Step = 'identifier' | 'otp' | 'new-password' | 'done';

interface ResetPasswordFlowProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function ResetPasswordFlow({ onSuccess, onBack }: ResetPasswordFlowProps) {
  const [step, setStep] = useState<Step>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoOtp, setDemoOtp] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !captchaToken) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiSendOtp(identifier.trim(), 'reset_password');
      setDemoOtp(data.otp_demo || '');
      setStep('otp');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка');
      setCaptchaToken('');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpComplete = (code: string) => {
    setOtpCode(code);
    setStep('new-password');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwErr = validatePassword(newPassword);
    if (pwErr || newPassword !== confirmPassword) return;
    setLoading(true);
    setError('');
    try {
      await apiResetPassword({ identifier: identifier.trim(), code: otpCode, new_password: newPassword });
      setStep('done');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка сброса');
    } finally {
      setLoading(false);
    }
  };

  const maskedIdentifier = identifier.includes('@')
    ? identifier.replace(/(.{2}).+(@.+)/, '$1***$2')
    : identifier.replace(/(.{3}).+(.{2})$/, '$1*****$2');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <button onClick={onBack} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <Icon name="ArrowLeft" size={15} style={{ color: 'var(--text-muted)' }} />
        </button>
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Восстановление пароля</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {step === 'identifier' && 'Шаг 1 из 3: Подтвердите личность'}
            {step === 'otp' && 'Шаг 2 из 3: Введите код'}
            {step === 'new-password' && 'Шаг 3 из 3: Новый пароль'}
            {step === 'done' && 'Готово!'}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {['identifier', 'otp', 'new-password'].map((s, i) => (
          <div
            key={s}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: ['identifier', 'otp', 'new-password', 'done'].indexOf(step) > i
                ? 'var(--accent-green)'
                : step === s ? 'var(--accent-green)' : 'hsl(var(--border))'
            }}
          />
        ))}
      </div>

      {/* Step 1: Identifier + Captcha */}
      {step === 'identifier' && (
        <form onSubmit={handleSendOtp} className="space-y-3 animate-fade-in">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Email или номер телефона
            </label>
            <div className="relative">
              <Icon name={identifier.includes('@') ? 'Mail' : 'Smartphone'} size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Укажите email или телефон"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'hsl(var(--secondary))', color: 'var(--text-primary)', border: '1.5px solid hsl(var(--border))' }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent-green)')}
                onBlur={e => (e.target.style.borderColor = 'hsl(var(--border))')}
              />
            </div>
          </div>

          <MathCaptcha onVerify={setCaptchaToken} onReset={() => setCaptchaToken('')} />

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              <Icon name="AlertCircle" size={15} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!identifier.trim() || !captchaToken || loading}
            className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: identifier.trim() && captchaToken ? 'var(--accent-green)' : 'hsl(var(--secondary))',
              color: identifier.trim() && captchaToken ? 'hsl(var(--background))' : 'var(--text-muted)',
              cursor: identifier.trim() && captchaToken ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? <span className="flex items-center justify-center gap-2"><Icon name="Loader2" size={15} className="animate-spin" />Отправляем...</span> : 'Получить код'}
          </button>
        </form>
      )}

      {/* Step 2: OTP */}
      {step === 'otp' && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Код отправлен на <span style={{ color: 'var(--text-secondary)' }}>{maskedIdentifier}</span>
          </p>
          {demoOtp && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs" style={{ background: 'rgba(62,207,142,0.08)', border: '1px solid rgba(62,207,142,0.2)', color: 'var(--accent-green)' }}>
              <Icon name="Info" size={13} /> Демо-режим: ваш код <strong>{demoOtp}</strong>
            </div>
          )}
          <OtpInput onComplete={handleOtpComplete} />
          <div
            className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs"
            style={{ background: 'hsl(var(--secondary))' }}
          >
            <Icon name="Shield" size={13} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '1px' }} />
            <span style={{ color: 'var(--text-muted)' }}>Двойная проверка: сначала капча, теперь код — ваша безопасность гарантирована</span>
          </div>
        </div>
      )}

      {/* Step 3: New password */}
      {step === 'new-password' && (
        <form onSubmit={handleResetPassword} className="space-y-3 animate-fade-in">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Новый пароль</label>
            <div className="relative">
              <Icon name="Lock" size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Придумайте надёжный пароль"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'hsl(var(--secondary))', color: 'var(--text-primary)', border: '1.5px solid hsl(var(--border))' }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent-green)')}
                onBlur={e => (e.target.style.borderColor = 'hsl(var(--border))')}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={15} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
            <PasswordStrength password={newPassword} />
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
                style={{ background: 'hsl(var(--secondary))', color: 'var(--text-primary)', border: `1.5px solid ${confirmPassword && newPassword !== confirmPassword ? '#ef4444' : 'hsl(var(--border))'}` }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent-green)')}
                onBlur={e => (e.target.style.borderColor = confirmPassword && newPassword !== confirmPassword ? '#ef4444' : 'hsl(var(--border))')}
              />
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[11px] mt-1" style={{ color: '#ef4444' }}>Пароли не совпадают</p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              <Icon name="AlertCircle" size={15} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!newPassword || !!validatePassword(newPassword) || newPassword !== confirmPassword || loading}
            className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: newPassword && !validatePassword(newPassword) && newPassword === confirmPassword ? 'var(--accent-green)' : 'hsl(var(--secondary))',
              color: newPassword && !validatePassword(newPassword) && newPassword === confirmPassword ? 'hsl(var(--background))' : 'var(--text-muted)',
            }}
          >
            {loading ? <span className="flex items-center justify-center gap-2"><Icon name="Loader2" size={15} className="animate-spin" />Сохраняем...</span> : 'Установить пароль'}
          </button>
        </form>
      )}

      {/* Done */}
      {step === 'done' && (
        <div className="text-center space-y-4 py-4 animate-scale-in">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'var(--accent-green-dim)', border: '2px solid var(--accent-green)' }}
          >
            <Icon name="CheckCircle" size={32} style={{ color: 'var(--accent-green)' }} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Пароль обновлён!</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Теперь войдите с новым паролем</p>
          </div>
          <button
            onClick={onSuccess}
            className="w-full py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: 'var(--accent-green)', color: 'hsl(var(--background))' }}
          >
            Войти
          </button>
        </div>
      )}
    </div>
  );
}
