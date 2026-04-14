import React, { useRef, useState } from 'react';

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

export default function OtpInput({ length = 6, onComplete }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    const digit = val.replace(/\D/, '').slice(-1);
    const next = [...values];
    next[i] = digit;
    setValues(next);
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
    if (next.every(v => v)) onComplete(next.join(''));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const next = Array(length).fill('');
    pasted.split('').forEach((d, idx) => { next[idx] = d; });
    setValues(next);
    const lastIdx = Math.min(pasted.length, length - 1);
    refs.current[lastIdx]?.focus();
    if (pasted.length === length) onComplete(next.join(''));
  };

  return (
    <div className="flex gap-2 justify-center">
      {values.map((v, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-13 text-center text-lg font-bold rounded-xl border-2 outline-none transition-all"
          style={{
            background: 'hsl(var(--secondary))',
            color: 'var(--text-primary)',
            borderColor: v ? 'var(--accent-green)' : 'hsl(var(--border))',
            height: '52px',
          }}
        />
      ))}
    </div>
  );
}
