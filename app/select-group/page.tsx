'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Plus,
  Check,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface MemberProfile {
  name: string;
  avatar: string;
}

interface ProjectGroup {
  id: string;
  groupName: string;
  projectName: string;
  members: string[];
  memberProfiles?: MemberProfile[];
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
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

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

    // Load all groups including custom ones
    const storedCustomGroups = localStorage.getItem('projectGroups');
    let allGroups = [...PROJECT_GROUPS];
    if (storedCustomGroups) {
      const customGroups = JSON.parse(storedCustomGroups);
      allGroups = [...PROJECT_GROUPS, ...customGroups];
    }
    
    // Load room-specific member profiles
    const roomMembersKey = `roomMembers_${roomIdFromUrl}`;
    const storedRoomMembers = localStorage.getItem(roomMembersKey);
    if (storedRoomMembers) {
      const roomMembers = JSON.parse(storedRoomMembers);
      
      // Update groups with room-specific member data
      allGroups = allGroups.map(group => {
        if (roomMembers[group.id]) {
          return {
            ...group,
            memberProfiles: roomMembers[group.id],
            members: roomMembers[group.id].map((m: any) => 
              typeof m === 'string' ? m : m.name
            )
          };
        }
        return group;
      });
    }
    
    setProjectGroups(allGroups);
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

    // Update room-specific member assignments with profiles
    const roomMembersKey = `roomMembers_${roomId}`;
    const storedRoomMembers = localStorage.getItem(roomMembersKey);
    const roomMembers: { [groupId: string]: any[] } = storedRoomMembers ? JSON.parse(storedRoomMembers) : {};
    
    const currentUserProfile = {
      name: userData.name,
      avatar: userData.avatar || 'default'
    };
    
    // Remove user from all groups
    Object.keys(roomMembers).forEach(groupId => {
      roomMembers[groupId] = roomMembers[groupId].filter((m: any) => {
        // Handle both old format (string) and new format (object)
        const memberName = typeof m === 'string' ? m : m.name;
        return memberName !== userData.name;
      });
    });
    
    // Add user to selected group
    if (!roomMembers[selectedGroupId]) {
      roomMembers[selectedGroupId] = [];
    }
    const existsInGroup = roomMembers[selectedGroupId].some((m: any) => {
      const memberName = typeof m === 'string' ? m : m.name;
      return memberName === userData.name;
    });
    if (!existsInGroup) {
      roomMembers[selectedGroupId].push(currentUserProfile);
    }
    
    // Save updated room members
    localStorage.setItem(roomMembersKey, JSON.stringify(roomMembers));

    // DON'T clear old submission data - allow user to evaluate their previous group
    // The old code cleared submissions which prevented evaluation

    // Navigate to main page
    router.push(`/?userGroupId=${selectedGroupId}&roomId=${roomId}`);
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
    <div className="min-h-screen bg-slate-100 text-[#1D324B] p-6">
      <div className="fixed inset-0 bg-[#1D324B]/[0.03] pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto pt-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#1D324B] mb-3 tracking-tight">เลือกกลุ่มของคุณ</h1>
          <p className="text-slate-600 text-lg font-medium">เลือกกลุ่มที่คุณสังกัดอยู่</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-8">
          <div className="space-y-4">
            <div className="grid gap-4 max-h-[500px] overflow-y-auto">
              {projectGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`p-5 border-2 rounded-2xl text-left transition-all ${
                    selectedGroupId === group.id
                      ? 'border-[#1D324B] bg-slate-50'
                      : 'border-slate-200 hover:border-[#1D324B]/30 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-black text-lg text-[#1D324B] mb-1">{group.groupName}</h3>
                      <p className="text-sm text-slate-600 font-medium mb-3">{group.projectName}</p>
                      
                      {/* Display member avatars */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-bold">สมาชิก:</span>
                        <div className="flex -space-x-2">
                          {(group.memberProfiles && group.memberProfiles.length > 0
                            ? group.memberProfiles
                            : group.members.map(m => ({ name: m, avatar: m }))
                          ).slice(0, 5).map((member, i) => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white shadow-sm overflow-hidden">
                              <img 
                                src={getAvatarUrl(member.avatar)} 
                                alt={member.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))}
                          {(group.memberProfiles ? group.memberProfiles.length : group.members.length) > 5 && (
                            <div className="h-8 w-8 rounded-full border-2 border-white shadow-sm bg-slate-300 flex items-center justify-center">
                              <span className="text-[10px] font-black text-slate-600">+{(group.memberProfiles ? group.memberProfiles.length : group.members.length) - 5}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-bold">({group.memberProfiles ? group.memberProfiles.length : group.members.length})</span>
                      </div>
                    </div>
                    {selectedGroupId === group.id && (
                      <div className="w-6 h-6 bg-[#1D324B] rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSelectGroup}
              disabled={!selectedGroupId}
              className="w-full py-4 bg-[#1D324B] hover:bg-[#152238] disabled:bg-slate-300 text-white font-black rounded-2xl shadow-lg transition-all uppercase tracking-wider disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              ยืนยันและเข้าห้อง
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}