# PeerScore Database Documentation

## 📋 Overview
ระบบฐานข้อมูล MongoDB สำหรับจัดเก็บข้อมูลการประเมินโปรเจกต์จบของนักศึกษา

## 🗄️ Database Collections

### 1. Students Collection
เก็บข้อมูลนักศึกษา

**Schema:**
```typescript
{
  studentId: string (unique, indexed)
  firstName: string
  lastName: string
  email: string (unique)
  department: string
  faculty: string
  year: number (1-4)
  createdAt: Date
  updatedAt: Date
}
```

### 2. Projects Collection
เก็บข้อมูลโปรเจกต์ของนักศึกษา

**Schema:**
```typescript
{
  projectTitle: string (indexed)
  projectType: enum ['Software Development', 'Hardware Development', 'Research', 'Other']
  studentIds: string[] (indexed) // รหัสนักศึกษา
  advisorId: string (indexed)
  academicYear: string
  semester: number (1-2)
  status: enum ['planning', 'development', 'testing', 'completed']
  submittedDate: Date (optional)
  createdAt: Date
  updatedAt: Date
}
```

### 3. Evaluators Collection
เก็บข้อมูลผู้ประเมิน

**Schema:**
```typescript
{
  evaluatorId: string (unique, indexed)
  title: string
  firstName: string
  lastName: string
  position: string
  department: string
  email: string (unique)
  createdAt: Date
  updatedAt: Date
}
```

### 4. Evaluations Collection (ตัวหลัก)
เก็บผลการประเมิน

**Schema:**
```typescript
{
  projectId: string (indexed)
  evaluatorId: string (indexed)
  evaluationType: enum ['advisor', 'committee', 'peer']
  evaluationDate: Date
  scores: {
    content: {
      clarity: number
      completeness: number
      relevance: number
      innovation: number
      subtotal: number
      maxScore: 40
    }
    technical: {
      design: number
      implementation: number
      testing: number
      documentation: number
      subtotal: number
      maxScore: 40
    }
    presentation: {
      delivery: number
      visualAids: number
      answeringQuestions: number
      timeManagement: number
      subtotal: number
      maxScore: 40
    }
  }
  totalScore: number
  maxTotalScore: 120
  percentage: number
  grade: string
  comments: string
  strengths: string[]
  improvements: string[]
  status: enum ['pending', 'completed', 'revised']
  createdAt: Date
  updatedAt: Date
}
```

### 5. EvaluationTemplate Collection
เก็บเทมเพลตการประเมิน

**Schema:**
```typescript
{
  templateName: string (unique, indexed)
  evaluationType: string
  categories: [
    {
      categoryId: string
      categoryName: string
      weight: number
      criteria: [
        {
          criteriaId: string
          criteriaName: string
          maxScore: number
        }
      ]
    }
  ]
  totalMaxScore: number
  passingScore: number
  gradeScale: [
    {
      grade: string
      minScore: number
      maxScore: number
    }
  ]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

## 🔗 Database Connections & Models

### Connection File
**Location:** `/lib/db/mongodb.ts`

ใช้ Mongoose connection pooling เพื่อจัดการการเชื่อมต่อ MongoDB

```typescript
import dbConnect from '@/lib/db/mongodb';
await dbConnect();
```

### Models
**Location:** `/lib/models/`

- `Student.ts` - Student model
- `Project.ts` - Project model
- `Evaluator.ts` - Evaluator model
- `Evaluation.ts` - Evaluation model
- `EvaluationTemplate.ts` - EvaluationTemplate model

## 🌐 API Routes

### Evaluations API
**Base URL:** `/api/evaluations`

#### GET /api/evaluations
ดึงข้อมูลการประเมินทั้งหมด

**Query Parameters:**
- `projectId` - ฟิลเตอร์ตามโปรเจกต์
- `evaluatorId` - ฟิลเตอร์ตามผู้ประเมิน

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 3
}
```

#### POST /api/evaluations
สร้างการประเมินใหม่

**Request Body:**
```json
{
  "projectId": "PRJ001",
  "evaluatorId": "ADV001",
  "evaluationType": "advisor",
  "scores": {
    "content": {
      "clarity": 8.5,
      "completeness": 9.0,
      "relevance": 8.0,
      "innovation": 7.5
    },
    "technical": {
      "design": 8.0,
      "implementation": 8.5,
      "testing": 7.5,
      "documentation": 9.0
    },
    "presentation": {
      "delivery": 8.0,
      "visualAids": 7.5,
      "answeringQuestions": 8.5,
      "timeManagement": 8.0
    }
  },
  "comments": "คุณภาพดี",
  "strengths": ["ดีมาก"],
  "improvements": ["ปรับปรุง"],
  "status": "completed"
}
```

### Projects API
**Base URL:** `/api/projects`

#### GET /api/projects
ดึงข้อมูลโปรเจกต์ทั้งหมด

**Query Parameters:**
- `studentId` - ฟิลเตอร์ตามนักศึกษา
- `advisorId` - ฟิลเตอร์ตามที่ปรึกษา
- `status` - ฟิลเตอร์ตามสถานะ

**Response:** พร้อมข้อมูลการประเมิน, เฉลี่ยคะแนน

#### POST /api/projects
สร้างโปรเจกต์ใหม่

### Students API
**Base URL:** `/api/students`

#### GET /api/students
ดึงข้อมูลนักศึกษา พร้อมคะแนนเฉลี่ย

**Query Parameters:**
- `department` - ฟิลเตอร์ตามภาควิชา

**Response:** พร้อมข้อมูล evaluations

#### POST /api/students
สร้างนักศึกษาใหม่

## 📊 Utility Functions

### Location: `/lib/db/evaluationUtils.ts`

#### getProjectAverageScore(projectId)
ดึงข้อมูลคะแนนเฉลี่ยของโปรเจกต์

```typescript
const result = await getProjectAverageScore('PRJ001');
// Returns: { projectId, evaluationCount, averageScore, averagePercentage, averageGrade }
```

#### getStudentAverageScore(studentId)
ดึงข้อมูลคะแนนเฉลี่ยของนักศึกษา

```typescript
const result = await getStudentAverageScore('6501234567');
// Returns: { studentId, studentName, totalProjects, totalEvaluations, averageScore, ... }
```

#### getEvaluationSummary()
ดึงข้อมูลสรุปทั่วไปของการประเมิน

```typescript
const summary = await getEvaluationSummary();
// Returns: { totalEvaluations, totalProjects, totalStudents, averageScores, gradeDistribution }
```

## 💾 Seed Data

**Location:** `/data/seed-data.json`

ไฟล์ JSON ที่มีข้อมูล sample สำหรับทดสอบ

**ประกอบด้วย:**
- 3 นักศึกษา
- 3 ผู้ประเมิน
- 2 โปรเจกต์
- 3 การประเมิน
- 1 เทมเพลต

## 🚀 Getting Started

1. **ติดตั้ง Dependencies:**
```bash
npm install mongoose
```

2. **ตั้งค่า Environment Variable:**
```
MONGODB_URI=mongodb://localhost:27017/peerscore
```

3. **เชื่อมต่อ Database:**
```typescript
import dbConnect from '@/lib/db/mongodb';
await dbConnect();
```

4. **ใช้ Models:**
```typescript
import { Student, Project, Evaluation } from '@/lib/models';

const students = await Student.find();
```

## 📈 Example Queries

### 1. ดูคะแนนเฉลี่ยของโปรเจกต์
```typescript
const evaluations = await Evaluation.find({ projectId: 'PRJ001' });
const avgScore = evaluations.reduce((sum, e) => sum + e.totalScore, 0) / evaluations.length;
```

### 2. ดูคะแนนของนักศึกษาทั้งหมด
```typescript
const students = await Student.find();
for (const student of students) {
  const result = await getStudentAverageScore(student.studentId);
  console.log(result);
}
```

### 3. ดูการแจกแจงเกรด
```typescript
const summary = await getEvaluationSummary();
console.log(summary.gradeDistribution);
```

## 🔒 Database Indexes

จากการออกแบบ, มี indexes ดังนี้:
- `Student.studentId` (unique, indexed)
- `Student.email` (unique)
- `Project.projectTitle` (indexed)
- `Project.studentIds` (indexed)
- `Project.advisorId` (indexed)
- `Evaluator.evaluatorId` (unique, indexed)
- `Evaluator.email` (unique)
- `Evaluation.projectId` (indexed)
- `Evaluation.evaluatorId` (indexed)
- `EvaluationTemplate.templateName` (unique, indexed)

## 📝 Notes

- คะแนนคำนวณโดยอัตโนมัติเมื่อสร้างการประเมิน
- เกรดกำหนดตามเปอร์เซ็นต์ตามตารางเกรดในเทมเพลต
- สามารถปรับเทมเพลตการประเมินตามต้องการ
- ระบบรองรับการประเมินจากหลายคน (advisor, committee, peer)

## 🆘 Troubleshooting

- ตรวจสอบให้แน่ใจว่า MongoDB เปิดอยู่
- ตรวจสอบค่า MONGODB_URI ในไฟล์ environment
- ตรวจสอบ console logs สำหรับข้อมูลเชื่อมต่อเพิ่มเติม
