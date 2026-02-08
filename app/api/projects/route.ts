import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import { Project, Evaluation } from '@/lib/models';

/**
 * GET /api/projects
 * ดึงข้อมูลโปรเจกต์ทั้งหมด
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const advisorId = searchParams.get('advisorId');
    const status = searchParams.get('status');

    let query: any = {};
    if (studentId) query.studentIds = studentId;
    if (advisorId) query.advisorId = advisorId;
    if (status) query.status = status;

    const projects = await Project.find(query).sort({ createdAt: -1 });

    // เพิ่มข้อมูลการประเมิน
    const projectsWithEvaluations = await Promise.all(
      projects.map(async (project) => {
        const evaluations = await Evaluation.find({ projectId: project._id });
        return {
          ...project.toObject(),
          evaluations,
          evaluationCount: evaluations.length,
          averageScore:
            evaluations.length > 0
              ? (
                  evaluations.reduce((sum, e) => sum + e.totalScore, 0) /
                  evaluations.length
                ).toFixed(2)
              : 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: projectsWithEvaluations,
      count: projectsWithEvaluations.length,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * สร้างโปรเจกต์ใหม่
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const project = new Project({
      projectTitle: body.projectTitle,
      projectType: body.projectType,
      studentIds: body.studentIds,
      advisorId: body.advisorId,
      academicYear: body.academicYear,
      semester: body.semester,
      status: body.status || 'planning',
    });

    await project.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Project created successfully',
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
