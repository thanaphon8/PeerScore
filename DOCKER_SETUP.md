# Docker Setup Guide - PeerScore

คำแนะนำการติดตั้ง Docker สำหรับโปรเจ็ค PeerScore

## ข้อกำหนด (Prerequisites)

- [Docker Desktop](https://www.docker.com/products/docker-desktop) ติดตั้งแล้ว
- คุณอยู่ในโฟลเดอร์ root ของโปรเจ็ค

## โครงสร้างไฟล์ที่เกี่ยวข้อง

```
PeerScore/
├── Dockerfile              # Main application file
├── docker-compose.yml      # Services orchestration
├── .dockerignore           # Files to exclude from Docker
├── .env.example            # Environment variables template
└── app/
    └── Dockerfile          # (ไฟล์เดิม - สามารถลบได้)
```

## วิธีใช้งาน

### 1. เตรียมไฟล์ Environment

สร้างไฟล์ `.env.local` จากไฟล์ `.env.example`:

```bash
cp .env.example .env.local
```

คุณสามารถแก้ไขค่าในไฟล์ `.env.local` ได้:

```bash
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=yourpassword
NODE_ENV=production
```

### 2. สร้างและรัน Containers

**สำหรับการพัฒนา (Development):**

```bash
docker-compose up
```

Docker จะทำการ:
- สร้าง MongoDB container
- สร้าง Next.js app container
- ตรวจ้อบ MongoDB ว่าพร้อมใช้งาน
- เริ่มแอปพลิเคชัน

แอปจะเข้าถึงได้ที่: `http://localhost:3000`

**รัน Detached Mode (พื้นหลัง):**

```bash
docker-compose up -d
```

### 3. ตรวจสอบ Containers

```bash
# ดูสถานะ containers
docker-compose ps

# ดู logs
docker-compose logs -f

# ดู logs ของ app เท่านั้น
docker-compose logs -f app
```

### 4. หยุด Containers

```bash
docker-compose down
```

หมายเหตุ: ข้อมูล MongoDB จะถูกเก็บไว้ใน volume `mongo_data`

### 5. ลบทุกอย่าย (Include ข้อมูล)

```bash
docker-compose down -v
```

## MongoDB Connection

### จากใน Docker:
```
mongodb://root:rootpassword@mongodb:27017/peerscore?authSource=admin
```

### จากเครื่องของคุณ (localhost):
```
mongodb://root:rootpassword@localhost:27017/peerscore?authSource=admin
```

### ใช้ MongoDB Compass:
1. เปิด MongoDB Compass
2. Connection String: `mongodb://root:rootpassword@localhost:27017/peerscore?authSource=admin`
3. Click Connect

## Build Production Image

```bash
docker build -t peerscore:latest .
```

## Run Production Container

```bash
docker run -p 3000:3000 \
  -e MONGODB_URI="mongodb://username:password@host:27017/peerscore?authSource=admin" \
  -e NODE_ENV=production \
  peerscore:latest
```

## Troubleshooting

### 1. Port 3000 ถูกใช้งาน

```bash
# เปลี่ยนไปใช้ port อื่น
docker-compose down
# แล้วแก้ docker-compose.yml:
# ports:
#   - "3001:3000"
```

### 2. MongoDB Connection Error

```bash
# ตรวจสอบสถานะ MongoDB
docker-compose logs mongodb

# รีสตาร์ท containers
docker-compose restart
```

### 3. ลบ Containers และ Volumes

```bash
docker-compose down -v
docker rmi peerscore-app
```

ตามด้วย `docker-compose up` เพื่อเริ่มต้นใหม่

### 4. ตรวจสอบเนทเวิร์ก Docker

```bash
docker network ls
docker network inspect peerscore_peerscore
```

## Development Tips

### Hot Reload
Volumes ต่อไปนี้ถูกตั้งค่าสำหรับ hot reload:
```yaml
volumes:
  - ./app:/app/app
  - ./lib:/app/lib
  - ./public:/app/public
```

### ติดตั้งแพ็คเกจใหม่

เมื่อติดตั้งแพ็คเกจใหม่:

```bash
# ปิด containers
docker-compose down

# ติดตั้งแพ็คเกจ  
npm install new-package

# สร้าง rebuild image
docker-compose up --build
```

### ดำเนินการคำสั่ง npm

```bash
# Run seed script
docker-compose exec app npm run seed

# Run lint
docker-compose exec app npm run lint
```

## Security Notes

⚠️ **สำหรับ Development เท่านั้น:**
- ชื่อผู้ใช้และรหัสผ่าน MongoDB ค่าเริ่มต้นไม่ปลอดภัย
- สำหรับ Production ให้:
  - ใช้รหัสผ่านที่แข็งแรง
  - ใช้ secrets management
  - ใช้ validated environment variables
  - ใช้ private networks

## ตัวอย่าง Environment Variables

```bash
# .env.local

# MongoDB
MONGODB_URI=mongodb://root:securepassword@mongodb:27017/peerscore?authSource=admin
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=securepassword

# Environment
NODE_ENV=production
```

## Reference

- [Next.js Deployment with Docker](https://nextjs.org/docs/deployment/docker)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
