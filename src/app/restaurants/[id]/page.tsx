import Image from 'next/image';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const restaurantId = parseInt(resolvedParams.id);

  if (isNaN(restaurantId)) {
    notFound();
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: { menus: true }
  });

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      
      {/* Restaurant Header */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '2rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        {restaurant.imageUrl ? (
          <Image 
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#8b5a2b' }}></div>
        )}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          padding: '2rem',
          color: 'white'
        }}>
          <h1 style={{ fontFamily: 'EbsHunminjeongeumSaeron, serif', fontSize: '3rem', marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {restaurant.name}
          </h1>
          <p style={{ fontSize: '1.2rem', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{restaurant.description}</p>
        </div>
      </div>

      {/* Menu Board (Traditional Style) */}
      <div style={{
        backgroundColor: '#e6d5b8', // Hanji paper color
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
        padding: '3rem',
        borderRadius: '8px',
        border: '3px solid #8b5a2b',
        boxShadow: 'inset 0 0 20px rgba(139, 90, 43, 0.3), 0 5px 15px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        <h2 style={{ 
          fontFamily: 'EbsHunminjeongeumSaeron, serif', 
          fontSize: '2.5rem', 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: '#3e2723',
          borderBottom: '2px dashed #8b5a2b',
          paddingBottom: '1rem'
        }}>차 림 표</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {restaurant.menus.map((menu) => (
            <div key={menu.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(139, 90, 43, 0.2)',
              paddingBottom: '1.5rem',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', flex: 1, gap: '1rem', alignItems: 'center' }}>
                {menu.imageUrl ? (
                  <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                    <Image src={menu.imageUrl} alt={menu.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '80px', height: '80px', borderRadius: '8px', backgroundColor: '#eee', flexShrink: 0 }}></div>
                )}
                <div>
                  <h3 style={{ fontFamily: 'EbsHunminjeongeumSaeron, serif', fontSize: '1.5rem', color: '#3e2723', marginBottom: '0.5rem' }}>
                    {menu.name}
                  </h3>
                  {menu.description && (
                    <p style={{ color: '#5d4037', fontSize: '1rem' }}>{menu.description}</p>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ 
                  fontFamily: 'EbsHunminjeongeumSaeron, serif', 
                  fontSize: '1.4rem', 
                  color: '#b71c1c', // Dark red for price
                  fontWeight: 'bold'
                }}>
                  {menu.price.toLocaleString()}원
                </span>
                <button className="btn" style={{ 
                  padding: '0.6rem 1.2rem', 
                  fontSize: '1rem', 
                  fontFamily: 'EbsHunminjeongeumSaeron, serif' 
                }}>
                  장바구니 담기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
