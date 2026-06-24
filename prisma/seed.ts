import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create Restaurants and Menus
  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: '맛있는 피자집',
      description: '정통 이탈리아식 화덕 피자 전문점',
      imageUrl: 'https://images.unsplash.com/photo-1604381536136-d748f22035ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      menus: {
        create: [
          { name: '마르게리따 피자', price: 18000, description: '토마토, 모짜렐라, 바질이 들어간 기본 피자' },
          { name: '페퍼로니 피자', price: 20000, description: '매콤한 페퍼로니가 듬뿍 들어간 피자' },
          { name: '치즈 오븐 스파게티', price: 12000, description: '치즈가 듬뿍 올라간 토마토 스파게티' },
        ],
      },
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: '바삭 치킨',
      description: '겉바속촉, 매일 깨끗한 기름으로 튀기는 치킨',
      imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      menus: {
        create: [
          { name: '후라이드 치킨', price: 19000, description: '바삭바삭한 오리지널 후라이드' },
          { name: '양념 치킨', price: 21000, description: '달콤 매콤한 특제 양념 소스' },
          { name: '치즈볼 (5개)', price: 5000, description: '쭉쭉 늘어나는 쫄깃한 치즈볼' },
        ],
      },
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
