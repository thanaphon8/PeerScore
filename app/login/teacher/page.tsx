'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function TeacherLoginPage(): React.ReactElement {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = (): void => {
    if (username === 'teacher' && password === 'teacher123') {
      const userData = {
        name: 'ครู',
        username: username,
        userType: 'teacher',
        avatar: 'Teacher',
        groupId: 'teacher'
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      router.push('/?userGroupId=teacher');
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">

        {/* Back Button */}
        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#1D324B] mb-4 sm:mb-8 font-semibold text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          ย้อนกลับ
        </button>

        <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">

          {/* Top Banner with teacher image */}
          <div className="bg-[#1D324B] px-6 sm:px-10 pt-8 sm:pt-10 pb-0 flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-widest mb-4 sm:mb-6">TEACHER</h1>
            <div className="w-32 h-32 sm:w-48 sm:h-48 relative">
              <Image
                src="/images/teacher.png"
                alt="Teacher"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Form Area */}
          <div className="p-6 sm:p-10">
            <p className="text-center text-gray-500 text-sm font-medium mb-6 sm:mb-8">
              กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
            </p>

            <div className="space-y-4 sm:space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-bold text-[#1D324B] mb-2 uppercase tracking-wider">
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="กรอกชื่อผู้ใช้"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#1D324B] focus:bg-white outline-none font-semibold text-[#1D324B] transition-all placeholder:text-gray-300 text-base"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-[#1D324B] mb-2 uppercase tracking-wider">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="กรอกรหัสผ่าน"
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#1D324B] focus:bg-white outline-none font-semibold text-[#1D324B] transition-all pr-12 placeholder:text-gray-300 text-base"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1D324B] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-500 text-sm font-bold text-center">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleLogin}
                disabled={!username.trim() || !password.trim()}
                className="w-full py-3 sm:py-4 bg-[#1D324B] hover:bg-[#152238] disabled:bg-gray-300 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <Lock className="w-5 h-5" />
                เข้าสู่ระบบ
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">ข้อมูลทดสอบ:</p>
              <p className="text-xs text-gray-500 font-medium">Username: <span className="font-black text-[#1D324B]">teacher</span></p>
              <p className="text-xs text-gray-500 font-medium">Password: <span className="font-black text-[#1D324B]">teacher123</span></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">ระบบประเมินกลุ่มโปรเจกต์ สำหรับการเรียนการสอน</p>
        </div>

      </div>
    </div>
  );
}