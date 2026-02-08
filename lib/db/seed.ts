/**
 * Seed Database Script
 * ใช้คำสั่ง: npm run seed
 * 
 * Script นี้จะนำเข้าข้อมูล sample จากไฟล์ seed-data.json
 * เข้าไปใน MongoDB
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import {
  Student,
  Project,
  Evaluator,
  Evaluation,
  EvaluationTemplate,
} from '@/lib/models';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/peerscore';

async function seedDatabase() {
  try {
    // เชื่อมต่อ MongoDB
    console.log('🔌 เชื่อมต่อ MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ เชื่อมต่อสำเร็จ');

    // อ่านไฟล์ seed data
    console.log('\n📂 อ่านไฟล์ seed data...');
    const seedDataPath = path.join(process.cwd(), 'data', 'seed-data.json');
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));
    console.log('✅ อ่านข้อมูลสำเร็จ');

    // ลบข้อมูลเก่า (Optional)
    console.log('\n🗑️ ลบข้อมูลเก่า...');
    await Student.deleteMany({});
    await Project.deleteMany({});
    await Evaluator.deleteMany({});
    await Evaluation.deleteMany({});
    await EvaluationTemplate.deleteMany({});
    console.log('✅ ลบข้อมูลเก่าสำเร็จ');

    // นำเข้า Students
    console.log('\n👥 นำเข้าข้อมูลนักศึกษา...');
    const students = await Student.insertMany(seedData.students);
    console.log(`✅ นำเข้า ${students.length} นักศึกษา`);

    // นำเข้า Evaluators
    console.log('\n👨‍🏫 นำเข้าข้อมูลผู้ประเมิน...');
    const evaluators = await Evaluator.insertMany(seedData.evaluators);
    console.log(`✅ นำเข้า ${evaluators.length} ผู้ประเมิน`);

    // นำเข้า Projects
    console.log('\n📋 นำเข้าข้อมูลโปรเจกต์...');
    const projects = await Project.insertMany(seedData.projects);
    console.log(`✅ นำเข้า ${projects.length} โปรเจกต์`);

    // นำเข้า Evaluations
    console.log('\n📊 นำเข้าข้อมูลการประเมิน...');
    const evaluations = await Evaluation.insertMany(seedData.evaluations);
    console.log(`✅ นำเข้า ${evaluations.length} การประเมิน`);

    // นำเข้า Evaluation Template
    console.log('\n📝 นำเข้าเทมเพลตการประเมิน...');
    await EvaluationTemplate.create(seedData.evaluationTemplate);
    console.log('✅ นำเข้าเทมเพลตสำเร็จ');

    console.log('\n🎉 Seed database สำเร็จ!');
    console.log('====================================');
    console.log(`📊 สรุป:`);
    console.log(`   - นักศึกษา: ${students.length}`);
    console.log(`   - ผู้ประเมิน: ${evaluators.length}`);
    console.log(`   - โปรเจกต์: ${projects.length}`);
    console.log(`   - การประเมิน: ${evaluations.length}`);
    console.log('====================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
