'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1D324B] mb-2">Group Evaluation System</h1>
          <p className="text-gray-500 text-sm sm:text-base">เลือกประเภทผู้ใช้งานเพื่อเข้าสู่ระบบ</p>
        </div>

        {/* Two Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">

          {/* Student Card */}
          <button
            onClick={() => handleSelectUserType('student')}
            className="group bg-white rounded-3xl p-6 sm:p-10 flex flex-col items-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-purple-300"
          >
            <h2 className="text-2xl sm:text-4xl font-black text-[#1D324B] tracking-widest mb-4 sm:mb-8 group-hover:text-purple-400 transition-colors">
              STUDENT
            </h2>
            <div className="w-48 h-48 sm:w-72 sm:h-72 relative mb-3 sm:mb-6">
              <Image
                src="/images/student.png"
                alt="Student"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-xs sm:text-sm font-medium mt-2 sm:mt-4">
              สำหรับนักเรียนที่ต้องการประเมินโปรเจกต์
            </p>
          </button>

          {/* Teacher Card */}
          <button
            onClick={() => handleSelectUserType('teacher')}
            className="group bg-white rounded-3xl p-6 sm:p-10 flex flex-col items-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-amber-300"
          >
            <h2 className="text-2xl sm:text-4xl font-black text-[#1D324B] tracking-widest mb-4 sm:mb-8 group-hover:text-amber-400 transition-colors">
              TEACHER
            </h2>
            <div className="w-48 h-48 sm:w-72 sm:h-72 relative mb-3 sm:mb-6">
              <Image
                src="/images/teacher.png"
                alt="Teacher"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-xs sm:text-sm font-medium mt-2 sm:mt-4">
              สำหรับครูผู้สอนที่ต้องการจัดการระบบ
            </p>
          </button>

        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-10 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">ระบบประเมินกลุ่มโปรเจกต์ สำหรับการเรียนการสอน</p>
        </div>
      </div>
    </div>
  );
}