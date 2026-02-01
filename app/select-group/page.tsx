'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Users,
  Plus,
  Check,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface ProjectGroup {
  id: string;
  groupName: string;
  projectName: string;
  members: string[];
}

interface UserData {
  name: string;
  avatar: string;
  userType: 'student' | 'teacher';
  groupId?: string;
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

const getAvatarUrl = (seed: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffffff`;
};

export default function SelectGroupPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [projectGroups] = useState<ProjectGroup[]>(PROJECT_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      router.push('/login');
      return;
    }

    const parsedUserData: UserData = JSON.parse(storedUserData);
    setUserData(parsedUserData);

    const roomIdFromUrl = searchParams.get('roomId');
    if (!roomIdFromUrl) {
      router.push('/room');
      return;
    }
    setRoomId(roomIdFromUrl);

    // Load all users who have joined this room
    const allUsers: string[] = [];
    
    // Add users from all rooms
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('rooms_')) {
        const userName = key.replace('rooms_', '');
        const userRooms = localStorage.getItem(key);
        if (userRooms) {
          const rooms = JSON.parse(userRooms);
          const hasRoom = rooms.some((r: any) => r.id === roomIdFromUrl);
          if (hasRoom && userName !== parsedUserData.name) {
            allUsers.push(userName);
          }
        }
      }
    }
    
    // Add some mock users if no users found
    if (allUsers.length === 0) {
      allUsers.push('สมชาย ใจดี', 'วิภา สุขใจ', 'กิตติ รักเรียน', 'อรทัย แสงใส', 'นพดล มั่นคง');
    }
    
    setAvailableUsers(allUsers);

    // Load custom groups from localStorage
    const storedGroups = localStorage.getItem('projectGroups');
    if (storedGroups) {
      const customGroups = JSON.parse(storedGroups);
      // Merge with default groups
    }
  }, [router, searchParams]);

  const handleSelectGroup = (): void => {
    if (!selectedGroupId || !roomId || !userData) return;

    const selectedGroup = projectGroups.find(g => g.id === selectedGroupId);
    if (!selectedGroup) return;

    // Update user data with group info - this ensures user is only in one group
    const updatedUserData = {
      ...userData,
      groupId: selectedGroupId,
      groupName: selectedGroup.groupName,
      projectName: selectedGroup.projectName,
      isNewGroup: false
    };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));

    // Clear old submission data when changing groups
    const oldGroupId = userData.groupId;
    if (oldGroupId && oldGroupId !== selectedGroupId) {
      localStorage.removeItem(`submissions_${oldGroupId}`);
    }

    // Navigate to main page
    router.push(`/?userGroupId=${selectedGroupId}&roomId=${roomId}`);
  };

  const handleCreateGroup = (): void => {
    if (!newGroupName.trim() || !newProjectName.trim() || !roomId || !userData) return;

    const newGroupId = `g${Date.now()}`;
    
    const newGroup: ProjectGroup = {
      id: newGroupId,
      groupName: newGroupName,
      projectName: newProjectName,
      members: selectedMembers // Use selected members
    };

    // Get existing custom groups (not default ones)
    const storedGroups = localStorage.getItem('projectGroups') || '[]';
    const groups = JSON.parse(storedGroups);
    
    // Add new group
    groups.push(newGroup);
    localStorage.setItem('projectGroups', JSON.stringify(groups));

    // Update user data with new group info
    const updatedUserData = {
      ...userData,
      groupId: newGroupId,
      groupName: newGroupName,
      projectName: newProjectName,
      isNewGroup: true,
      newMembers: selectedMembers
    };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));

    // Navigate to main page
    router.push(`/?userGroupId=${newGroupId}&roomId=${roomId}`);
  };

  const toggleMemberSelection = (member: string): void => {
    setSelectedMembers(prev => {
      if (prev.includes(member)) {
        return prev.filter(m => m !== member);
      } else {
        return [...prev, member];
      }
    });
  };

  if (!userData || !roomId) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1D324B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1D324B] font-bold">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-[#1D324B] p-6">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#1D324B] mb-3 tracking-tight">เลือกกลุ่มของคุณ</h1>
          <p className="text-slate-600 text-lg font-medium">เลือกกลุ่มที่คุณสังกัดอยู่ หรือสร้างกลุ่มใหม่</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-8">
          {!isCreatingGroup ? (
            <div className="space-y-4">
              <div className="grid gap-4 max-h-[500px] overflow-y-auto">
                {projectGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`p-5 border-2 rounded-2xl text-left transition-all ${
                      selectedGroupId === group.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-400 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-black text-lg text-[#1D324B] mb-1">{group.groupName}</h3>
                        <p className="text-sm text-slate-600 font-medium mb-2">{group.projectName}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Users className="w-3 h-3" />
                          <span className="font-bold">{group.members.length} สมาชิก</span>
                        </div>
                      </div>
                      {selectedGroupId === group.id && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsCreatingGroup(true)}
                className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-blue-600 hover:bg-blue-50 rounded-2xl font-black text-slate-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Plus className="w-5 h-5" />
                สร้างกลุ่มใหม่
              </button>

              <button
                onClick={handleSelectGroup}
                disabled={!selectedGroupId}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-black rounded-2xl shadow-lg transition-all uppercase tracking-wider disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                ยืนยันและเข้าห้อง
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">ชื่อกลุ่ม</label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="เช่น Code Warriors"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white outline-none font-bold text-[#1D324B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">ชื่อโปรเจกต์</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="เช่น AI Chatbot System"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white outline-none font-bold text-[#1D324B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-3 uppercase tracking-wider">
                    เลือกสมาชิกในกลุ่ม ({selectedMembers.length} คน)
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2 bg-slate-50 rounded-xl border-2 border-slate-200">
                    {availableUsers.map((user) => (
                      <button
                        key={user}
                        onClick={() => toggleMemberSelection(user)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          selectedMembers.includes(user)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-400 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-300 flex-shrink-0">
                            <img 
                              src={getAvatarUrl(user)} 
                              alt={user}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[#1D324B] truncate">{user}</p>
                          </div>
                          {selectedMembers.includes(user) && (
                            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {availableUsers.length === 0 && (
                    <p className="text-xs text-slate-500 mt-2">ไม่พบผู้ใช้งานอื่นในห้องนี้</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsCreatingGroup(false)}
                  className="flex-1 py-4 border-2 border-slate-300 hover:border-slate-400 rounded-2xl font-black text-slate-600 transition-all uppercase tracking-wider"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || !newProjectName.trim()}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-black rounded-2xl shadow-lg transition-all uppercase tracking-wider disabled:cursor-not-allowed"
                >
                  สร้างและเข้าห้อง
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}