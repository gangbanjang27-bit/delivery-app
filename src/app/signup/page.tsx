'use client';

import { signup } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

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
              <h1 style={{ marginBottom: '2rem', textAlign: 'center', fontFamily: 'EbsHunminjeongeumSaeron, serif', fontSize: '2.5rem' }}>회원가입</h1>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="name">이름</label>
                  <input type="text" id="name" name="name" required placeholder="홍길동" />
                </div>
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
                  {loading ? '가입 중...' : '회원가입'}
                </button>
              </form>
              <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                이미 계정이 있으신가요? <Link href="/login" style={{ color: 'var(--error)', fontWeight: 600 }}>로그인</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="scroll-roller scroll-bottom-roller"></div>
      </div>
    </div>
  );
}
