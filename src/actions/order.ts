'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function createOrder(items: any[], totalPrice: number) {
  try {
    const session = await getSession();
    
    if (!session || !session.user || !session.user.id) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    if (!items || items.length === 0) {
      return { success: false, error: '장바구니가 비어 있습니다.' };
    }

    const userId = session.user.id;

    // Execute within a transaction to ensure both Order and OrderItems are created atomically
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: 'COMPLETED', // Normally PENDING, but for mock delivery app, let's just complete it
          orderItems: {
            create: items.map(item => ({
              menuId: item.menuId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });
      return newOrder;
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, error: '주문 처리 중 오류가 발생했습니다.' };
  }
}
