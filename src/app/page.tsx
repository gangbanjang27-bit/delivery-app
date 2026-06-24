import Link from 'next/link';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const CATEGORIES = [
  { id: '한식', icon: '🍚' },
  { id: '돈까스/회', icon: '🍣' },
  { id: '카페/디저트', icon: '☕' },
  { id: '찜/탕', icon: '🍲' },
  { id: '패스트푸드', icon: '🍔' },
  { id: '치킨', icon: '🍗' },
  { id: '고기', icon: '🥩' },
  { id: '분식', icon: '🍢' },
  { id: '양식', icon: '🍝' },
  { id: '아시안', icon: '🍜' },
  { id: '중식', icon: '🥟' },
  { id: '족발/보쌈', icon: '🍖' },
  { id: '피자', icon: '🍕' },
  { id: '야식', icon: '🌙' },
  { id: '도시락', icon: '🍱' }
];

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> | { category?: string } }) {
  const session = await getSession();
  if (!session || !session.user) {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || '전체';

  let where = {};
  if (currentCategory !== '전체') {
    where = { category: currentCategory };
  }

  const restaurants = await prisma.restaurant.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { menus: true }
  });

  return (
    <div className="container">
      {/* Categories */}
      <div style={{
        display: 'flex',
        gap: '0.8rem',
        overflowX: 'auto',
        paddingBottom: '1rem',
        marginBottom: '2rem',
      }} className="category-scroll">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            backgroundColor: currentCategory === '전체' ? 'var(--primary)' : 'var(--background)',
            color: currentCategory === '전체' ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border)',
            whiteSpace: 'nowrap',
            fontWeight: currentCategory === '전체' ? 'bold' : 'normal',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>전체</span>
          </div>
        </Link>
        {CATEGORIES.map(cat => (
          <Link href={`/?category=${encodeURIComponent(cat.id)}`} key={cat.id} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              backgroundColor: currentCategory === cat.id ? 'var(--primary)' : 'var(--background)',
              color: currentCategory === cat.id ? 'white' : 'var(--text-primary)',
              border: '1px solid var(--border)',
              whiteSpace: 'nowrap',
              fontWeight: currentCategory === cat.id ? 'bold' : 'normal',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>{cat.icon}</span>
              <span>{cat.id}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Restaurant List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {restaurants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
            <h3 style={{ fontFamily: 'EbsHunminjeongeumSaeron, serif', fontSize: '2rem', marginBottom: '1rem' }}>
              아직 이 골목에는 장이 서지 않았소.
            </h3>
            <p>다른 골목(카테고리)을 둘러보시구려.</p>
          </div>
        ) : (
          restaurants.map((restaurant) => (
            <div key={restaurant.id} style={{ 
              position: 'relative',
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              backgroundColor: '#f5f1e7', // Hanji color
              border: '4px solid #8b5a2b', // Wooden border
              borderRadius: '8px',
              padding: '2.5rem 1rem 1rem 1rem', // Top padding for nameplate
              marginTop: '1.5rem', // Margin for nameplate overlap
              boxShadow: '0 4px 8px rgba(139, 90, 43, 0.2)'
            }}>
              <Link href={`/restaurants/${restaurant.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                
                {/* Nameplate */}
                <div style={{
                  position: 'absolute',
                  top: '-1.2rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#3e2723', // Dark wood
                  color: '#f5f1e7',
                  border: '2px solid #8b5a2b',
                  padding: '0.4rem 1.5rem',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  whiteSpace: 'nowrap'
                }}>
                  <h3 style={{ fontFamily: 'EbsHunminjeongeumSaeron, serif', fontSize: '1.4rem', margin: 0, letterSpacing: '2px' }}>
                    {restaurant.name}
                  </h3>
                </div>

                {/* Menu List within the card (Horizontal Scroll) */}
                <div style={{ marginTop: 'auto' }}>
                  <h4 style={{ fontFamily: 'EbsHunminjeongeumSaeron, serif', fontSize: '1.1rem', marginBottom: '0.8rem', color: '#3e2723', textAlign: 'center' }}>📜 차림표</h4>
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    overflowX: 'auto', 
                    paddingBottom: '0.5rem',
                  }} className="category-scroll">
                    {restaurant.menus.map((menu: any) => (
                      <div key={menu.id} style={{ 
                        minWidth: '140px',
                        width: '140px',
                        background: 'white', 
                        borderRadius: '8px', 
                        overflow: 'hidden',
                        border: '1px solid #d7ccc8',
                        flexShrink: 0,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}>
                        <div style={{ width: '100%', height: '120px', position: 'relative', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                          <Image 
                            src={menu.imageUrl || `https://via.placeholder.com/150?text=${encodeURIComponent(menu.name)}`} 
                            alt={menu.name} 
                            width={140}
                            height={120}
                            style={{ objectFit: 'cover' }} 
                          />
                        </div>
                        <div style={{ padding: '0.6rem' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#3e2723', marginBottom: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{menu.name}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#8b5a2b', marginBottom: '0.2rem' }}>{menu.price.toLocaleString()}냥</div>
                          <div style={{ fontSize: '0.75rem', color: '#8d6e63', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{menu.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
