import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const topAnimes = await prisma.anime.findMany({
      include: {
        _count: {
          select: { votes: true }
        }
      },
      orderBy: {
        votes: {
          _count: 'desc'
        }
      },
      take: 10
    });

    return NextResponse.json(topAnimes);
  } catch (error) {
    console.error('Error fetching top animes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { winnerId, loserId, userId, animeDetails } = await req.json();

    // 1. Assurer que les animes existent dans notre DB (synchro avec Jikan)
    await Promise.all([
      prisma.anime.upsert({
        where: { id: winnerId },
        update: {},
        create: {
          id: winnerId,
          title: animeDetails.winner.title,
          imageUrl: animeDetails.winner.imageUrl,
          type: animeDetails.winner.type,
        }
      }),
      prisma.anime.upsert({
        where: { id: loserId },
        update: {},
        create: {
          id: loserId,
          title: animeDetails.loser.title,
          imageUrl: animeDetails.loser.imageUrl,
          type: animeDetails.loser.type,
        }
      })
    ]);

    // 2. Enregistrer le vote
    const vote = await prisma.vote.create({
      data: {
        userId: userId, // À remplacer par l'ID de session plus tard
        animeId: winnerId
      }
    });

    // 3. Mettre à jour les XP de l'utilisateur (+10 XP par vote)
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: 10 }
      }
    });

    return NextResponse.json(vote);
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
