import dbConnect from '@/lib/db/mongodb';
import { Evaluation, Project, Student } from '@/lib/models';

/**
 * ดึงข้อมูลคะแนนเฉลี่ยของโปรเจกต์
 */
export async function getProjectAverageScore(projectId: string) {
  await dbConnect();
  const evaluations = await Evaluation.find({ projectId });

  if (evaluations.length === 0) return null;

  const avgScore =
    evaluations.reduce((sum, e) => sum + e.totalScore, 0) / evaluations.length;
  const avgPercentage =
    evaluations.reduce((sum, e) => sum + e.percentage, 0) / evaluations.length;

  return {
    projectId,
    evaluationCount: evaluations.length,
    averageScore: parseFloat(avgScore.toFixed(2)),
    averagePercentage: parseFloat(avgPercentage.toFixed(2)),
    averageGrade: evaluations[0].grade, // ใช้เกรดแรก (ยังต้องอัพเดตถ้าต้องการค่าเกรด average ที่แม่นยำ)
  };
}

/**
 * ดึงข้อมูลคะแนนของนักศึกษา
 */
export async function getStudentAverageScore(studentId: string) {
  await dbConnect();

  const student = await Student.findOne({ studentId });
  if (!student) return null;

  const projects = await Project.find({
    studentIds: studentId,
  });

  const evaluations = await Evaluation.find({
    projectId: { $in: projects.map((p) => p._id) },
  });

  if (evaluations.length === 0) return null;

  const avgScore =
    evaluations.reduce((sum, e) => sum + e.totalScore, 0) / evaluations.length;
  const avgPercentage =
    evaluations.reduce((sum, e) => sum + e.percentage, 0) / evaluations.length;

  return {
    studentId,
    studentName: `${student.firstName} ${student.lastName}`,
    totalProjects: projects.length,
    totalEvaluations: evaluations.length,
    averageScore: parseFloat(avgScore.toFixed(2)),
    averagePercentage: parseFloat(avgPercentage.toFixed(2)),
    evaluations: evaluations.map((e) => ({
      score: e.totalScore,
      percentage: e.percentage,
      grade: e.grade,
    })),
  };
}

/**
 * ดึงข้อมูลสรุปทั่วไป
 */
export async function getEvaluationSummary() {
  await dbConnect();

  const evaluations = await Evaluation.find();
  const projects = await Project.find();
  const students = await Student.find();

  const categoryScores = {
    content: { total: 0, count: 0 },
    technical: { total: 0, count: 0 },
    presentation: { total: 0, count: 0 },
  };

  evaluations.forEach((evaluation) => {
    categoryScores.content.total += evaluation.scores.content.subtotal;
    categoryScores.content.count++;
    categoryScores.technical.total += evaluation.scores.technical.subtotal;
    categoryScores.technical.count++;
    categoryScores.presentation.total += evaluation.scores.presentation.subtotal;
    categoryScores.presentation.count++;
  });

  return {
    totalEvaluations: evaluations.length,
    totalProjects: projects.length,
    totalStudents: students.length,
    averageScores: {
      content: parseFloat(
        (
          categoryScores.content.total / categoryScores.content.count
        ).toFixed(2)
      ),
      technical: parseFloat(
        (
          categoryScores.technical.total / categoryScores.technical.count
        ).toFixed(2)
      ),
      presentation: parseFloat(
        (
          categoryScores.presentation.total / categoryScores.presentation.count
        ).toFixed(2)
      ),
    },
    gradeDistribution: {
      A: evaluations.filter((e) => e.grade === 'A').length,
      B: evaluations.filter((e) => e.grade === 'B+' || e.grade === 'B').length,
      C: evaluations.filter((e) => e.grade === 'C+' || e.grade === 'C').length,
      D: evaluations.filter((e) => e.grade === 'D+' || e.grade === 'D').length,
      F: evaluations.filter((e) => e.grade === 'F').length,
    },
  };
}
