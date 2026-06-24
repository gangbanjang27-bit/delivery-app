'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/actions/order';
import { useState } from 'react';

export default function CartPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, restaurantName, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2>장바구니가 텅 비었습니다</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>맛있는 메뉴를 골라 담아보세요!</p>
        <Link href="/" className="btn" style={{ textDecoration: 'none' }}>
          메뉴 보러 가기
        </Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const response = await createOrder(items, getTotalPrice());
      if (response.success) {
        alert('주문이 성공적으로 접수되었습니다!');
        clearCart();
        router.push('/orders');
      } else {
        alert(response.error);
        if (response.error === '로그인이 필요합니다.') {
          router.push('/login');
        }
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '2px solid var(--border)',
        paddingBottom: '1rem',
        marginBottom: '2rem'
      }}>
        <h2>장바구니</h2>
        <button 
          onClick={clearCart}
          style={{ background: 'none', border: 'none', color: '#d9534f', cursor: 'pointer', fontWeight: 'bold' }}
        >
          전체 삭제
        </button>
      </div>

      <div style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
        {restaurantName}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {items.map((item) => (
          <div key={item.menuId} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'var(--surface-light)',
            padding: '1rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {item.imageUrl && (
                <Image 
                  src={item.imageUrl} 
                  alt={item.name} 
                  width={60} 
                  height={60} 
                  style={{ borderRadius: '8px', objectFit: 'cover' }} 
                />
              )}
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ color: '#666' }}>{item.price.toLocaleString()}원</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                style={{ width: '30px', height: '30px', borderRadius: '15px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ width: '20px', textAlign: 'center' }}>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                style={{ width: '30px', height: '30px', borderRadius: '15px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#e6d5c1',
        padding: '1.5rem',
        boxShadow: '0 -5px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '1rem',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#3e2723'
        }}>
          <span>총 결제 금액</span>
          <span>{getTotalPrice().toLocaleString()}원</span>
        </div>
        <button 
          onClick={handleCheckout}
          disabled={isSubmitting}
          style={{
            width: '100%',
            backgroundColor: isSubmitting ? '#a1887f' : '#d9534f',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? '주문 처리 중...' : `${getTotalPrice().toLocaleString()}원 배달 주문하기`}
        </button>
      </div>
    </div>
  );
}
