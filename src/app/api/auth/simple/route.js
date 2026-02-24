import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { username } = await req.json();

    if (!username || username.trim().length === 0) {
      return NextResponse.json({ error: 'Le pseudo est requis' }, { status: 400 });
    }

    // Rechercher l'utilisateur ou le créer s'il n'existe pas
    let user = await prisma.user.findUnique({
      where: { username: username.trim() }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: username.trim(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username.trim()}`
        }
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
