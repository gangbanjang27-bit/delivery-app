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

    // 최소 2.5초 동안 애니메이션을 강제로 보여줍니다.
    await new Promise(resolve => setTimeout(resolve, 2500));

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  }

  // 로딩 중일 때는 폼을 숨기고 홍길동 애니메이션 전체 화면을 보여줍니다.
  if (loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
        height: '100vh', width: '100vw', backgroundColor: '#fdfdfd'
      }}>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes runAround {
            0% { transform: translateX(-150px) translateY(0px) rotate(-10deg); }
            25% { transform: translateX(-75px) translateY(-50px) rotate(10deg); }
            50% { transform: translateX(0px) translateY(0px) rotate(-10deg); }
            75% { transform: translateX(75px) translateY(-50px) rotate(10deg); }
            100% { transform: translateX(150px) translateY(0px) rotate(-10deg); }
          }
        `}} />
        <img 
          src="/logo.png" 
          alt="홍길동 달리는 중" 
          style={{ 
            width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--primary)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            animation: 'runAround 1s linear infinite'
          }} 
        />
        <h2 style={{
          fontFamily: 'EbsHunminjeongeumSaeron, serif', fontSize: '2rem', marginTop: '2rem', color: 'var(--text)',
          animation: 'pulseText 1s infinite alternate'
        }}>
          홍길동이 달려가는 중...
        </h2>
      </div>
    );
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
