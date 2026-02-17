'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Users,
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
  groupName?: string;
  projectName?: string;
  isNewGroup?: boolean;
}

const PROJECT_GROUPS: ProjectGroup[] = [
  {
    id: 'g1',
    groupName: 'Cyber Knights',
    projectName: 'AI Smart Home Dashboard',
    members: ['สมชาย สายเทพ', 'วิภาวี มีสุข', 'กิตติศักดิ์ รักเรียน'],
    memberProfiles: [
      { name: 'สมชาย สายเทพ', avatar: 'Felix' },
      { name: 'วิภาวี มีสุข', avatar: 'Aneka' },
      { name: 'กิตติศักดิ์ รักเรียน', avatar: 'Bob' }
    ]
  },
  {
    id: 'g2',
    groupName: 'Quantum Coders',
    projectName: 'Blockchain Voting System',
    members: ['นพดล คนดี', 'อรัญญา ฟ้าใส'],
    memberProfiles: [
      { name: 'นพดล คนดี', avatar: 'George' },
      { name: 'อรัญญา ฟ้าใส', avatar: 'Zoe' }
    ]
  },
  {
    id: 'g3',
    groupName: 'Data Wizards',
    projectName: 'Predictive Analytics Tool',
    members: ['จิรายุ บินหลา', 'พิมลพรรณ วงศ์คำ', 'ชลสิทธิ์ นิดหน่อย'],
    memberProfiles: [
      { name: 'จิรายุ บินหลา', avatar: 'Max' },
      { name: 'พิมลพรรณ วงศ์คำ', avatar: 'Luna' },
      { name: 'ชลสิทธิ์ นิดหน่อย', avatar: 'Leo' }
    ]
  },
  {
    id: 'g4',
    groupName: 'InnovateX',
    projectName: 'Smart City Traffic Control',
    members: ['กมล แสนดี', 'ศิริพร สุขใจ'],
    memberProfiles: [
      { name: 'กมล แสนดี', avatar: 'Oliver' },
      { name: 'ศิริพร สุขใจ', avatar: 'Mia' }
    ]
  },
  {
    id: 'g5',
    groupName: 'Tech Titans',
    projectName: 'Drone Delivery Network',
    members: ['ณัฐพล มั่นคง', 'ธนภัทร เจริญ', 'วรินทร แก้วใส'],
    memberProfiles: [
      { name: 'ณัฐพล มั่นคง', avatar: 'Simon' },
      { name: 'ธนภัทร เจริญ', avatar: 'Charlie' },
      { name: 'วรินทร แก้วใส', avatar: 'Milo' }
    ]
  },
  {
    id: 'g6',
    groupName: 'Code Breakers',
    projectName: 'Cybersecurity Shield',
    members: ['ปิติพงศ์ ยั่งยืน', 'มัลลิกา งามตา'],
    memberProfiles: [
      { name: 'ปิติพงศ์ ยั่งยืน', avatar: 'Jack' },
      { name: 'มัลลิกา งามตา', avatar: 'Sophie' }
    ]
  }
];

const getAvatarUrl = (seed: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffffff`;
};

function SelectGroupPageContent(): React.ReactElement {
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
    setProjectGroups(allGroups);
  }, [router, searchParams]);

  const handleSelectGroup = (): void => {
    if (!selectedGroupId || !roomId || !userData) return;

    const selectedGroup = projectGroups.find(g => g.id === selectedGroupId);
    if (!selectedGroup) return;

    const updatedUserData = {
      ...userData,
      groupId: selectedGroupId,
      groupName: selectedGroup.groupName,
      projectName: selectedGroup.projectName,
      isNewGroup: false
    };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));

    // Update room-specific member assignments
    const roomMembersKey = `roomMembers_${roomId}`;
    const storedRoomMembers = localStorage.getItem(roomMembersKey);
    const roomMembers: { [groupId: string]: MemberProfile[] } = storedRoomMembers ? JSON.parse(storedRoomMembers) : {};

    const currentUserProfile: MemberProfile = {
      name: userData.name,
      avatar: userData.avatar || 'default'
    };

    // Remove user from all other groups
    Object.keys(roomMembers).forEach(groupId => {
      roomMembers[groupId] = roomMembers[groupId].filter((m: any) => {
        const memberName = typeof m === 'string' ? m : m.name;
        return memberName !== userData.name;
      });
    });

    // If group has no roomMembers yet, seed from memberProfiles
    if (!roomMembers[selectedGroupId] || roomMembers[selectedGroupId].length === 0) {
      const baseProfiles = selectedGroup.memberProfiles
        ? selectedGroup.memberProfiles.filter(m => m.name !== userData.name)
        : selectedGroup.members.map(m => ({ name: m, avatar: m }));
      roomMembers[selectedGroupId] = baseProfiles;
    }

    // Add current user if not already in group
    const alreadyIn = roomMembers[selectedGroupId].some(m => m.name === userData.name);
    if (!alreadyIn) {
      roomMembers[selectedGroupId].push(currentUserProfile);
    }

    localStorage.setItem(roomMembersKey, JSON.stringify(roomMembers));
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
                      <div className="w-6 h-6 bg-[#1D324B] rounded-full flex items-center justify-center">
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

export default function SelectGroupPage(): React.ReactElement {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-[#1D324B] font-black\">Loading...</p>
      </div>
    }>
      <SelectGroupPageContent />
    </Suspense>
  );
}