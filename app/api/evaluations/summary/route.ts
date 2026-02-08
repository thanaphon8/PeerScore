import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { getEvaluationSummary } from '@/lib/db/evaluationUtils';

/**
 * GET /api/evaluations/summary
 * ดึงข้อมูลสรุปการประเมิน
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const summary = await getEvaluationSummary();

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error fetching evaluation summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch evaluation summary' },
      { status: 500 }
    );
  }
}
