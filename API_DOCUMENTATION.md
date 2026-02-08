# PeerScore API Documentation

## Base URL
```
http://localhost:3000/api
```

---

## 📊 Evaluations API

### 1. Get All Evaluations
**Endpoint:** `GET /evaluations`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `projectId` | string | ฟิลเตอร์ตามโปรเจกต์ ID |
| `evaluatorId` | string | ฟิลเตอร์ตามผู้ประเมิน ID |

**Example Request:**
```bash
curl "http://localhost:3000/api/evaluations?projectId=PRJ001"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "EVAL001",
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
      "comments": "โปรเจกต์มีความสมบูรณ์ดี",
      "strengths": ["การออกแบบดี", "เอกสารครบถ้วน"],
      "improvements": ["ปรับปรุง error handling"],
      "status": "completed",
      "createdAt": "2024-03-20T13:00:00Z",
      "updatedAt": "2024-03-20T15:30:00Z"
    }
  ],
  "count": 1
}
```

---

### 2. Get Single Evaluation
**Endpoint:** `GET /evaluations/:id`

**Example Request:**
```bash
curl "http://localhost:3000/api/evaluations/EVAL001"
```

**Response:**
```json
{
  "success": true,
  "data": { /* evaluation object */ }
}
```

---

### 3. Create New Evaluation
**Endpoint:** `POST /evaluations`

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
  "comments": "โปรเจกต์มีคุณภาพดี",
  "strengths": ["ออกแบบดี", "เอกสารสมบูรณ์"],
  "improvements": ["เพิ่ม test cases", "ปรับปรุง error handling"],
  "status": "completed"
}
```

**Example Request:**
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
    "strengths": ["ดี"],
    "improvements": ["ปรับปรุง"],
    "status": "completed"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Evaluation created successfully",
  "data": { /* created evaluation */ }
}
```

---

### 4. Update Evaluation
**Endpoint:** `PUT /evaluations/:id`

**Request Body:** (เฉพาะฟิลด์ที่ต้องการอัพเดต)
```json
{
  "scores": { /* updated scores */ },
  "comments": "ปรับเกรด",
  "strengths": [],
  "improvements": [],
  "status": "revised"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Evaluation updated successfully",
  "data": { /* updated evaluation */ }
}
```

---

### 5. Delete Evaluation
**Endpoint:** `DELETE /evaluations/:id`

**Response:**
```json
{
  "success": true,
  "message": "Evaluation deleted successfully"
}
```

---

### 6. Get Evaluation Summary
**Endpoint:** `GET /evaluations/summary`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEvaluations": 3,
    "totalProjects": 2,
    "totalStudents": 3,
    "averageScores": {
      "content": 32.67,
      "technical": 32.67,
      "presentation": 32.33
    },
    "gradeDistribution": {
      "A": 2,
      "B": 1,
      "C": 0,
      "D": 0,
      "F": 0
    }
  }
}
```

---

## 📚 Projects API

### 1. Get All Projects
**Endpoint:** `GET /projects`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `studentId` | string | ฟิลเตอร์ตามนักศึกษา ID |
| `advisorId` | string | ฟิลเตอร์ตามที่ปรึกษา ID |
| `status` | string | ฟิลเตอร์ตามสถานะ (planning, development, testing, completed) |

**Example Request:**
```bash
curl "http://localhost:3000/api/projects?status=completed"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "PRJ001",
      "projectTitle": "ระบบจัดการคลังสินค้าอัจฉริยะ",
      "projectType": "Software Development",
      "studentIds": ["STD001", "STD002"],
      "advisorId": "ADV001",
      "academicYear": "2567",
      "semester": 2,
      "status": "completed",
      "submittedDate": "2024-03-15T14:30:00Z",
      "evaluations": [ /* evaluation data */ ],
      "evaluationCount": 2,
      "averageScore": "99.50"
    }
  ],
  "count": 1
}
```

---

### 2. Create New Project
**Endpoint:** `POST /projects`

**Request Body:**
```json
{
  "projectTitle": "ระบบจัดการห้อง",
  "projectType": "Software Development",
  "studentIds": ["STD001", "STD002"],
  "advisorId": "ADV001",
  "academicYear": "2567",
  "semester": 2,
  "status": "planning"
}
```

---

## 👥 Students API

### 1. Get All Students
**Endpoint:** `GET /students`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `department` | string | ฟิลเตอร์ตามภาควิชา |

**Example Request:**
```bash
curl "http://localhost:3000/api/students"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "STD001",
      "studentId": "6501234567",
      "firstName": "สมชาย",
      "lastName": "ใจดี",
      "email": "somchai@university.ac.th",
      "department": "วิทยาการคอมพิวเตอร์",
      "faculty": "วิศวกรรมศาสตร์",
      "year": 4,
      "totalProjects": 1,
      "totalEvaluations": 2,
      "averageScore": "99.50",
      "evaluations": [
        {
          "score": 98.0,
          "percentage": 81.67,
          "grade": "A",
          "evaluatedAt": "2024-03-20T13:00:00Z"
        }
      ]
    }
  ],
  "count": 3
}
```

---

### 2. Create New Student
**Endpoint:** `POST /students`

**Request Body:**
```json
{
  "studentId": "6501234567",
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "email": "somchai@university.ac.th",
  "department": "วิทยาการคอมพิวเตอร์",
  "faculty": "วิศวกรรมศาสตร์",
  "year": 4
}
```

---

## 🔍 Example Workflows

### Workflow 1: ดูการประเมินของโปรเจกต์เฉพาะ
```bash
# 1. ดึงข้อมูลการประเมินของโปรเจกต์
curl "http://localhost:3000/api/evaluations?projectId=PRJ001"

# 2. ดูคะแนนเฉลี่ยในสรุป
curl "http://localhost:3000/api/evaluations/summary"
```

### Workflow 2: ส่วนการประเมินของนักศึกษา
```bash
# 1. ดึงข้อมูลนักศึกษา
curl "http://localhost:3000/api/students"

# 2. ดึงโปรเจกต์ของนักศึกษาด้วย studentId
curl "http://localhost:3000/api/projects?studentId=STD001"

# 3. ดึงการประเมินของโปรเจกต์
curl "http://localhost:3000/api/evaluations?projectId=PRJ001"
```

---

## ⚠️ Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": "Evaluation not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Failed to fetch evaluations"
}
```

---

## 🧪 Testing with Postman

1. Import the API endpoints above into Postman
2. Set base URL to `http://localhost:3000/api`
3. Create requests for each endpoint
4. Test CRUD operations

---

## 📝 Notes

- ทุกการประเมินจะคำนวณ `totalScore`, `percentage`, และ `grade` โดยอัตโนมัติ
- `evaluationType` มีค่า: `advisor`, `committee`, `peer`
- `status` มีค่า: `pending`, `completed`, `revised`
- คะแนนจะถูกจัดเก็บเป็น JSON format ในฐานข้อมูล
