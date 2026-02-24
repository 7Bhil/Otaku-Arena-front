import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/quizzes.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const allQuizBundles = JSON.parse(fileData);
    
    // Extraire toutes les questions individuelles
    let allQuestions = [];
    allQuizBundles.forEach(bundle => {
      bundle.questions.forEach(q => {
        allQuestions.push({
          ...q,
          animeTitle: bundle.title,
          quizId: bundle.id
        });
      });
    });

    // Mélanger et prendre 30 questions
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    const sessionQuestions = shuffled.slice(0, 30);

    return NextResponse.json({
      id: `session-${Date.now()}`,
      title: "Défi Global Otaku",
      questions: sessionQuestions,
      xpReward: 500 // Récompense plus haute pour le défi global
    });
  } catch (error) {
    console.error('Error creating quiz session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
