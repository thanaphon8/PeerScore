import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Student, Evaluation, Project } from '@/lib/models';

/**
 * GET /api/students
 * ดึงข้อมูลนักศึกษาทั้งหมด พร้อมคะแนนเฉลี่ย
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');

    let query: any = {};
    if (department) query.department = department;

    const students = await Student.find(query).sort({ studentId: 1 });

    // เพิ่มข้อมูลคะแนน
    const studentsWithScores = await Promise.all(
      students.map(async (student) => {
        const projects = await Project.find({
          studentIds: student.studentId,
        });
        const evaluations = await Evaluation.find({
          projectId: { $in: projects.map((p) => p._id) },
        });

        return {
          ...student.toObject(),
          totalProjects: projects.length,
          totalEvaluations: evaluations.length,
          averageScore:
            evaluations.length > 0
              ? (
                  evaluations.reduce((sum, e) => sum + e.percentage, 0) /
                  evaluations.length
                ).toFixed(2)
              : '-',
          evaluations: evaluations.map((e) => ({
            score: e.totalScore,
            percentage: e.percentage,
            grade: e.grade,
            evaluatedAt: e.evaluationDate,
          })),
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: studentsWithScores,
      count: studentsWithScores.length,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students
 * สร้างนักศึกษาใหม่
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const student = new Student({
      studentId: body.studentId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      department: body.department,
      faculty: body.faculty,
      year: body.year,
    });

    await student.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Student created successfully',
        data: student,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
