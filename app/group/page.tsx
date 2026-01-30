'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  ChevronRight, 
  UserCircle
} from 'lucide-react';

// --- Types ---
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

export default function GroupPage(): React.ReactElement {
  const router = useRouter();
  const [projectGroups] = useState<ProjectGroup[]>(PROJECT_GROUPS);

  const handleSelectGroup = (groupId: string): void => {
    router.push(`/?userGroupId=${groupId}`);
  };

  return (
    <div className="min-h-screen bg-white text-[#1D324B] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#1D324B]/[0.03] pointer-events-none" />
      <div className="relative z-10 max-w-md w-full bg-white border border-slate-200 p-8 rounded-3xl shadow-xl">
         <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1D324B] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#1D324B]/20">
            <UserCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1D324B] mb-2">ระบุกลุ่มของคุณ</h2>
          <p className="text-slate-600 text-sm font-medium">เลือกกลุ่มที่คุณสังกัดอยู่เพื่อเริ่มใช้งาน</p>
        </div>
        <div className="space-y-3">
          {projectGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => handleSelectGroup(group.id)}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-[#1D324B] hover:bg-slate-50 transition-all flex justify-between items-center group shadow-sm"
            >
              <span className="font-bold text-slate-700 group-hover:text-[#1D324B]">{group.groupName}</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#1D324B]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}