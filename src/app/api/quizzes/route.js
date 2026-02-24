import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

function getLocalQuizzes() {
  const filePath = path.join(process.cwd(), 'src/data/quizzes.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileData);
}

export async function GET() {
  try {
    const quizzes = getLocalQuizzes();
    
    // Simplifier pour le Hub (métadonnées seulement)
    const summary = quizzes.map(q => ({
      id: q.id,
      title: q.title,
      difficulty: q.difficulty,
      xpReward: q.xpReward,
      questionCount: q.questions.length
    }));

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId, quizId, score } = await req.json();
    const quizzes = getLocalQuizzes();
    let xpReward = 100;

    let finalQuizId = quizId;
    if (quizId.startsWith('session-') || quizId.startsWith('journey-')) {
      xpReward = 500;
      // Créer le quiz virtuel s'il n'existe pas
      await prisma.quiz.upsert({
        where: { id: 'global-challenge' },
        update: {},
        create: {
          id: 'global-challenge',
          title: 'Défi Global',
          questions: []
        }
      });
      finalQuizId = 'global-challenge';
    } else {
      const quiz = quizzes.find(q => q.id === quizId);
      if (!quiz) {
        return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
      }
      xpReward = quiz.xpReward;
    }

    // Enregistrer la tentative dans Neon
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: finalQuizId,
        score
      }
    });

    // Calcul des XP
    const xpGained = Math.round((score / 100) * xpReward);
    console.log(`[QUIZ] Processing result: User:${userId}, Score:${score}%, XP:${xpGained}/${xpReward}`);

    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: xpGained }
        }
      });
      console.log(`[QUIZ] XP successfully incremented for ${userId}`);
    } catch (dbError) {
      console.error(`[QUIZ] Failed to update user XP:`, dbError);
      // On continue pour retourner le résultat quand même si l'enregistrement de l'Attempt a réussi
    }

    return NextResponse.json({ attempt, xpGained });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
