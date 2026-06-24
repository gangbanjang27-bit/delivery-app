'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function createOrder(restaurantId: number, cartItems: { menuId: number; quantity: number }[]) {
  const session = await getSession();
  if (!session || !session.user) {
    return { error: '로그인이 필요합니다.' };
  }

  try {
    // Fetch menu prices
    const menuIds = cartItems.map((item) => item.menuId);
    const menus = await prisma.menu.findMany({
      where: { id: { in: menuIds } },
    });

    let totalPrice = 0;
    const orderItemsData = cartItems.map((item) => {
      const menu = menus.find((m) => m.id === item.menuId);
      if (!menu) throw new Error(`Menu not found: ${item.menuId}`);
      totalPrice += menu.price * item.quantity;
      return {
        menuId: item.menuId,
        quantity: item.quantity,
        price: menu.price,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalPrice,
        status: 'COMPLETED', // simple flow
        orderItems: {
          create: orderItemsData,
        },
      },
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Order creation error:', error);
    return { error: '주문 처리 중 오류가 발생했습니다.' };
  }
}

export async function getMyOrders() {
  const session = await getSession();
  if (!session || !session.user) {
    return { error: '로그인이 필요합니다.' };
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        orderItems: {
          include: {
            menu: {
              include: {
                restaurant: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, orders };
  } catch (error) {
    console.error('Fetch orders error:', error);
    return { error: '주문 내역을 불러오는 중 오류가 발생했습니다.' };
  }
}
