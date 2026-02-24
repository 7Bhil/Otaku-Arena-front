import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
  const { id } = await params;
  
  try {
    const filePath = path.join(process.cwd(), 'src/data/quizzes.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const quizzes = JSON.parse(fileData);
    
    const quiz = quizzes.find(q => q.id === id);

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
