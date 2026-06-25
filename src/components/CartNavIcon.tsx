'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export default function CartNavIcon() {
  const { getTotalQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const quantity = getTotalQuantity();

  if (!mounted) {
    return (
      <Link href="/cart" style={{ textDecoration: 'none', color: 'inherit', position: 'relative', display: 'inline-flex', alignItems: 'baseline', gap: '1px' }}>
        <span>🛒</span><span>장바구니</span>
      </Link>
    );
  }

  return (
    <Link href="/cart" style={{ textDecoration: 'none', color: 'inherit', position: 'relative', display: 'inline-flex', alignItems: 'baseline', gap: '1px' }}>
      <span>🛒</span><span>장바구니</span>
      {quantity > 0 && (
        <span style={{
          position: 'absolute',
          top: '0',
          right: '0',
          backgroundColor: '#d9534f',
          color: 'white',
          borderRadius: '10px',
          padding: '0.1rem 0.4rem',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          transform: 'translate(25%, -25%)'
        }}>
          {quantity}
        </span>
      )}
    </Link>
  );
}
