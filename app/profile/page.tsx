'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  User,
  Users,
  Save,
  Camera,
  Check,
  GraduationCap,
  Briefcase,
  LogOut,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface UserData {
  name: string;
  avatar: string;
  groupId: string;
  userType: 'student' | 'teacher';
  groupName?: string;
  projectName?: string;
  isNewGroup?: boolean;
  newMembers?: string[];
}

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
  'Lily', 'Oscar', 'Ava', 'Milo', 'Chloe', 'Archie',
  'Ruby', 'George', 'Bella', 'Harry', 'Willow', 'Noah'
];

const getAvatarUrl = (seed: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e0e7ff`;
};

export default function ProfilePage(): React.ReactElement {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [name, setName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const [showGroupPicker, setShowGroupPicker] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [projectGroups] = useState<ProjectGroup[]>(PROJECT_GROUPS);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      router.push('/login');
      return;
    }

    const parsedUserData: UserData = JSON.parse(storedUserData);
    setUserData(parsedUserData);
    setName(parsedUserData.name);
    setSelectedAvatar(parsedUserData.avatar);
    setSelectedGroupId(parsedUserData.groupId);

    const urlParams = new URLSearchParams(window.location.search);
    const roomIdFromUrl = urlParams.get('roomId');
    if (roomIdFromUrl) {
      setRoomId(roomIdFromUrl);
    } else {
      const rooms = localStorage.getItem(`rooms_${parsedUserData.name}`);
      if (rooms) {
        const roomsList = JSON.parse(rooms);
        if (roomsList.length > 0) {
          setRoomId(roomsList[roomsList.length - 1].id);
        }
      }
    }
  }, [router]);

  const handleSave = async (): Promise<void> => {
    if (!userData) return;
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const currentGroup = projectGroups.find(g => g.id === selectedGroupId);
    
    const updatedUserData: UserData = {
      ...userData,
      name,
      avatar: selectedAvatar,
      groupId: selectedGroupId,
      groupName: currentGroup?.groupName,
      projectName: currentGroup?.projectName
    };

    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    setUserData(updatedUserData);
    setIsSaving(false);

    if (roomId) {
      router.push(`/?userGroupId=${selectedGroupId}&roomId=${roomId}`);
    } else {
      router.push(`/?userGroupId=${selectedGroupId}`);
    }
  };

  const handleLogout = (): void => {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.removeItem('userData');
      localStorage.removeItem(`submissions_${userData?.groupId}`);
      router.push('/login');
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  const currentGroup = projectGroups.find(g => g.id === selectedGroupId);
  const hasChanges = name !== userData.name || selectedAvatar !== userData.avatar || selectedGroupId !== userData.groupId;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1e293b] font-sans selection:bg-indigo-100">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 lg:py-12">
        {/* Navigation */}
        <button 
          onClick={() => roomId ? router.push(`/?userGroupId=${userData.groupId}&roomId=${roomId}`) : router.push(`/?userGroupId=${userData.groupId}`)}
          className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 px-3 py-2 rounded-lg hover:bg-white/50 transition-all duration-300 w-fit"
        >
          <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm">ย้อนกลับหน้าหลัก</span>
        </button>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Avatar & Identity Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
               
              <div className="relative inline-block mb-4">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-white overflow-hidden relative">
                    <img 
                      src={getAvatarUrl(selectedAvatar)} 
                      alt="Profile" 
                      className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110" 
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute bottom-1 right-1 w-9 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center transition-all duration-300 transform hover:scale-105 border-4 border-white"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-1">{name || 'ไม่มีชื่อ'}</h2>
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                  userData.userType === 'teacher' 
                    ? 'bg-amber-50 text-amber-600 border-amber-200' 
                    : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                }`}>
                  {userData.userType === 'teacher' ? <Briefcase className="w-3 h-3"/> : <GraduationCap className="w-3 h-3"/>}
                  {userData.userType === 'teacher' ? 'คุณครู' : 'นักเรียน'}
                </span>
                
                {currentGroup && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <Users className="w-3 h-3"/>
                    {currentGroup.groupName}
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </button>
            </div>

            {/* Avatar Picker */}
            {showAvatarPicker && (
              <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-5 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-indigo-500"/> เลือกอวาตาร์ใหม่
                  </h3>
                  <button onClick={() => setShowAvatarPicker(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
                  {AVATAR_SEEDS.map((seed) => (
                    <button
                      key={seed}
                      onClick={() => {
                        setSelectedAvatar(seed);
                        setShowAvatarPicker(false);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-square transition-all duration-200 group ${
                        selectedAvatar === seed 
                          ? 'ring-2 ring-indigo-500 shadow-md scale-95' 
                          : 'hover:ring-2 hover:ring-indigo-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity ${selectedAvatar === seed ? 'opacity-100' : ''}`} />
                      <img src={getAvatarUrl(seed)} alt={seed} className="w-full h-full object-cover" />
                      {selectedAvatar === seed && (
                        <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/20">
                          <div className="bg-white rounded-full p-0.5 shadow-sm">
                            <Check className="w-3 h-3 text-indigo-600" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Edit Form */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-5 sm:p-8 border-b border-slate-100 flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-slate-50 to-white">
                <div className="p-2.5 sm:p-3 bg-indigo-100 rounded-xl text-indigo-600">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800">แก้ไขข้อมูลส่วนตัว</h3>
                  <p className="text-xs sm:text-sm text-slate-500">ปรับปรุงข้อมูลของคุณให้เป็นปัจจุบัน</p>
                </div>
              </div>

              <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                {/* Name Input */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="กรอกชื่อ-นามสกุลของคุณ"
                    className="w-full pl-4 pr-4 py-3 sm:py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none font-semibold text-slate-800 transition-all duration-300 placeholder:text-slate-400 text-base"
                  />
                </div>

                {/* Group Section */}
                {userData.userType === 'student' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                        สังกัดกลุ่มโปรเจกต์
                      </label>
                      <button
                        onClick={() => setShowGroupPicker(!showGroupPicker)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {showGroupPicker ? 'ปิดตัวเลือก' : 'เปลี่ยนกลุ่ม'}
                      </button>
                    </div>

                    {!showGroupPicker && currentGroup && (
                      <div className="p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl flex items-start justify-between group hover:shadow-md transition-all duration-300">
                        <div>
                          <h4 className="font-black text-base sm:text-lg text-indigo-900 mb-1">{currentGroup.groupName}</h4>
                          <p className="text-slate-600 font-medium text-xs sm:text-sm mb-3">{currentGroup.projectName}</p>
                          <div className="flex -space-x-2">
                            {currentGroup.members.slice(0, 3).map((m, i) => (
                              <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-700" title={m}>
                                {m.charAt(0)}
                              </div>
                            ))}
                            {currentGroup.members.length > 3 && (
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                                +{currentGroup.members.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-2 bg-white rounded-full shadow-sm text-indigo-500">
                          <Check className="w-5 h-5" />
                        </div>
                      </div>
                    )}

                    {showGroupPicker && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {projectGroups.map((group) => (
                          <button
                            key={group.id}
                            onClick={() => {
                              setSelectedGroupId(group.id);
                              setShowGroupPicker(false);
                            }}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 relative overflow-hidden ${
                              selectedGroupId === group.id
                                ? 'border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-500'
                                : 'border-slate-100 bg-white hover:border-indigo-300 hover:shadow-sm'
                            }`}
                          >
                            <div className="relative z-10">
                              <h4 className={`font-bold text-sm mb-1 ${selectedGroupId === group.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                                {group.groupName}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-1 mb-2">{group.projectName}</p>
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Users className="w-3 h-3" />
                                <span>{group.members.length} คน</span>
                              </div>
                            </div>
                            {selectedGroupId === group.id && (
                              <div className="absolute top-0 right-0 p-1.5 bg-indigo-500 rounded-bl-xl text-white">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Footer Actions */}
              <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || !name.trim() || isSaving}
                  className="w-full sm:w-auto relative overflow-hidden px-6 sm:px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 disabled:shadow-none transition-all transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-sm sm:text-base"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>บันทึกการเปลี่ยนแปลง</span>
                      <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </>
                  )}
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}