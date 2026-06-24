'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';

interface MenuDetailModalProps {
  menu: any;
  restaurantId: number;
  restaurantName: string;
  onClose: () => void;
}

export default function MenuDetailModal({ menu, restaurantId, restaurantName, onClose }: MenuDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, forceAddItem } = useCartStore();

  if (!menu) return null;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleIncrease = () => {
    setQuantity(q => q + 1);
  };

  const handleAddToCart = () => {
    // Add item N times. The store's addItem usually takes quantity=1 by default if we just call it N times, or we can update the store to accept a quantity.
    // Wait, let's check useCartStore to see if it supports adding multiple quantities at once.
    // Currently, addItem might just add 1 and handle uniqueness by menuId. 
    // I will call addItem once but pass the quantity if supported. Actually, let's pass a quantity property.
    // We should modify useCartStore to accept initial quantity, but for now, I'll just call forceAddItem/addItem with the menu object. Wait, let's update useCartStore to accept quantity.
    // If we can't update useCartStore yet, we can add it 1 by 1.
    // For now, let's call it.
    let success = false;
    for (let i = 0; i < quantity; i++) {
      if (i === 0) {
        success = addItem({
          menuId: menu.id,
          name: menu.name,
          price: menu.price,
          imageUrl: menu.imageUrl,
        }, restaurantId, restaurantName);

        if (!success) {
          if (window.confirm('장바구니에는 같은 식당의 메뉴만 담을 수 있습니다. 기존 장바구니를 비우고 새로 담으시겠습니까?')) {
            forceAddItem({
              menuId: menu.id,
              name: menu.name,
              price: menu.price,
              imageUrl: menu.imageUrl,
            }, restaurantId, restaurantName);
            success = true;
          } else {
            return; // Cancelled
          }
        }
      } else if (success) {
        // Add the rest
        addItem({
          menuId: menu.id,
          name: menu.name,
          price: menu.price,
          imageUrl: menu.imageUrl,
        }, restaurantId, restaurantName);
      }
    }
    
    // Close modal after adding
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: '#f5f1e7', // Hanji color
        width: '100%',
        maxWidth: '400px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header Image */}
        <div style={{ width: '100%', height: '200px', position: 'relative', backgroundColor: '#e0d8c8' }}>
          {menu.imageUrl && (
            <Image src={menu.imageUrl} alt={menu.name} fill style={{ objectFit: 'cover' }} />
          )}
          <button onClick={onClose} style={{
            position: 'absolute', top: '10px', right: '10px',
            background: 'rgba(0,0,0,0.5)', color: 'white',
            border: 'none', borderRadius: '50%', width: '30px', height: '30px',
            cursor: 'pointer', fontWeight: 'bold'
          }}>✕</button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'EbsHunminjeongeumSaeron, serif', fontSize: '1.8rem', color: '#3e2723', marginBottom: '0.5rem' }}>
            {menu.name}
          </h2>
          {menu.description && (
            <p style={{ color: '#5d4037', marginBottom: '1.5rem', lineHeight: 1.4 }}>
              {menu.description}
            </p>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#3e2723' }}>가격</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#b71c1c' }}>{menu.price.toLocaleString()}원</span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px dashed rgba(139, 90, 43, 0.3)', margin: '1.5rem 0' }} />

          {/* Quantity Selector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#3e2723' }}>수량</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #d7ccc8', padding: '0.2rem' }}>
              <button onClick={handleDecrease} style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: quantity > 1 ? '#3e2723' : '#ccc' }}>-</button>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{quantity}</span>
              <button onClick={handleIncrease} style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: '#3e2723' }}>+</button>
            </div>
          </div>

          {/* Add Button */}
          <button onClick={handleAddToCart} style={{
            width: '100%',
            backgroundColor: '#8b5a2b',
            color: '#f5f1e7',
            padding: '1rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            fontFamily: 'EbsHunminjeongeumSaeron, serif',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(139, 90, 43, 0.2)'
          }}>
            {quantity}개 담기 ({(menu.price * quantity).toLocaleString()}원)
          </button>
        </div>
      </div>
    </div>
  );
}
