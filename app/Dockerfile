# 1. ใช้ Node.js เป็นฐาน
FROM node:20-alpine

# 2. สร้างโฟลเดอร์สำหรับเก็บแอปใน Docker
WORKDIR /app

# 3. ก๊อปปี้ไฟล์ package เพื่อติดตั้ง dependencies ก่อน
COPY package*.json ./

# 4. ติดตั้ง package
RUN npm install

# 5. ก๊อปปี้โค้ดทั้งหมดที่เหลือเข้าเครื่อง Docker
COPY . .

# 6. กำหนด Port (สมมติว่าแอปคุณรันที่ 3000)
EXPOSE 3000

# 7. สั่งให้โปรเจกต์เริ่มทำงาน
CMD ["npm", "run", "dev"]