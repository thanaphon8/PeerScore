'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Users,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function TeacherLoginPage(): React.ReactElement {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = (): void => {
    // Simple authentication (in production, this should be server-side)
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 text-[#1D324B] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1D324B]/[0.02] pointer-events-none" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-md w-full">
        <button 
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 text-slate-600 hover:text-[#1D324B] mb-8 font-black text-xs uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          ย้อนกลับ
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-[#1D324B] mb-2">เข้าสู่ระบบครู</h2>
            <p className="text-slate-600 text-sm font-medium">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">ชื่อผู้ใช้</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="กรอกชื่อผู้ใช้"
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-amber-600 focus:bg-white outline-none font-bold text-[#1D324B] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wider">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="กรอกรหัสผ่าน"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-amber-600 focus:bg-white outline-none font-bold text-[#1D324B] transition-all pr-12"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-bold text-center">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={!username.trim() || !password.trim()}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-black rounded-2xl shadow-lg transition-all uppercase tracking-wider disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              เข้าสู่ระบบ
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-black text-amber-800 mb-2 uppercase tracking-wider">ข้อมูลทดสอบ:</p>
            <p className="text-xs text-amber-700 font-medium">Username: <span className="font-black">teacher</span></p>
            <p className="text-xs text-amber-700 font-medium">Password: <span className="font-black">teacher123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}