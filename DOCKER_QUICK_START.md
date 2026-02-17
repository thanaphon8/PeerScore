# PeerScore Docker Setup Guide

## ขั้นตอนการ Setup Docker

### 1. **เริ่มต้น Docker Desktop**
   - เปิด Docker Desktop บน Windows
   - รอให้ Docker daemon เริ่มทำงาน (ดูไอคอน Docker ในการค้นหา)

### 2. **ตรวจสอบการเชื่อมต่อ**
   ```bash
   docker ps
   ```
   ถ้าไม่มี error แสดงว่า Docker พร้อมใช้งาน

### 3. **สร้าง .env.local (ถ้ายังไม่มี)**
   ```bash
   copy .env.example .env.local
   ```
   
   คุณสามารถแก้ไข `.env.local` ได้ (default พร้อมใช้งาน):
   ```env
   MONGODB_URI=mongodb://root:rootpassword@mongodb:27017/peerscore?authSource=admin
   MONGO_INITDB_ROOT_USERNAME=root
   MONGO_INITDB_ROOT_PASSWORD=rootpassword
   NODE_ENV=production
   ```

### 4. **สร้างและรัน Containers**

   **Development Mode (รอ logs):**
   ```bash
   docker-compose up --build
   ```

   **Background Mode (ไม่รอ):**
   ```bash
   docker-compose up -d --build
   ```

### 5. **ตรวจสอบสถานะ**
   ```bash
   # ดูสถานะทั้งหมด
   docker-compose ps

   # ดู logs
   docker-compose logs -f

   # ดู logs ของ app เท่านั้น
   docker-compose logs -f app
   ```

### 6. **เข้าใช้งาน**
   - **Application**: http://localhost:3000
   - **MongoDB (localhost)**: mongodb://root:rootpassword@localhost:27017/peerscore?authSource=admin

### 7. **หยุด Containers**
   ```bash
   # Stop containers (เก็บข้อมูล)
   docker-compose down

   # Stop และลบข้อมูล
   docker-compose down -v
   ```

## ปัญหาที่อาจเจอ

### ❌ "Docker daemon is not running"
   - **วิธีแก้**: เปิด Docker Desktop และรอให้ daemon เริ่มทำงาน

### ❌ Port 3000 หรือ 27017 ถูกใช้งาน
   - **วิธีแก้**: ปิดแอปอื่น หรือแก้ไข port ใน docker-compose.yml

### ❌ MongoDB connection error
   - **วิธีแก้**: ตรวจสอบว่า MongoDB container กำลังรันอยู่ (`docker-compose logs mongodb`)

## Tips สำหรับ Deployment

1. **ก่อน Deploy** ให้เปลี่ยนค่า Environment Variables:
   ```env
   NODE_ENV=production
   MONGO_INITDB_ROOT_PASSWORD=<strong-password>
   ```

2. **ตั้ง Resource Limits** ใน docker-compose.yml:
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 1G
   ```

3. **ใช้ Volume สำหรับ MongoDB**:
   - ข้อมูล MongoDB จะเก็บใน `mongo_data` volume
   - ข้อมูลจะยังคงอยู่แม้ลบ container

---

Ready to deploy! 🚀
