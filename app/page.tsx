'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Users, 
  CheckCircle2, 
  BarChart3,
  PieChart,
  Clock,
  LogOut,
  Crown
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

const getRandomProfileImage = (seed: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffffff`;
};

export default function App(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projectGroups] = useState<ProjectGroup[]>(PROJECT_GROUPS);
  const [userGroupId, setUserGroupId] = useState<string | null>(null);
  const [submittedGroups, setSubmittedGroups] = useState<string[]>([]);

  useEffect(() => {
    const groupIdFromUrl = searchParams.get('userGroupId');
    if (groupIdFromUrl) {
      setUserGroupId(groupIdFromUrl);
    } else {
      router.push('/group');
    }
  }, [searchParams, router]);

  const currentUserGroup = projectGroups.find(g => g.id === userGroupId);
  const totalGroups = projectGroups.length;
  const evaluatableGroupsCount = projectGroups.filter(g => g.id !== userGroupId).length;
  const completedCount = submittedGroups.length;
  const pendingCount = evaluatableGroupsCount - completedCount;

  const sortedGroups = [...projectGroups].sort((a, b) => {
    if (a.id === userGroupId) return -1;
    if (b.id === userGroupId) return 1;
    return 0;
  });

  const handleSelectGroup = (group: ProjectGroup): void => {
    if (group.id === userGroupId) {
      router.push(`/analyze?userGroupId=${userGroupId}`);
    } else if (!submittedGroups.includes(group.id)) {
      router.push(`/evaluate?groupId=${group.id}&userGroupId=${userGroupId}`);
    }
  };

  if (!userGroupId) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-[#1D324B]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-[#1D324B] selection:bg-[#1D324B]/10">
      <div className="fixed inset-0 bg-[#1D324B]/[0.03] pointer-events-none" />
      <div className="relative z-10 w-full min-h-screen">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <header className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 self-start sm:self-center">
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-slate-200 ring-2 ring-slate-100">
                  <img 
                    src={getRandomProfileImage(currentUserGroup?.groupName || 'default')} 
                    alt={currentUserGroup?.groupName || 'User'}
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xl font-black text-[#1D324B] tracking-tight">{currentUserGroup?.groupName}</span>
                  <div className="mt-1 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-[9px] uppercase tracking-widest font-black">Logged in:</span>
                      <span className="text-[#1D324B] text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 rounded">Active User</span>
                    </div>
                    <button 
                      onClick={() => router.push('/group')}
                      className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-[#1D324B]/60 hover:text-[#1D324B] transition-colors group"
                    >
                      <LogOut className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                      Switch User
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-3xl font-black text-[#1D324B] italic tracking-tighter uppercase">Group Evaluation</h1>
              </div>
              <div className="hidden sm:block w-48"></div>
            </header>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-600 border border-amber-500 p-5 rounded-2xl shadow-md flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black text-amber-100 uppercase">Total Groups</p>
                <p className="text-2xl font-black text-white">{totalGroups}</p>
              </div>
            </div>
            <div className="bg-[#47A15A] border border-[#3e8a4d] p-5 rounded-2xl shadow-md flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white"><CheckCircle2 className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black text-emerald-50 uppercase">Evaluated</p>
                <p className="text-2xl font-black text-white">{completedCount}</p>
              </div>
            </div>
            <div className="bg-[#7F5CFF] border border-[#6b4ae0] p-5 rounded-2xl shadow-md flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white"><Clock className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black text-purple-100 uppercase">Pending</p>
                <p className="text-2xl font-black text-white">{pendingCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Start White Background Section */}
        <div className="bg-white min-h-screen relative shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12 sm:pt-4">
              <div className="flex items-center gap-2 bg-slate-50 w-fit px-4 py-2 rounded-2xl mb-8 border border-slate-100">
                <PieChart className="w-4 h-4 text-[#1D324B]/70" /> 
                <h2 className="text-sm font-bold text-[#1D324B] uppercase tracking-tight">Project Groups List</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {sortedGroups.map((group) => {
                  const isOwnGroup = group.id === userGroupId;
                  const hasBeenEvaluated = submittedGroups.includes(group.id);
                  
                  // Logic for conditional styling
                  const cardBg = isOwnGroup ? 'bg-amber-600 border-amber-500' : hasBeenEvaluated ? 'bg-slate-100 border-slate-200 opacity-80' : 'bg-[#1D324B] border-[#1D324B]';
                  const footerBg = isOwnGroup ? 'bg-amber-700/40' : hasBeenEvaluated ? 'bg-slate-200/50' : 'bg-black/20';

                  return (
                    <button
                      key={group.id}
                      onClick={() => handleSelectGroup(group)}
                      className={`group relative border rounded-3xl text-left transition-all duration-300 shadow-xl overflow-hidden flex flex-col h-full hover:scale-[1.02] ${cardBg}`}
                    >
                      {isOwnGroup && (
                        <div className="absolute top-2 right-2 px-5 py-2.5 bg-white text-amber-600 text-[11px] font-black uppercase rounded-3xl shadow-lg z-20 border border-amber-100 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 fill-current" />
                          กลุ่มของฉัน
                        </div>
                      )}
                      {hasBeenEvaluated && !isOwnGroup && (
                        <div className="absolute top-2 right-2 px-5 py-2.5 bg-emerald-500 text-white text-[11px] font-black uppercase rounded-3xl shadow-lg z-20 flex items-center gap-1.5 border border-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          ประเมินแล้ว
                        </div>
                      )}

                      {/* Top Section Padding */}
                      <div className="p-5 pt-8 relative z-10 flex-grow">
                        <span className={`text-[10px] font-black uppercase tracking-widest block mb-2 ${isOwnGroup ? 'text-amber-200' : hasBeenEvaluated ? 'text-slate-400' : 'text-slate-400'}`}>PROJECT</span>
                        <h3 className={`text-2xl font-black mb-1 leading-tight ${isOwnGroup ? 'text-white' : hasBeenEvaluated ? 'text-[#1D324B]' : 'text-white'}`}>
                          {group.groupName}
                        </h3>
                        <p className={`text-sm font-bold mt-2 ${isOwnGroup ? 'text-amber-50' : hasBeenEvaluated ? 'text-slate-500' : 'text-slate-200/80'}`}>
                          {group.projectName}
                        </p>
                      </div>

                      {/* Member Section with Darker Background & No Line */}
                      <div className={`relative z-10 p-5 pt-4 flex flex-col gap-4 ${footerBg}`}>
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col gap-2">
                                 <span className={`text-[9px] font-black uppercase tracking-widest ${isOwnGroup ? 'text-white/80' : hasBeenEvaluated ? 'text-slate-400' : 'text-white/60'}`}>
                                    MEMBERS: {isOwnGroup ? group.members.length + 1 : group.members.length}
                                 </span>
                                 <div className="flex -space-x-3">
                                    {isOwnGroup && currentUserGroup && (
                                        <div className="h-10 w-10 rounded-full border-2 border-slate-200 shadow-sm transition-transform group-hover:translate-y-[-2px] overflow-hidden">
                                        <img 
                                            src={getRandomProfileImage(currentUserGroup.groupName)} 
                                            alt={currentUserGroup.groupName}
                                            className="object-cover w-full h-full"
                                        />
                                        </div>
                                    )}
                                    {group.members.map((member, i) => (
                                        <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-200 shadow-sm transition-transform group-hover:translate-y-[-2px] overflow-hidden">
                                        <img 
                                            src={getRandomProfileImage(member)} 
                                            alt={member}
                                            className="object-cover w-full h-full"
                                        />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                                {!isOwnGroup && !hasBeenEvaluated ? (
                                    <div className="relative">
                                      <div className="relative flex items-center gap-2 px-7 py-2.5 bg-white rounded-full shadow-xl transition-all border border-slate-100">
                                          <span className="text-[11px] font-black text-[#1D324B] uppercase tracking-wider">เริ่มประเมิน</span>
                                      </div>
                                    </div>
                                ) : isOwnGroup ? (
                                    <div className="flex flex-col items-center gap-1 group/btn">
                                        <BarChart3 className="w-5 h-5 text-white" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-white">ดูผลวิเคราะห์</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 px-4 py-2">
                                        {/* Removed Finished Text as requested */}
                                    </div>
                                )}
                            </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}