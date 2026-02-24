import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const topOtakus = await prisma.user.findMany({
      orderBy: [
        { level: 'desc' },
        { xp: 'desc' }
      ],
      take: 20,
      select: {
        id: true,
        username: true,
        avatar: true,
        level: true,
        xp: true,
        _count: {
          select: { votes: true, quizAttempts: true }
        }
      }
    });

    return NextResponse.json(topOtakus);
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
