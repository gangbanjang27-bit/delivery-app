import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  '한식', '돈까스/회', '카페/디저트', '찜/탕', '패스트푸드', 
  '치킨', '고기', '분식', '양식', '아시안', 
  '중식', '족발/보쌈', '피자', '야식', '도시락'
];

const CUSTOM_IMAGES: Record<string, string> = {
  '한식': 'korean_food_1782300385660.png',
  '돈까스/회': 'sushi_tonkatsu_1782300396217.png',
  '카페/디저트': 'dessert_1782300405230.png',
  '찜/탕': 'stew_1782300415938.png',
  '패스트푸드': 'fastfood_1782300426630.png',
};

const KEYWORDS: Record<string, string> = {
  '치킨': 'korean,fried,chicken',
  '고기': 'korean,bbq,meat',
  '분식': 'korean,streetfood,tteokbokki',
  '양식': 'pasta,steak,restaurant',
  '아시안': 'asian,food,noodles',
  '중식': 'chinese,food,restaurant',
  '족발/보쌈': 'korean,pork,food',
  '피자': 'pizza,food',
  '야식': 'korean,night,snack',
  '도시락': 'korean,bento,lunchbox'
};

const PREFIXES = ['가마솥', '바삭바삭', '전통', '번개', '황금', '홍길동', '장안성', '야반도주', '천하제일', '소문난', '원조', '대박', '꿀맛', '신선', '매콤달콤'];
const SUFFIXES = ['본점', '1호점', '장인', '원조집', '대가', '식당', '주막', '가든', '관', '전문점'];

const MENU_ADJECTIVES = ['특제', '매운', '달콤한', '바삭한', '뜨끈한', '시원한', '푸짐한', '수제'];
const MENU_NOUNS = ['정식', '세트', '단품', '한마리', '큰접시', '한상', '스페셜', '특대'];

const CUSTOM_MENU_IMAGES: Record<string, string> = {
  '한식': '/images/food_korean_1782303273909.png',
  '돈까스/회': '/images/food_tonkatsu_1782303285036.png',
  '카페/디저트': '/images/food_dessert_1782303296653.png',
  '찜/탕': '/images/food_stew_1782303306934.png',
  '패스트푸드': '/images/food_fastfood_1782303317552.png',
  '치킨': '/images/food_chicken_1782303502694.png',
  '고기': '/images/food_meat_1782303514741.png',
  '분식': '/images/food_bunsik_1782303526697.png',
  '양식': '/images/food_pasta_1782303538752.png',
  '아시안': '/images/food_asian_1782303547913.png',
  '중식': '/images/food_chinese_1782303560081.png',
  '족발/보쌈': '/images/food_meat_1782303514741.png',
  '피자': '/images/food_fastfood_1782303317552.png',
  '야식': '/images/food_bunsik_1782303526697.png',
  '도시락': '/images/food_korean_1782303273909.png'
};

async function fetchRecipeImages(keyword: string): Promise<string[]> {
  try {
    const res = await fetch(`https://www.10000recipe.com/recipe/list.html?q=${encodeURIComponent(keyword)}`);
    const html = await res.text();
    const urls: string[] = [];
    const regex = /<img src=\"(https:\/\/recipe1\.ezmember\.co\.kr\/cache\/recipe\/[^\"]+)\"/g;
    let m;
    while ((m = regex.exec(html)) !== null) {
      urls.push(m[1]);
    }
    return urls;
  } catch (e) {
    console.error('Failed to fetch for keyword:', keyword);
    return [];
  }
}

async function main() {
  console.log('Seeding database with user-provided mock data and 10000recipe images...');

  const RECIPE_KEYWORD_MAP: Record<string, string> = {
    '한식': '국밥',
    '돈까스/회': '돈까스',
    '카페/디저트': '케이크',
    '찜/탕': '갈비찜',
    '패스트푸드': '수제버거',
    '치킨': '치킨',
    '고기': '삼겹살',
    '분식': '떡볶이',
    '양식': '파스타',
    '아시안': '쌀국수',
    '중식': '짜장면',
    '족발/보쌈': '보쌈',
    '피자': '피자',
    '야식': '닭발',
    '도시락': '도시락'
  };

  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.restaurant.deleteMany({});

  const mockDataPath = path.join(__dirname, 'mockData.json');
  const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

  for (const category of CATEGORIES) {
    const restaurants = mockData[category];
    if (!restaurants) continue;

    const keyword = RECIPE_KEYWORD_MAP[category] || category;
    console.log(`Fetching fallback images for [${category}] using keyword: ${keyword}...`);
    const fallbackImages = await fetchRecipeImages(keyword);
    let fallbackIdx = 0;
    const usedUrls = new Set<string>();

    const CUSTOM_IMAGE_MAP: Record<string, string> = {
      '아이스 아메리카노 (벤티)': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
      '수제 바닐라빈 라떼': 'https://images.unsplash.com/photo-1461023058943-07cb1ce8db16?w=400',
      '디카페인 콜드브루': 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400',
      '클래식 딥치즈 버거': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      '더블 베이컨 스매시 버거': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400',
      '수제버거 하우스': 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
      '싱싱 산오징어회': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      '바다야식 산오징어': 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
      '달콤 베이커리 카페': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
      '생연어 사시미 (두툼하게)': 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400',
      '마코토 초밥': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400'
    };

    for (const rest of restaurants) {
      const cleanKeyword = (name: string) => {
        const parts = name.split(' ');
        // Get the last word to drop adjectives (e.g., "매콤 고추장 불고기" -> "불고기")
        let noun = parts[parts.length - 1].replace(/정식|세트|추가|백반|\(.*?\)|본점|전문점/g, '').trim();
        if (!noun) noun = parts.length > 1 ? parts[parts.length - 2] : keyword;
        return noun;
      };

      const getSpecificImg = async (specificKeyword: string, fallbackText: string, originalName: string) => {
        if (CUSTOM_IMAGE_MAP[originalName]) return CUSTOM_IMAGE_MAP[originalName];

        const imgs = await fetchRecipeImages(specificKeyword);
        for (const img of imgs) {
          if (!usedUrls.has(img)) {
            usedUrls.add(img);
            return img;
          }
        }
        if (fallbackIdx < fallbackImages.length) {
          const fb = fallbackImages[fallbackIdx++];
          usedUrls.add(fb);
          return fb;
        }
        return `https://via.placeholder.com/400x300?text=${encodeURIComponent(fallbackText)}`;
      };

      console.log(`  -> Scraping image for Restaurant: ${rest.name}`);
      const restImg = await getSpecificImg(cleanKeyword(rest.name), rest.name, rest.name);
      
      const menuCreates = [];
      for (let idx = 0; idx < rest.menus.length; idx++) {
        const menuName = rest.menus[idx];
        const searchWord = cleanKeyword(menuName);
        console.log(`    -> Scraping image for Menu: ${menuName} (Search: ${searchWord})`);
        const menuImg = await getSpecificImg(searchWord, menuName, menuName);
        menuCreates.push({
          name: menuName,
          price: 9000 + (idx * 2000), // Mock pricing
          description: `${menuName} - 정말 맛있습니다!`,
          imageUrl: menuImg
        });
      }
      
      await prisma.restaurant.create({
        data: {
          name: rest.name,
          category: category,
          description: `최고급 재료로 만든 조선 팔도 최고의 ${rest.name} 입니다.`,
          imageUrl: restImg,
          menus: {
            create: menuCreates
          }
        }
      });
    }
  }

  console.log('Seeding finished. Mock data and perfectly matched images applied.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
