import Image from 'next/image';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import MenuBoard from '@/components/MenuBoard';
import RestaurantCartBar from '@/components/RestaurantCartBar';

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
      <MenuBoard restaurant={restaurant} />

      {/* Cart Floating Bar */}
      <RestaurantCartBar currentRestaurantId={restaurant.id} />
    </div>
  );
}
