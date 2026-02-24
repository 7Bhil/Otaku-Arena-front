import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/quizzes.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const allQuizBundles = JSON.parse(fileData);
    
    // Mélanger les bundles et en prendre 5 pour le parcours
    const selectedBundles = allQuizBundles
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    let sessionQuestions = [];
    let roadmap = [];

    selectedBundles.forEach(bundle => {
      // Pour chaque bundle, prendre 6 questions (ou toutes si moins de 6)
      const bundleQuestions = bundle.questions
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .map(q => ({
          ...q,
          animeTitle: bundle.title,
          quizId: bundle.id
        }));
      
      sessionQuestions = [...sessionQuestions, ...bundleQuestions];
      
      roadmap.push({
        id: bundle.id,
        title: bundle.title,
        questionCount: bundleQuestions.length
      });
    });

    return NextResponse.json({
      id: `journey-${Date.now()}`,
      title: "Parcours Otaku",
      questions: sessionQuestions,
      roadmap: roadmap,
      xpReward: 500
    });
  } catch (error) {
    console.error('Error creating quiz session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
