'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  GraduationCap,
  ChevronRight,
  UserCircle,
  Lock
} from 'lucide-react';

export default function LoginPage(): React.ReactElement {
  const router = useRouter();
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);

  const handleSelectUserType = (type: 'student' | 'teacher'): void => {
    setUserType(type);
    if (type === 'student') {
      router.push('/login/student');
    } else {
      router.push('/login/teacher');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-[#1D324B] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-[#1D324B]/[0.02] pointer-events-none" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#1D324B] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#1D324B]/20">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-[#1D324B] mb-3 tracking-tight">Group Evaluation System</h1>
          <p className="text-slate-600 text-lg font-medium">เลือกประเภทผู้ใช้งานเพื่อเข้าสู่ระบบ</p>
        </div>

        {/* User Type Selection */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Student Card */}
          <button
            onClick={() => handleSelectUserType('student')}
            className="group relative bg-white border-2 border-slate-200 rounded-3xl p-8 hover:border-[#1D324B] hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-black text-[#1D324B] mb-3 group-hover:text-blue-600 transition-colors">นักเรียน</h2>
              <p className="text-slate-600 text-sm font-medium mb-6">สำหรับนักเรียนที่ต้องการประเมินโปรเจกต์</p>
              
              <div className="flex items-center justify-center gap-2 text-[#1D324B] font-black text-sm group-hover:gap-4 transition-all">
                <span>เข้าสู่ระบบ</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Teacher Card */}
          <button
            onClick={() => handleSelectUserType('teacher')}
            className="group relative bg-white border-2 border-slate-200 rounded-3xl p-8 hover:border-[#1D324B] hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-black text-[#1D324B] mb-3 group-hover:text-amber-600 transition-colors">ครู</h2>
              <p className="text-slate-600 text-sm font-medium mb-6">สำหรับครูผู้สอนที่ต้องการจัดการระบบ</p>
              
              <div className="flex items-center justify-center gap-2 text-[#1D324B] font-black text-sm group-hover:gap-4 transition-all">
                <span>เข้าสู่ระบบ</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm font-medium">
            ระบบประเมินกลุ่มโปรเจกต์ สำหรับการเรียนการสอน
          </p>
        </div>
      </div>
    </div>
  );
}