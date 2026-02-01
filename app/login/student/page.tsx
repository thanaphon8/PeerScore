'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ChevronRight,
  UserCircle,
  Users,
  Plus,
  Check,
  GraduationCap
} from 'lucide-react';

interface ProjectGroup {
  id: string;
  groupName: string;
  projectName: string;
  members: string[];
}

const PROJECT_GROUPS: ProjectGroup[] = [
  {
    id: 'g1',
    groupName: 'Cyber Knights',
    projectName: 'AI Smart Home Dashboard',
    members: ['สมชาย สายเทพ', 'วิภาวี มีสุข', 'กิตติศักดิ์ รักเรียน']
  },
  {
    id: 'g2',
    groupName: 'Quantum Coders',
    projectName: 'Blockchain Voting System',
    members: ['นพดล คนดี', 'อรัญญา ฟ้าใส']
  },
  {
    id: 'g3',
    groupName: 'Data Wizards',
    projectName: 'Predictive Analytics Tool',
    members: ['จิรายุ บินหลา', 'พิมลพรรณ วงศ์คำ', 'ชลสิทธิ์ นิดหน่อย']
  },
  {
    id: 'g4',
    groupName: 'InnovateX',
    projectName: 'Smart City Traffic Control',
    members: ['กมล แสนดี', 'ศิริพร สุขใจ']
  },
  {
    id: 'g5',
    groupName: 'Tech Titans',
    projectName: 'Drone Delivery Network',
    members: ['ณัฐพล มั่นคง', 'ธนภัทร เจริญ', 'วรินทร แก้วใส']
  },
  {
    id: 'g6',
    groupName: 'Code Breakers',
    projectName: 'Cybersecurity Shield',
    members: ['ปิติพงศ์ ยั่งยืน', 'มัลลิกา งามตา']
  }
];

const AVATAR_SEEDS = [
  'Felix', 'Aneka', 'Luna', 'Oliver', 'Mia', 'Charlie', 
  'Zoe', 'Max', 'Sophie', 'Leo', 'Emma', 'Jack',
  'Lily', 'Oscar', 'Ava', 'Milo', 'Chloe', 'Archie'
];

const getAvatarUrl = (seed: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffffff`;
};

export default function StudentLoginPage(): React.ReactElement {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [studentName, setStudentName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_SEEDS[0]);

  const handleNameSubmit = (): void => {
    if (studentName.trim()) {
      setStep(2);
    }
  };

  const handleLogin = (): void => {
    // Save user data to localStorage
    const userData = {
      name: studentName,
      avatar: selectedAvatar,
      groupId: `student_${Date.now()}`, // Temporary ID, will select group later
      userType: 'student'
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    router.push('/room');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-[#1D324B] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1D324B]/[0.02] pointer-events-none" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-3xl w-full">
        <button 
          onClick={() => step === 1 ? router.push('/login') : setStep((step - 1) as 1 | 2)}
          className="flex items-center gap-2 text-slate-600 hover:text-[#1D324B] mb-8 font-black text-xs uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          ย้อนกลับ
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-[#1D324B] mb-2">เข้าสู่ระบบนักเรียน</h2>
            <p className="text-slate-600 text-sm font-medium">
              {step === 1 && 'กรุณากรอกชื่อของคุณ'}
              {step === 2 && 'เลือกรูปอวาตาร์ของคุณ'}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div 
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step ? 'w-12 bg-blue-600' : s < step ? 'w-8 bg-blue-400' : 'w-8 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Name Input */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider">ชื่อของคุณ</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="กรอกชื่อ-นามสกุล"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-bold text-[#1D324B] transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                />
              </div>
              <button
                onClick={handleNameSubmit}
                disabled={!studentName.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-wider disabled:cursor-not-allowed"
              >
                ถัดไป
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Avatar Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-blue-600 shadow-xl ring-4 ring-blue-100">
                  <img src={getAvatarUrl(selectedAvatar)} alt="Selected Avatar" className="w-full h-full object-cover" />
                </div>
                <p className="font-black text-[#1D324B] text-lg">{studentName}</p>
              </div>

              <div className="grid grid-cols-6 gap-3 max-h-80 overflow-y-auto p-2">
                {AVATAR_SEEDS.map((seed) => (
                  <button
                    key={seed}
                    onClick={() => setSelectedAvatar(seed)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedAvatar === seed 
                        ? 'border-blue-600 ring-4 ring-blue-100 scale-110' 
                        : 'border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <img src={getAvatarUrl(seed)} alt={seed} className="w-full h-full object-cover" />
                    {selectedAvatar === seed && (
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                        <Check className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
              >
                เข้าสู่ระบบ
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}