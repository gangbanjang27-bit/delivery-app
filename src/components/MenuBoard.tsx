'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import MenuDetailModal from './MenuDetailModal';

export default function MenuBoard({ restaurant }: { restaurant: any }) {
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  return (
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
        {restaurant.menus.map((menu: any) => (
          <div key={menu.id} 
               onClick={() => setSelectedMenu(menu)}
               style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(139, 90, 43, 0.2)',
            paddingBottom: '1.5rem',
            gap: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            padding: '1rem',
            borderRadius: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
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
            </div>
          </div>
        ))}
      </div>

      {selectedMenu && (
        <MenuDetailModal 
          menu={selectedMenu} 
          restaurantId={restaurant.id} 
          restaurantName={restaurant.name} 
          onClose={() => setSelectedMenu(null)} 
        />
      )}
    </div>
  );
}
