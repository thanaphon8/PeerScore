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
  X
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
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffffff`;
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

    // Get roomId from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const roomIdFromUrl = urlParams.get('roomId');
    if (roomIdFromUrl) {
      setRoomId(roomIdFromUrl);
    } else {
      // Try to get from user's last accessed room
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

    // Simulate saving delay
    await new Promise(resolve => setTimeout(resolve, 500));

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

    // Redirect back to main page with the new group and roomId
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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1D324B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1D324B] font-bold">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  const currentGroup = projectGroups.find(g => g.id === selectedGroupId);
  const hasChanges = name !== userData.name || selectedAvatar !== userData.avatar || selectedGroupId !== userData.groupId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-[#1D324B] p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1D324B]/[0.02] pointer-events-none" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-4xl mx-auto pt-8">
        <button 
          onClick={() => roomId ? router.push(`/?userGroupId=${userData.groupId}&roomId=${roomId}`) : router.push(`/?userGroupId=${userData.groupId}`)}
          className="flex items-center gap-2 text-slate-600 hover:text-[#1D324B] mb-8 font-black text-xs uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          ย้อนกลับ
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                {userData.userType === 'student' ? (
                  <GraduationCap className="w-8 h-8" />
                ) : (
                  <Briefcase className="w-8 h-8" />
                )}
                <h1 className="text-3xl font-black tracking-tight">แก้ไขโปรไฟล์</h1>
              </div>
              <p className="text-white/80 font-medium">จัดการข้อมูลส่วนตัวและการตั้งค่าของคุณ</p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8 sm:p-12 space-y-8">
            {/* User Type Badge */}
            <div className="flex justify-center">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black uppercase ${
                userData.userType === 'teacher' 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {userData.userType === 'teacher' ? '👨‍🏫 ครู' : '🎓 นักเรียน'}
              </span>
            </div>

            {/* Avatar Section */}
            <div className="text-center space-y-4">
              <label className="block text-sm font-black text-slate-700 uppercase tracking-wider mb-4">รูปอวาตาร์</label>
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-blue-600 shadow-xl ring-4 ring-blue-100">
                  <img src={getAvatarUrl(selectedAvatar)} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              {/* Avatar Picker */}
              {showAvatarPicker && (
                <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-black text-slate-700 uppercase">เลือกอวาตาร์</p>
                    <button
                      onClick={() => setShowAvatarPicker(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-8 gap-3 max-h-64 overflow-y-auto">
                    {AVATAR_SEEDS.map((seed) => (
                      <button
                        key={seed}
                        onClick={() => {
                          setSelectedAvatar(seed);
                          setShowAvatarPicker(false);
                        }}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                          selectedAvatar === seed 
                            ? 'border-blue-600 ring-4 ring-blue-100 scale-110' 
                            : 'border-slate-200 hover:border-blue-400'
                        }`}
                      >
                        <img src={getAvatarUrl(seed)} alt={seed} className="w-full h-full object-cover" />
                        {selectedAvatar === seed && (
                          <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider">ชื่อ-นามสกุล</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="กรอกชื่อ-นามสกุล"
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-bold text-[#1D324B] transition-all"
              />
            </div>

            {/* Group Section - Only for Students */}
            {userData.userType === 'student' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">กลุ่มของคุณ</label>
                  <button
                    onClick={() => setShowGroupPicker(!showGroupPicker)}
                    className="text-sm font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                  >
                    เปลี่ยนกลุ่ม
                  </button>
                </div>

                {currentGroup ? (
                  <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-2xl">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-black text-lg text-[#1D324B] mb-1">{currentGroup.groupName}</h3>
                        <p className="text-sm text-slate-600 font-medium mb-2">{currentGroup.projectName}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Users className="w-3 h-3" />
                          <span className="font-bold">{currentGroup.members.length} สมาชิก</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center">
                    <p className="text-slate-500 font-medium">ไม่พบข้อมูลกลุ่ม</p>
                  </div>
                )}

                {/* Group Picker */}
                {showGroupPicker && (
                  <div className="mt-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-black text-slate-700 uppercase">เลือกกลุ่ม</p>
                      <button
                        onClick={() => setShowGroupPicker(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {projectGroups.map((group) => (
                        <button
                          key={group.id}
                          onClick={() => {
                            setSelectedGroupId(group.id);
                            setShowGroupPicker(false);
                          }}
                          className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                            selectedGroupId === group.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-slate-200 hover:border-blue-400 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-black text-base text-[#1D324B] mb-1">{group.groupName}</h3>
                              <p className="text-xs text-slate-600 font-medium mb-2">{group.projectName}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Users className="w-3 h-3" />
                                <span className="font-bold">{group.members.length} สมาชิก</span>
                              </div>
                            </div>
                            {selectedGroupId === group.id && (
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={!hasChanges || !name.trim() || isSaving}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-wider disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    บันทึกการเปลี่ยนแปลง
                  </>
                )}
              </button>
            </div>

            {/* Logout Button */}
            <div className="pt-6 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="w-full py-4 border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
              >
                <LogOut className="w-5 h-5" />
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}