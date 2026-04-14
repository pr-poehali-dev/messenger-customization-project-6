import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';

interface MathCaptchaProps {
  onVerify: (token: string) => void;
  onReset?: () => void;
}

function generateQuestion() {
  const ops = ['+', '-', '*'] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  if (op === '+') { a = Math.floor(Math.random() * 20) + 1; b = Math.floor(Math.random() * 20) + 1; answer = a + b; }
  else if (op === '-') { a = Math.floor(Math.random() * 20) + 10; b = Math.floor(Math.random() * 10) + 1; answer = a - b; }
  else { a = Math.floor(Math.random() * 9) + 2; b = Math.floor(Math.random() * 9) + 2; answer = a * b; }
  return { question: `${a} ${op === '*' ? '×' : op} ${b}`, answer };
}

export default function MathCaptcha({ onVerify, onReset }: MathCaptchaProps) {
  const [q, setQ] = useState(() => generateQuestion());
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [shaking, setShaking] = useState(false);

  const refresh = useCallback(() => {
    setQ(generateQuestion());
    setInput('');
    setStatus('idle');
    onReset?.();
  }, [onReset]);

  const check = () => {
    if (parseInt(input) === q.answer) {
      setStatus('success');
      onVerify(`math_captcha_${Date.now()}_${q.answer}`);
    } else {
      setStatus('error');
      setShaking(true);
      setTimeout(() => { setShaking(false); refresh(); }, 800);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input) check();
  };

  return (
    <div
      className="rounded-xl p-3 border transition-all"
      style={{
        background: 'hsl(var(--secondary))',
        borderColor: status === 'success' ? 'var(--accent-green)' : status === 'error' ? '#ef4444' : 'hsl(var(--border))',
        animation: shaking ? 'shake 0.4s ease' : 'none',
      }}
    >
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }`}</style>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div
            className="px-3 py-1.5 rounded-lg font-bold text-sm font-mono select-none"
            style={{ background: 'hsl(var(--background))', color: 'var(--text-primary)', minWidth: '80px', textAlign: 'center' }}
          >
            {q.question} = ?
          </div>
          {status !== 'success' ? (
            <input
              type="number"
              value={input}
              onChange={e => { setInput(e.target.value); setStatus('idle'); }}
              onKeyDown={handleKey}
              placeholder="Ответ"
              disabled={status === 'success'}
              className="flex-1 bg-transparent outline-none text-sm text-center font-mono py-1.5 rounded-lg border"
              style={{
                color: 'var(--text-primary)',
                borderColor: 'hsl(var(--border))',
                background: 'hsl(var(--background))',
                maxWidth: '70px',
              }}
            />
          ) : (
            <div className="flex-1 flex items-center gap-1.5">
              <Icon name="CheckCircle" size={16} style={{ color: 'var(--accent-green)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--accent-green)' }}>Проверено</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {status !== 'success' && input && (
            <button
              onClick={check}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: 'var(--accent-green)', color: 'hsl(var(--background))' }}
            >
              ОК
            </button>
          )}
          <button
            onClick={refresh}
            title="Обновить задачу"
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
          >
            <Icon name="RefreshCw" size={13} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
      </div>
      <div className="mt-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
        🔒 Защита от ботов — решите простую задачу
      </div>
    </div>
  );
}
