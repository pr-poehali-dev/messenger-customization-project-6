const AUTH_URL = 'https://functions.poehali.dev/ea790680-e698-491d-9502-c017eeaec527';

export interface User {
  id: number;
  username: string;
  display_name: string;
  email: string | null;
  phone: string | null;
  avatar_color: string;
  is_verified: boolean;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

const TOKEN_KEY = 'volta_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path: string, method: string, body?: object, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['X-Auth-Token'] = token;

  const res = await fetch(`${AUTH_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
  return data;
}

export async function apiRegister(params: {
  identifier: string;
  password: string;
  display_name: string;
  captcha_token: string;
}) {
  const isEmail = params.identifier.includes('@');
  return request('/register', 'POST', {
    [isEmail ? 'email' : 'phone']: params.identifier,
    password: params.password,
    display_name: params.display_name,
    captcha_token: params.captcha_token,
  });
}

export async function apiVerifyOtp(identifier: string, code: string, purpose: string) {
  return request('/verify-otp', 'POST', { identifier, code, purpose });
}

export async function apiLogin(params: {
  identifier: string;
  password: string;
  captcha_token: string;
}) {
  const isEmail = params.identifier.includes('@');
  return request('/login', 'POST', {
    [isEmail ? 'email' : 'phone']: params.identifier,
    password: params.password,
    captcha_token: params.captcha_token,
  });
}

export async function apiSendOtp(identifier: string, purpose: string) {
  return request('/send-otp', 'POST', { identifier, purpose });
}

export async function apiResetPassword(params: {
  identifier: string;
  code: string;
  new_password: string;
}) {
  return request('/reset-password', 'POST', params);
}

export async function apiGetMe(token: string): Promise<User> {
  return request('/me', 'GET', undefined, token);
}

export async function apiLogout(token: string) {
  return request('/logout', 'POST', {}, token);
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Минимум 8 символов';
  if (!/[A-Z]/.test(password)) return 'Нужна хотя бы одна заглавная буква';
  if (!/[0-9]/.test(password)) return 'Нужна хотя бы одна цифра';
  return null;
}
