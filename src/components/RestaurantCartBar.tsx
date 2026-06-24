'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';

export default function RestaurantCartBar({ currentRestaurantId }: { currentRestaurantId: number }) {
  const { items, restaurantId, getTotalQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Only show if there are items AND the items belong to the current restaurant
  // Actually, standard delivery apps show the bar even if it belongs to another restaurant?
  // No, usually they just show it if there's anything in the cart, but let's show it if there are items.
  // Wait, if it belongs to another restaurant, we might still want to show the cart?
  // Let's show it globally, or just if there are items in the cart at all.
  if (items.length === 0) return null;

  const totalQuantity = getTotalQuantity();
  const totalPrice = getTotalPrice();

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 40px)',
      maxWidth: '600px',
      backgroundColor: '#8b5a2b',
      color: '#f5f1e7',
      borderRadius: '12px',
      padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 8px 20px rgba(139, 90, 43, 0.4)',
      cursor: 'pointer',
      zIndex: 1000,
    }} onClick={() => router.push('/cart')}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div style={{ 
          backgroundColor: '#f5f1e7', 
          color: '#8b5a2b', 
          width: '28px', 
          height: '28px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          {totalQuantity}
        </div>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>장바구니 보기</span>
      </div>

      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
        {totalPrice.toLocaleString()}원
      </div>

    </div>
  );
}
