import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Evaluation } from '@/lib/models';

/**
 * GET /api/evaluations/[id]
 * ดึงข้อมูลการประเมินตามหนึ่ง
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const evaluation = await Evaluation.findById(id);

    if (!evaluation) {
      return NextResponse.json(
        { success: false, error: 'Evaluation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch evaluation' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/evaluations/[id]
 * อัพเดตการประเมิน
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const evaluation = await Evaluation.findById(id);

    if (!evaluation) {
      return NextResponse.json(
        { success: false, error: 'Evaluation not found' },
        { status: 404 }
      );
    }

    // อัพเดตข้อมูล
    if (body.scores) {
      evaluation.scores = body.scores;
      evaluation.totalScore =
        evaluation.scores.content.subtotal +
        evaluation.scores.technical.subtotal +
        evaluation.scores.presentation.subtotal;
      evaluation.percentage = (evaluation.totalScore / 120) * 100;

      // คำนวณเกรดใหม่
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
    }

    if (body.comments) evaluation.comments = body.comments;
    if (body.strengths) evaluation.strengths = body.strengths;
    if (body.improvements) evaluation.improvements = body.improvements;
    if (body.status) evaluation.status = body.status;

    await evaluation.save();

    return NextResponse.json({
      success: true,
      message: 'Evaluation updated successfully',
      data: evaluation,
    });
  } catch (error) {
    console.error('Error updating evaluation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update evaluation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/evaluations/[id]
 * ลบการประเมิน
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const evaluation = await Evaluation.findByIdAndDelete(id);

    if (!evaluation) {
      return NextResponse.json(
        { success: false, error: 'Evaluation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Evaluation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete evaluation' },
      { status: 500 }
    );
  }
}
