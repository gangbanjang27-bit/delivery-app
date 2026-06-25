import React from 'react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function OrdersPage() {
  const session = await getSession();

  if (!session || !session.user || !session.user.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: {
          menu: {
            include: {
              restaurant: true
            }
          }
        }
      }
    }
  });

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <h2 style={{ marginBottom: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '1rem' }}>
        내 주문 내역
      </h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📜</div>
          <h3>아직 주문 내역이 없습니다</h3>
          <p style={{ color: '#666', marginTop: '1rem' }}>맛있는 메뉴를 주문해 보세요!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((order) => {
            const date = new Date(order.createdAt).toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            // Extract restaurant name from the first item (assuming all items in an order are from the same restaurant)
            const restaurantName = order.orderItems.length > 0 
              ? order.orderItems[0].menu.restaurant.name 
              : '알 수 없는 식당';

            return (
              <div key={order.id} style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.5rem',
                backgroundColor: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}>
                {/* Order Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#666', display: 'block', marginBottom: '0.2rem' }}>
                      {date}
                    </span>
                    <strong style={{ fontSize: '1.2rem', color: '#3e2723' }}>
                      {restaurantName}
                    </strong>
                  </div>
                  <div style={{
                    backgroundColor: order.status === 'COMPLETED' ? '#e8f5e9' : '#fff3e0',
                    color: order.status === 'COMPLETED' ? '#2e7d32' : '#e65100',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {order.status === 'COMPLETED' ? '주문 완료' : order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.orderItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {item.menu.imageUrl ? (
                        <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                          <Image src={item.menu.imageUrl} alt={item.menu.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: '#eee', flexShrink: 0 }}></div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#3e2723', marginBottom: '0.2rem' }}>
                          {item.menu.name}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          수량: {item.quantity}개
                        </div>
                      </div>
                      <div style={{ fontWeight: 'bold', color: '#b71c1c' }}>
                        {(item.price * item.quantity).toLocaleString()}원
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div style={{ 
                  marginTop: '1.5rem', 
                  paddingTop: '1rem', 
                  borderTop: '1px dashed #ccc',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#3e2723' }}>총 주문 금액</span>
                  <strong style={{ fontSize: '1.4rem', color: '#d9534f' }}>
                    {order.totalPrice.toLocaleString()}원
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
