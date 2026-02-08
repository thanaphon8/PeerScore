# 📚 PeerScore - ระบบประเมินโปรเจกต์จบของนักศึกษา

## Database Setup Guide

### 📦 Structure

```
lib/
├── db/
│   ├── mongodb.ts          # MongoDB connection
│   └── evaluationUtils.ts  # Utility functions
└── models/
    ├── Student.ts          # Student model
    ├── Project.ts          # Project model
    ├── Evaluator.ts        # Evaluator model
    ├── Evaluation.ts       # Evaluation model (หลัก)
    ├── EvaluationTemplate.ts
    └── index.ts            # Export all models

data/
└── seed-data.json          # Sample data

app/api/
├── evaluations/
│   └── route.ts            # Evaluations API
├── projects/
│   └── route.ts            # Projects API
└── students/
    └── route.ts            # Students API

DATABASE.md                  # Full documentation
```

### ⚙️ Installation Steps

1. **ติดตั้ง Mongoose**
```bash
npm install mongoose
```

2. **สร้าง `.env.local` file**
```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/peerscore
```

3. **ตัวเลือก: ใช้ MongoDB Atlas (Cloud)**
```bash
# สำหรับ MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/peerscore
```

### 🚀 Quick Start

#### 1. ดึงข้อมูลการประเมินทั้งหมด
```bash
curl http://localhost:3000/api/evaluations
```

#### 2. ดึงข้อมูลการประเมินของโปรเจกต์เฉพาะ
```bash
curl http://localhost:3000/api/evaluations?projectId=PRJ001
```

#### 3. สร้างการประเมินใหม่
```bash
curl -X POST http://localhost:3000/api/evaluations \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "PRJ001",
    "evaluatorId": "ADV001",
    "evaluationType": "advisor",
    "scores": {
      "content": {"clarity": 8.5, "completeness": 9.0, "relevance": 8.0, "innovation": 7.5},
      "technical": {"design": 8.0, "implementation": 8.5, "testing": 7.5, "documentation": 9.0},
      "presentation": {"delivery": 8.0, "visualAids": 7.5, "answeringQuestions": 8.5, "timeManagement": 8.0}
    },
    "comments": "ดีมาก",
    "strengths": ["ออกแบบดี"],
    "improvements": ["ปรับปรุง"],
    "status": "completed"
  }'
```

#### 4. ดึงข้อมูลนักศึกษา
```bash
curl http://localhost:3000/api/students
```

#### 5. ดึงข้อมูลโปรเจกต์
```bash
curl http://localhost:3000/api/projects
```

### 📊 Database Schema Summary

**5 Collections หลัก:**

1. **Students** - ข้อมูลนักศึกษา
2. **Projects** - ข้อมูลโปรเจกต์
3. **Evaluators** - ข้อมูลผู้ประเมิน
4. **Evaluations** - ผลการประเมิน (หลัก)
5. **EvaluationTemplates** - เทมเพลตการประเมิน

### 💾 Data Storage

ข้อมูลการประเมินเก็บเป็น JSON structure ดังนี้:

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
      "innovation": 7.5,
      "subtotal": 33.0,
      "maxScore": 40
    },
    "technical": {
      "design": 8.0,
      "implementation": 8.5,
      "testing": 7.5,
      "documentation": 9.0,
      "subtotal": 33.0,
      "maxScore": 40
    },
    "presentation": {
      "delivery": 8.0,
      "visualAids": 7.5,
      "answeringQuestions": 8.5,
      "timeManagement": 8.0,
      "subtotal": 32.0,
      "maxScore": 40
    }
  },
  "totalScore": 98.0,
  "maxTotalScore": 120,
  "percentage": 81.67,
  "grade": "A",
  "comments": "ดีมาก",
  "strengths": ["ออกแบบดี"],
  "improvements": ["ปรับปรุง"],
  "status": "completed",
  "createdAt": "2024-03-20T13:00:00Z",
  "updatedAt": "2024-03-20T15:30:00Z"
}
```

### 🔧 Using Models in Code

```typescript
import { Student, Project, Evaluation } from '@/lib/models';
import dbConnect from '@/lib/db/mongodb';

// ต่อเชื่อมต่อ
await dbConnect();

// ดึงข้อมูลนักศึกษา
const students = await Student.find();

// ดึงข้อมูลการประเมิน
const evaluations = await Evaluation.find({ projectId: 'PRJ001' });

// สร้างการประเมินใหม่
const newEvaluation = new Evaluation({
  projectId: 'PRJ001',
  evaluatorId: 'ADV001',
  // ... other fields
});
await newEvaluation.save();
```

### 📈 Utility Functions

```typescript
import {
  getProjectAverageScore,
  getStudentAverageScore,
  getEvaluationSummary
} from '@/lib/db/evaluationUtils';

// ดึงคะแนนเฉลี่ยของโปรเจกต์
const projectScore = await getProjectAverageScore('PRJ001');

// ดึงคะแนนเฉลี่ยของนักศึกษา
const studentScore = await getStudentAverageScore('6501234567');

// ดึงสรุปการประเมิน
const summary = await getEvaluationSummary();
```

### 🐛 Troubleshooting

1. **MongoDB Connection Error**
   - ตรวจสอบ MongoDB running
   - ตรวจสอบ MONGODB_URI ใน .env.local

2. **Model not found**
   - ตรวจสอบ import paths
   - ตรวจสอบไฟล์มีอยู่จริง

3. **API returns 500 error**
   - ตรวจสอบ MongoDB connection
   - ดูข้อมูลใน console

### 📚 More Information

ดูรายละเอียดเพิ่มเติมได้ใน [DATABASE.md](./DATABASE.md)

### 🎯 Next Steps

1. ติดตั้ง dependencies
2. ตั้งค่า MongoDB connection
3. ทดสอบ API endpoints
4. Import seed data (ถ้าต้องการ)
5. เริ่มพัฒนา UI components
