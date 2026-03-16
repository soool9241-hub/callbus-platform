'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import {
  Phone,
  Lock,
  User,
  Mail,
  Eye,
  EyeOff,
} from 'lucide-react';

type Tab = 'login' | 'register';

function translateAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.';
  }
  if (message.includes('Email not confirmed')) {
    return '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.';
  }
  if (message.includes('User already registered') || message.includes('already been registered')) {
    return '이미 가입된 이메일입니다.';
  }
  if (message.includes('Password should be at least')) {
    return '비밀번호는 최소 6자 이상이어야 합니다.';
  }
  if (message.includes('Unable to validate email address')) {
    return '올바른 이메일 주소를 입력해주세요.';
  }
  if (message.includes('Signup requires a valid password')) {
    return '유효한 비밀번호를 입력해주세요.';
  }
  if (message.includes('Email rate limit exceeded') || message.includes('rate limit')) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
  }
  if (message.includes('Network') || message.includes('fetch')) {
    return '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
  }
  return message;
}

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<'customer' | 'driver'>('customer');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Social login loading
  const [socialLoading, setSocialLoading] = useState(false);

  const handleLogin = async () => {
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('이메일을 입력해주세요.');
      return;
    }
    if (!loginPassword) {
      setLoginError('비밀번호를 입력해주세요.');
      return;
    }

    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error) {
        setLoginError(translateAuthError(error.message));
        return;
      }

      router.push('/');
    } catch {
      setLoginError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegisterError('');
    setRegisterSuccess(false);

    if (!regName.trim()) {
      setRegisterError('이름을 입력해주세요.');
      return;
    }
    if (!regEmail.trim()) {
      setRegisterError('이메일을 입력해주세요.');
      return;
    }
    if (!regPhone.trim()) {
      setRegisterError('전화번호를 입력해주세요.');
      return;
    }
    if (!regPassword) {
      setRegisterError('비밀번호를 입력해주세요.');
      return;
    }
    if (regPassword.length < 6) {
      setRegisterError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegisterError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setRegisterLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: regEmail.trim(),
        password: regPassword,
        options: {
          data: {
            name: regName.trim(),
            role: regRole,
            phone: regPhone.trim(),
          },
        },
      });

      if (error) {
        setRegisterError(translateAuthError(error.message));
        return;
      }

      // If email confirmation is disabled, the user is auto-confirmed and session exists
      if (data.session) {
        router.push('/');
      } else {
        // Email confirmation is enabled - show success message
        setRegisterSuccess(true);
      }
    } catch {
      setRegisterError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setLoginError(translateAuthError(error.message));
        setSocialLoading(false);
      }
      // If no error, the browser will redirect to Google OAuth page
    } catch {
      setLoginError('소셜 로그인 중 오류가 발생했습니다.');
      setSocialLoading(false);
    }
  };

  const handleLoginKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loginLoading) {
      handleLogin();
    }
  };

  const handleRegisterKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !registerLoading) {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-1">🚌 콜버스</h1>
        <p className="text-gray-500 text-sm">전세버스 비교 플랫폼</p>
      </div>

      <Card padding="none" className="w-full max-w-md">
        {/* Tab */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setTab('login');
              setLoginError('');
              setRegisterError('');
              setRegisterSuccess(false);
            }}
            className={`flex-1 py-4 text-sm font-semibold text-center transition-colors ${
              tab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => {
              setTab('register');
              setLoginError('');
              setRegisterError('');
              setRegisterSuccess(false);
            }}
            className={`flex-1 py-4 text-sm font-semibold text-center transition-colors ${
              tab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            회원가입
          </button>
        </div>

        <div className="p-6">
          {tab === 'login' ? (
            <div className="space-y-4" onKeyDown={handleLoginKeyDown}>
              <Input
                label="이메일"
                type="email"
                placeholder="email@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                prefixIcon={<Mail className="w-4 h-4" />}
              />
              <div className="relative">
                <Input
                  label="비밀번호"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  prefixIcon={<Lock className="w-4 h-4" />}
                  suffixIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="pointer-events-auto"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}

              <Button
                fullWidth
                size="lg"
                onClick={handleLogin}
                loading={loginLoading}
                disabled={loginLoading}
              >
                로그인
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-sm text-gray-400">간편 로그인</span>
                </div>
              </div>

              {/* Social Logins */}
              <div className="space-y-3">
                <button
                  onClick={() => {}}
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#FEE500] text-[#3C1E1E] font-medium rounded-lg opacity-50 cursor-not-allowed text-sm"
                  title="카카오 로그인은 준비 중입니다"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.636 1.737 4.96 4.35 6.32-.14.533-.904 3.42-.935 3.636 0 0-.02.168.09.233.108.065.235.014.235.014.31-.044 3.594-2.363 4.16-2.774.354.052.717.08 1.1.08 5.523 0 10-3.463 10-7.691S17.523 3 12 3z" />
                  </svg>
                  카카오로 시작하기 (준비중)
                </button>
                <button
                  onClick={() => {}}
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#03C75A] text-white font-medium rounded-lg opacity-50 cursor-not-allowed text-sm"
                  title="네이버 로그인은 준비 중입니다"
                >
                  <span className="font-bold text-lg">N</span>
                  네이버로 시작하기 (준비중)
                </button>
                <button
                  onClick={handleGoogleLogin}
                  disabled={socialLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {socialLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  Google로 시작하기
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4" onKeyDown={handleRegisterKeyDown}>
              {registerSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">회원가입 완료</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    회원가입이 완료되었습니다! 이메일을 확인해주세요.
                  </p>
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => {
                      setTab('login');
                      setRegisterSuccess(false);
                    }}
                  >
                    로그인으로 이동
                  </Button>
                </div>
              ) : (
                <>
                  <Input
                    label="이름"
                    placeholder="이름을 입력하세요"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    prefixIcon={<User className="w-4 h-4" />}
                  />
                  <Input
                    label="이메일"
                    type="email"
                    placeholder="email@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    prefixIcon={<Mail className="w-4 h-4" />}
                  />
                  <Input
                    label="전화번호"
                    placeholder="010-0000-0000"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    prefixIcon={<Phone className="w-4 h-4" />}
                  />
                  <div className="relative">
                    <Input
                      label="비밀번호"
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 입력하세요 (6자 이상)"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      prefixIcon={<Lock className="w-4 h-4" />}
                      suffixIcon={
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="pointer-events-auto"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                  </div>
                  <div className="relative">
                    <Input
                      label="비밀번호 확인"
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      prefixIcon={<Lock className="w-4 h-4" />}
                      suffixIcon={
                        <button
                          type="button"
                          onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                          className="pointer-events-auto"
                        >
                          {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      가입 유형
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setRegRole('customer')}
                        className={`p-4 rounded-lg border-2 text-center transition-colors ${
                          regRole === 'customer'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <User className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-sm font-medium">고객</span>
                        <p className="text-xs text-gray-400 mt-0.5">버스 이용</p>
                      </button>
                      <button
                        onClick={() => setRegRole('driver')}
                        className={`p-4 rounded-lg border-2 text-center transition-colors ${
                          regRole === 'driver'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <svg className="w-6 h-6 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 6v6" /><path d="M15 6v6" /><path d="M2 12h19.6" /><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" /><circle cx="7" cy="18" r="2" /><path d="M9 18h5" /><circle cx="16" cy="18" r="2" />
                        </svg>
                        <span className="text-sm font-medium">기사</span>
                        <p className="text-xs text-gray-400 mt-0.5">버스 운행</p>
                      </button>
                    </div>
                  </div>

                  {registerError && (
                    <p className="text-sm text-red-600">{registerError}</p>
                  )}

                  <Button
                    fullWidth
                    size="lg"
                    onClick={handleRegister}
                    loading={registerLoading}
                    disabled={registerLoading}
                  >
                    회원가입
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    가입 시 <span className="underline cursor-pointer">이용약관</span> 및{' '}
                    <span className="underline cursor-pointer">개인정보처리방침</span>에 동의하게 됩니다.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
