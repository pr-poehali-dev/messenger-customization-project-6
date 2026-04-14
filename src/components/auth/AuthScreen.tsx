import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ResetPasswordFlow from './ResetPasswordFlow';
import OtpVerifyForm from './OtpVerifyForm';
import { User } from '@/lib/auth';

type AuthFlow = 'login' | 'register' | 'otp-verify' | 'reset-password';

interface AuthScreenProps {
  onAuth: (user: User, token: string) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [flow, setFlow] = useState<AuthFlow>('login');
  const [pendingIdentifier, setPendingIdentifier] = useState('');
  const [pendingOtp, setPendingOtp] = useState('');

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'hsl(var(--background))' }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(62,207,142,0.08) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 30% 120%, rgba(99,102,241,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-2xl"
            style={{ background: 'var(--accent-green)', color: 'hsl(var(--background))' }}
          >
            V
          </div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Volta</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Мессенджер нового поколения</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 animate-scale-in"
          style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
        >
          {flow === 'login' && (
            <LoginForm
              onSuccess={(user, token) => onAuth(user, token)}
              onRegister={() => setFlow('register')}
              onForgot={() => setFlow('reset-password')}
            />
          )}
          {flow === 'register' && (
            <RegisterForm
              onSuccess={(identifier, otpDemo) => {
                setPendingIdentifier(identifier);
                setPendingOtp(otpDemo || '');
                setFlow('otp-verify');
              }}
              onLogin={() => setFlow('login')}
            />
          )}
          {flow === 'otp-verify' && (
            <OtpVerifyForm
              identifier={pendingIdentifier}
              purpose="register"
              demoOtp={pendingOtp}
              onSuccess={() => setFlow('login')}
              onBack={() => setFlow('register')}
            />
          )}
          {flow === 'reset-password' && (
            <ResetPasswordFlow
              onSuccess={() => setFlow('login')}
              onBack={() => setFlow('login')}
            />
          )}
        </div>

        <p className="text-center text-[11px] mt-4" style={{ color: 'var(--text-muted)' }}>
          Volta v1.0 · Сквозное шифрование · Конфиденциальность защищена
        </p>
      </div>
    </div>
  );
}
