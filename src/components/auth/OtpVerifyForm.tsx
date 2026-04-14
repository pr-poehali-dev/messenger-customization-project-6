import React, { useState, useEffect } from 'react';
import { apiVerifyOtp } from '@/lib/auth';
import OtpInput from './OtpInput';
import Icon from '@/components/ui/icon';

interface OtpVerifyFormProps {
  identifier: string;
  purpose: string;
  demoOtp?: string;
  onSuccess: (code?: string) => void;
  onBack: () => void;
}

export default function OtpVerifyForm({ identifier, purpose, demoOtp, onSuccess, onBack }: OtpVerifyFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleComplete = async (code: string) => {
    setLoading(true);
    setError('');
    try {
      await apiVerifyOtp(identifier, code, purpose);
      onSuccess(code);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  const maskedIdentifier = identifier.includes('@')
    ? identifier.replace(/(.{2}).+(@.+)/, '$1***$2')
    : identifier.replace(/(.{3}).+(.{2})$/, '$1*****$2');

  return (
    <div className="space-y-5">
      <div>
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs mb-4 transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
          <Icon name="ArrowLeft" size={13} /> Назад
        </button>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Подтверждение</h2>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Код отправлен на <span style={{ color: 'var(--text-secondary)' }}>{maskedIdentifier}</span>
        </p>
      </div>

      {demoOtp && (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs animate-fade-in"
          style={{ background: 'rgba(62,207,142,0.08)', border: '1px solid rgba(62,207,142,0.2)', color: 'var(--accent-green)' }}
        >
          <Icon name="Info" size={13} />
          <span>Демо-режим: ваш код <strong>{demoOtp}</strong></span>
        </div>
      )}

      <div className="space-y-4">
        <OtpInput onComplete={handleComplete} />

        {loading && (
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <Icon name="Loader2" size={15} className="animate-spin" />
            Проверяем код...
          </div>
        )}

        {error && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm animate-fade-in"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <Icon name="AlertCircle" size={15} /> {error}
          </div>
        )}
      </div>

      <div className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        {seconds > 0 ? (
          <span>Повторный код через <strong style={{ color: 'var(--text-secondary)' }}>{seconds}с</strong></span>
        ) : (
          <button
            onClick={() => { setSeconds(60); setError(''); }}
            style={{ color: 'var(--accent-green)' }}
            className="font-medium hover:opacity-80 transition-opacity"
          >
            Отправить код повторно
          </button>
        )}
      </div>

      <div
        className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs"
        style={{ background: 'hsl(var(--secondary))' }}
      >
        <Icon name="Shield" size={13} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '1px' }} />
        <span style={{ color: 'var(--text-muted)' }}>
          Не передавайте код никому — сотрудники Volta никогда не запрашивают коды подтверждения
        </span>
      </div>
    </div>
  );
}
