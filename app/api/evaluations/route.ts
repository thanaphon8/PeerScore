import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Evaluation, Project } from '@/lib/models';

/**
 * GET /api/evaluations
 * ดึงข้อมูลการประเมินทั้งหมด หรือตามเงื่อนไขที่กำหนด
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const evaluatorId = searchParams.get('evaluatorId');

    let query: any = {};
    if (projectId) query.projectId = projectId;
    if (evaluatorId) query.evaluatorId = evaluatorId;

    const evaluations = await Evaluation.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: evaluations,
      count: evaluations.length,
    });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch evaluations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/evaluations
 * สร้างการประเมินใหม่
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const evaluation = new Evaluation({
      projectId: body.projectId,
      evaluatorId: body.evaluatorId,
      evaluationType: body.evaluationType,
      evaluationDate: new Date(),
      scores: {
        content: {
          clarity: body.scores.content.clarity,
          completeness: body.scores.content.completeness,
          relevance: body.scores.content.relevance,
          innovation: body.scores.content.innovation,
          subtotal:
            body.scores.content.clarity +
            body.scores.content.completeness +
            body.scores.content.relevance +
            body.scores.content.innovation,
          maxScore: 40,
        },
        technical: {
          design: body.scores.technical.design,
          implementation: body.scores.technical.implementation,
          testing: body.scores.technical.testing,
          documentation: body.scores.technical.documentation,
          subtotal:
            body.scores.technical.design +
            body.scores.technical.implementation +
            body.scores.technical.testing +
            body.scores.technical.documentation,
          maxScore: 40,
        },
        presentation: {
          delivery: body.scores.presentation.delivery,
          visualAids: body.scores.presentation.visualAids,
          answeringQuestions: body.scores.presentation.answeringQuestions,
          timeManagement: body.scores.presentation.timeManagement,
          subtotal:
            body.scores.presentation.delivery +
            body.scores.presentation.visualAids +
            body.scores.presentation.answeringQuestions +
            body.scores.presentation.timeManagement,
          maxScore: 40,
        },
      },
      comments: body.comments,
      strengths: body.strengths || [],
      improvements: body.improvements || [],
      status: body.status || 'pending',
    });

    evaluation.totalScore =
      evaluation.scores.content.subtotal +
      evaluation.scores.technical.subtotal +
      evaluation.scores.presentation.subtotal;

    evaluation.maxTotalScore = 120;
    evaluation.percentage = (evaluation.totalScore / 120) * 100;

    // คำนวณเกรด
    if (evaluation.percentage >= 80) {
      evaluation.grade = 'A';
    } else if (evaluation.percentage >= 75) {
      evaluation.grade = 'B+';
    } else if (evaluation.percentage >= 70) {
      evaluation.grade = 'B';
    } else if (evaluation.percentage >= 65) {
      evaluation.grade = 'C+';
    } else if (evaluation.percentage >= 60) {
      evaluation.grade = 'C';
    } else if (evaluation.percentage >= 55) {
      evaluation.grade = 'D+';
    } else if (evaluation.percentage >= 50) {
      evaluation.grade = 'D';
    } else {
      evaluation.grade = 'F';
    }

    await evaluation.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Evaluation created successfully',
        data: evaluation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating evaluation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create evaluation' },
      { status: 500 }
    );
  }
}
