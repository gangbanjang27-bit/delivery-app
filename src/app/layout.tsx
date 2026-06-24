import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { logout } from '@/actions/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '홍길동배달',
  description: '동에 번쩍 서에 번쩍, 어디든 가는 홍길동배달',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="ko">
      <body>
        <nav className="navbar" style={{ background: 'var(--surface-light)' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
            <Link href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/logo.png" alt="홍길동 로고" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
              <span style={{ fontFamily: 'EbsHunminjeongeumSaeron, serif', fontSize: '1.4rem', color: 'var(--text-primary)' }}>홍길동배달</span>
            </Link>
            <div className="nav-links">
              {session ? (
                <>
                  <Link href="/orders">내 주문내역</Link>
                  <form action={async () => {
                    'use server';
                    await logout();
                    redirect('/login');
                  }}>
                    <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500, fontSize: '1rem' }}>로그아웃</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login">로그인</Link>
                  <Link href="/signup" className="btn" style={{ padding: '0.5rem 1rem' }}>회원가입</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="container" style={{ flex: 1 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
