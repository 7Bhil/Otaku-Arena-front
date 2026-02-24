import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        votes: {
          include: { anime: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        quizAttempts: {
          include: { quiz: true },
          orderBy: { completedAt: 'desc' },
          take: 5
        },
        badges: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { username, avatar } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        avatar
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
