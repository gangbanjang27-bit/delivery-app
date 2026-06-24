'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function signup(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: '모든 필드를 입력해주세요.' };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: '이미 존재하는 이메일입니다.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user: { id: user.id, email: user.email, name: user.name }, expires });
    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true });

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: '회원가입 중 오류가 발생했습니다.' };
  }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요.' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { error: '이메일 또는 비밀번호가 잘못되었습니다.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: '이메일 또는 비밀번호가 잘못되었습니다.' };
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user: { id: user.id, email: user.email, name: user.name }, expires });
    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: '로그인 중 오류가 발생했습니다.' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', { expires: new Date(0) });
  return { success: true };
}
