'use client';

import { login } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', paddingTop: '10vh' }}>
      <div className="scroll-container">
        <div className="scroll-roller scroll-top-roller"></div>
        <div className="scroll-paper-wrapper">
          <div className="scroll-paper">
            <div className="scroll-paper-inner">
              <h1 style={{ marginBottom: '2rem', textAlign: 'center', fontFamily: 'EbsHunminjeongeumSaeron, serif', fontSize: '2.5rem' }}>로그인</h1>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="email">이메일</label>
                  <input type="email" id="email" name="email" required placeholder="example@email.com" />
                </div>
                <div className="input-group">
                  <label htmlFor="password">비밀번호</label>
                  <input type="password" id="password" name="password" required placeholder="비밀번호를 입력하세요" />
                </div>
                {error && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}
                <button type="submit" className="btn" style={{ width: '100%', fontFamily: 'EbsHunminjeongeumSaeron, serif', fontSize: '1.3rem' }} disabled={loading}>
                  {loading ? '로그인 중...' : '로그인'}
                </button>
              </form>
              <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                계정이 없으신가요? <Link href="/signup" style={{ color: 'var(--error)', fontWeight: 600 }}>회원가입</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="scroll-roller scroll-bottom-roller"></div>
      </div>
    </div>
  );
}
