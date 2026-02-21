'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  ChevronRight,
  Check,
  Trash2,
  History
} from 'lucide-react';

interface SavedProfile {
  name: string;
  avatar: string;
  groupId: string;
  groupName?: string;
  lastLogin: string;
}

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
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const profiles: SavedProfile[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('profile_')) {
            const profileData = localStorage.getItem(key);
            if (profileData) {
              profiles.push(JSON.parse(profileData));
            }
          }
        }
        profiles.sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
        setSavedProfiles(profiles);
      } catch (error) {
        console.error('Error loading profiles:', error);
      }
    }
  }, []);

  const handleNameSubmit = (): void => {
    if (studentName.trim()) {
      const existingProfile = savedProfiles.find(p => p.name.toLowerCase() === studentName.trim().toLowerCase());
      if (existingProfile) {
        setSelectedAvatar(existingProfile.avatar);
      }
      setStep(2);
    }
  };

  const handleLogin = (): void => {
    const existingProfile = savedProfiles.find(p => p.name.toLowerCase() === studentName.trim().toLowerCase());
    const userData = {
      name: studentName,
      avatar: selectedAvatar,
      groupId: existingProfile?.groupId || `student_${Date.now()}`,
      groupName: existingProfile?.groupName,
      userType: 'student'
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    const profileData: SavedProfile = {
      name: studentName,
      avatar: selectedAvatar,
      groupId: userData.groupId,
      groupName: existingProfile?.groupName,
      lastLogin: new Date().toISOString()
    };
    localStorage.setItem(`profile_${studentName}`, JSON.stringify(profileData));
    router.push('/room');
  };

  const handleQuickLogin = (profile: SavedProfile): void => {
    const userData = {
      name: profile.name,
      avatar: profile.avatar,
      groupId: profile.groupId,
      groupName: profile.groupName,
      userType: 'student'
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    const updatedProfile: SavedProfile = { ...profile, lastLogin: new Date().toISOString() };
    localStorage.setItem(`profile_${profile.name}`, JSON.stringify(updatedProfile));
    router.push('/room');
  };

  const handleDeleteProfile = (profileName: string, event: React.MouseEvent): void => {
    event.stopPropagation();
    if (!confirm(`คุณต้องการลบโปรไฟล์ "${profileName}" หรือไม่?`)) return;
    localStorage.removeItem(`profile_${profileName}`);
    setSavedProfiles(prev => prev.filter(p => p.name !== profileName));
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl">

        {/* Back Button */}
        <button
          onClick={() => step === 1 ? router.push('/login') : setStep(1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#1D324B] mb-4 sm:mb-8 font-semibold text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          ย้อนกลับ
        </button>

        <div className={`grid gap-4 sm:gap-8 ${savedProfiles.length > 0 ? 'lg:grid-cols-12' : 'lg:grid-cols-1'}`}>

          {/* Main Card */}
          <div className={savedProfiles.length > 0 ? 'lg:col-span-8' : 'max-w-2xl mx-auto w-full'}>
            <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">

              {/* Top Banner with student image */}
              <div className="bg-[#1D324B] px-6 sm:px-10 pt-6 sm:pt-10 pb-0 flex flex-col items-center">
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-widest mb-4 sm:mb-6">STUDENT</h1>
                <div className="w-32 h-32 sm:w-48 sm:h-48 relative">
                  <Image
                    src="/images/student.png"
                    alt="Student"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Form Area */}
              <div className="p-5 sm:p-8 lg:p-10">

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                  {[1, 2].map((s) => (
                    <React.Fragment key={s}>
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-black transition-all ${
                        s < step ? 'bg-[#1D324B] text-white' :
                        s === step ? 'bg-[#1D324B] text-white ring-4 ring-[#1D324B]/20' :
                        'bg-gray-200 text-gray-400'
                      }`}>
                        {s < step ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : s}
                      </div>
                      {s < 2 && (
                        <div className={`h-1 w-12 sm:w-16 rounded-full transition-all ${s < step ? 'bg-[#1D324B]' : 'bg-gray-200'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <p className="text-center text-gray-500 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                  {step === 1 ? 'กรุณากรอกชื่อของคุณ' : 'เลือกรูปอวาตาร์ของคุณ'}
                </p>

                {/* Step 1: Name Input */}
                {step === 1 && (
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#1D324B] mb-2 uppercase tracking-wider">
                        ชื่อ-นามสกุล
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="กรอกชื่อ-นามสกุล"
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#1D324B] focus:bg-white outline-none font-semibold text-[#1D324B] transition-all placeholder:text-gray-300 text-sm sm:text-base"
                        onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                      />
                    </div>
                    <button
                      onClick={handleNameSubmit}
                      disabled={!studentName.trim()}
                      className="w-full py-3 sm:py-4 bg-[#1D324B] hover:bg-[#152238] disabled:bg-gray-300 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      ถัดไป
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}

                {/* Step 2: Avatar Selection */}
                {step === 2 && (
                  <div className="space-y-5 sm:space-y-6">
                    <div className="flex flex-col items-center mb-3 sm:mb-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-[#1D324B] shadow-lg ring-4 ring-gray-100 mb-2 sm:mb-3">
                        <img src={getAvatarUrl(selectedAvatar)} alt="Selected Avatar" className="w-full h-full object-cover" />
                      </div>
                      <p className="font-black text-[#1D324B] text-base sm:text-lg">{studentName}</p>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 max-h-48 sm:max-h-60 overflow-y-auto p-1">
                      {AVATAR_SEEDS.map((seed) => (
                        <button
                          key={seed}
                          onClick={() => setSelectedAvatar(seed)}
                          className={`relative rounded-full overflow-hidden border-2 transition-all aspect-square ${
                            selectedAvatar === seed
                              ? 'border-[#1D324B] ring-4 ring-[#1D324B]/20 scale-110'
                              : 'border-gray-200 hover:border-[#1D324B]/50'
                          }`}
                        >
                          <img src={getAvatarUrl(seed)} alt={seed} className="w-full h-full object-cover" />
                          {selectedAvatar === seed && (
                            <div className="absolute inset-0 bg-[#1D324B]/20 flex items-center justify-center">
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#1D324B]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleLogin}
                      className="w-full py-3 sm:py-4 bg-[#1D324B] hover:bg-[#152238] text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm sm:text-base"
                    >
                      เข้าสู่ระบบ
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Saved Profiles Sidebar */}
          {savedProfiles.length > 0 && (
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-4 sm:p-6 lg:sticky lg:top-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <History className="w-4 h-4 sm:w-5 sm:h-5 text-[#1D324B]" />
                  <h3 className="text-sm sm:text-base font-black text-[#1D324B]">เข้าสู่ระบบด่วน</h3>
                </div>
                <div className="space-y-2 sm:space-y-3 max-h-96 sm:max-h-[520px] overflow-y-auto">
                  {savedProfiles.map((profile) => (
                    <div
                      key={profile.name}
                      className="w-full p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-[#1D324B]/40 rounded-2xl transition-all group relative"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          onClick={() => handleQuickLogin(profile)}
                          className="flex items-center gap-2 sm:gap-3 flex-1 cursor-pointer min-w-0"
                        >
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gray-300 group-hover:border-[#1D324B]/50 transition-colors flex-shrink-0">
                            <img src={getAvatarUrl(profile.avatar)} alt={profile.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-[#1D324B] truncate text-xs sm:text-sm">{profile.name}</p>
                            {profile.groupName && (
                              <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">{profile.groupName}</p>
                            )}
                            <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">
                              {new Date(profile.lastLogin).toLocaleDateString('th-TH', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDeleteProfile(profile.name, e)}
                          className="p-1.5 sm:p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                          title="ลบโปรไฟล์"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">ระบบประเมินกลุ่มโปรเจกต์ สำหรับการเรียนการสอน</p>
        </div>

      </div>
    </div>
  );
}