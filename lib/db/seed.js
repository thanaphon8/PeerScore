#!/usr/bin/env node

/**
 * Seed Database Script
 * ใช้คำสั่ง: npm run seed
 * 
 * Script นี้จะนำเข้าข้อมูล sample จากไฟล์ seed-data.json
 * เข้าไปใน MongoDB
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// อ่าน .env.local โดยตรง
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const equalsIndex = trimmedLine.indexOf('=');
        if (equalsIndex !== -1) {
          const key = trimmedLine.substring(0, equalsIndex).trim();
          const value = trimmedLine.substring(equalsIndex + 1).trim();
          if (key && value) {
            process.env[key] = value;
          }
        }
      }
    }
  } catch (err) {
    console.log('⚠️  ไม่พบ .env.local, ใช้ค่าเริ่มต้น');
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/peerscore';

async function seedDatabase() {
  try {
    // เชื่อมต่อ MongoDB
    console.log('🔌 เชื่อมต่อ MongoDB...');
    console.log('Connection URI:', MONGODB_URI.split('@')[1] || 'localhost');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ เชื่อมต่อสำเร็จ');

    // Import models หลังจากเชื่อมต่อ
    const Student = mongoose.model('Student', new mongoose.Schema({
      studentId: { type: String, required: true, unique: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      department: { type: String, required: true },
      faculty: { type: String, required: true },
      year: { type: Number, required: true },
    }, { timestamps: true }));

    const Project = mongoose.model('Project', new mongoose.Schema({
      projectTitle: { type: String, required: true },
      projectType: { type: String, required: true },
      studentIds: [String],
      advisorId: { type: String, required: true },
      academicYear: { type: String, required: true },
      semester: { type: Number, required: true },
      status: { type: String, default: 'planning' },
      submittedDate: Date,
    }, { timestamps: true }));

    const Evaluator = mongoose.model('Evaluator', new mongoose.Schema({
      evaluatorId: { type: String, required: true, unique: true },
      title: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      position: { type: String, required: true },
      department: { type: String, required: true },
      email: { type: String, required: true, unique: true },
    }, { timestamps: true }));

    const Evaluation = mongoose.model('Evaluation', new mongoose.Schema({
      projectId: { type: String, required: true },
      evaluatorId: { type: String, required: true },
      evaluationType: { type: String, required: true },
      evaluationDate: { type: Date, required: true },
      scores: mongoose.Schema.Types.Mixed,
      totalScore: { type: Number, required: true },
      maxTotalScore: { type: Number, default: 120 },
      percentage: { type: Number, required: true },
      grade: { type: String, required: true },
      comments: { type: String, required: true },
      strengths: [String],
      improvements: [String],
      status: { type: String, default: 'pending' },
    }, { timestamps: true }));

    const EvaluationTemplate = mongoose.model('EvaluationTemplate', new mongoose.Schema({
      templateName: { type: String, required: true, unique: true },
      evaluationType: { type: String, required: true },
      categories: mongoose.Schema.Types.Mixed,
      totalMaxScore: { type: Number, required: true },
      passingScore: { type: Number, required: true },
      gradeScale: mongoose.Schema.Types.Mixed,
      isActive: { type: Boolean, default: true },
    }, { timestamps: true }));

    // อ่านไฟล์ seed data
    console.log('\n📂 อ่านไฟล์ seed data...');
    const seedDataPath = path.join(__dirname, '..', '..', 'data', 'seed-data.json');
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));
    console.log('✅ อ่านข้อมูลสำเร็จ');

    // ลบข้อมูลเก่า
    console.log('\n🗑️  ลบข้อมูลเก่า...');
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

    // นำเข้า Evaluations - จับคู่ projectTitle กับ projects
    console.log('\n📊 นำเข้าข้อมูลการประเมิน...');
    
    // สร้าง map ของ projectTitle -> projectId
    const projectMap = {};
    projects.forEach(project => {
      projectMap[project.projectTitle] = project._id.toString();
    });
    
    // แปลง evaluations ให้มี projectId แทน projectTitle
    const evaluationsWithProjectIds = seedData.evaluations.map(evaluation => ({
      ...evaluation,
      projectId: projectMap[evaluation.projectTitle],
      projectTitle: undefined // ลบออก
    })).filter(evaluation => evaluation.projectId); // ลบ evaluations ที่ไม่พบ project
    
    const evaluations = await Evaluation.insertMany(evaluationsWithProjectIds);
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
    console.log('====================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    try {
      await mongoose.disconnect();
    } catch (e) {
      console.error('Error disconnecting:', e);
    }
  }
}

seedDatabase();
