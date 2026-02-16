'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  BarChart3,
  MessageSquare,
  LayoutTemplate,
  Cpu,
  UserCircle,
  Star,
  AlertCircle,
  Quote
} from 'lucide-react';

// --- Types ---
interface Criteria {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ProjectGroup {
  id: string;
  groupName: string;
  projectName: string;
  members: string[];
  memberProfiles?: Array<{ name: string; avatar: string }>;
}

interface CriteriaStats {
  id: string;
  label: string;
  icon: React.ReactNode;
  avgScore: number;
  totalScore: number;
}

interface GroupStats {
  totalEvaluators: number;
  statsByCriteria: CriteriaStats[];
  overallAverage: number;
  comments: Array<{
    text: string;
    from: string;
    avatar?: string;
    isTeacher?: boolean;
    date: string;
  }>;
}

const EVALUATION_CRITERIA: Criteria[] = [
  { id: 'design', label: 'ความสวยงามและการออกแบบ', icon: <LayoutTemplate className="w-5 h-5" /> },
  { id: 'usability', label: 'ความง่ายในการใช้งาน', icon: <CheckCircle2 className="w-5 h-5" /> },
  { id: 'functionality', label: 'ความสมบูรณ์ของฟีเจอร์', icon: <Cpu className="w-5 h-5" /> },
  { id: 'innovation', label: 'ความคิดสร้างสรรค์และนวัตกรรม', icon: <Star className="w-5 h-5" /> },
  { id: 'presentation', label: 'การนำเสนอและสื่อสาร', icon: <MessageSquare className="w-5 h-5" /> },
  { id: 'teamwork', label: 'การทำงานเป็นทีม', icon: <Users className="w-5 h-5" /> },
];

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

export default function AnalyzeContent(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(null);
  const [userGroupId, setUserGroupId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const userGrpId = searchParams.get('userGroupId');
    const rmId = searchParams.get('roomId');
    
    if (userGrpId) {
      // Load all groups including custom ones
      const storedGroups = localStorage.getItem('projectGroups');
      let allGroups = [...PROJECT_GROUPS];
      if (storedGroups) {
        const customGroups = JSON.parse(storedGroups);
        allGroups = [...PROJECT_GROUPS, ...customGroups];
      }
      
      // Load room-specific member profiles
      if (rmId) {
        const roomMembersKey = `roomMembers_${rmId}`;
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
      }
      
      const group = allGroups.find(g => g.id === userGrpId);
      if (group) {
        setSelectedGroup(group);
        setUserGroupId(userGrpId);
      }
    }
    if (rmId) {
      setRoomId(rmId);
    }
  }, [searchParams]);

  const groupStats = useMemo((): GroupStats | null => {
    if (!selectedGroup) return null;
    const totalEvaluators = 15;
    const statsByCriteria = EVALUATION_CRITERIA.map(c => {
      const rawScore = 1.5 + Math.random() * 3.5;
      return {
        ...c,
        avgScore: parseFloat(rawScore.toFixed(1)),
        totalScore: Math.floor(rawScore * totalEvaluators)
      };
    });
    const overallAverage = statsByCriteria.reduce((acc, curr) => acc + curr.avgScore, 0) / statsByCriteria.length;
    
    // Load real comments from localStorage
    let realComments: Array<{text: string, from: string, date: string}> = [];
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const evaluationsStr = localStorage.getItem('evaluations');
        if (evaluationsStr) {
          const allEvaluations = JSON.parse(evaluationsStr);
          // Filter evaluations for this group that have comments
          const groupEvaluations = allEvaluations.filter(
            (e: any) => e.groupId === selectedGroup.id && e.comment && e.comment.trim()
          );
          
          // Load all groups to get evaluator names
          const storedGroups = localStorage.getItem('projectGroups');
          let allGroups = [...PROJECT_GROUPS];
          if (storedGroups) {
            const customGroups = JSON.parse(storedGroups);
            allGroups = [...PROJECT_GROUPS, ...customGroups];
          }
          
          realComments = groupEvaluations.map((e: any) => {
            // Check if evaluator is a teacher
            const isTeacher = e.evaluatorType === 'teacher';
            let displayName = 'Unknown';
            let avatar = 'default';
            
            if (isTeacher) {
              // Teacher: Show real name and avatar
              displayName = e.evaluatorName || 'ครู';
              avatar = e.evaluatorAvatar || 'default';
            } else {
              // Student: Show group name (anonymous)
              const evaluatorGroup = allGroups.find(g => g.id === e.evaluatorGroupId);
              displayName = evaluatorGroup?.groupName || 'Unknown Group';
            }
            
            return {
              text: e.comment,
              from: displayName,
              avatar: avatar,
              isTeacher: isTeacher,
              date: new Date(e.timestamp).toLocaleDateString('th-TH', {
                month: 'short',
                day: 'numeric'
              })
            };
          });
        }
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    }

    return {
      totalEvaluators,
      statsByCriteria,
      overallAverage: parseFloat(overallAverage.toFixed(1)),
      comments: realComments
    };
  }, [selectedGroup]);

  const getDisplayMembers = (group: ProjectGroup): string[] => {
    // Check if this is user's own group
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      if (userData.groupId === group.id) {
        // User's own group - show user first with their actual name from userData
        return [userData.name, ...group.members];
      }
    }
    // Not user's group - just show members (no group name)
    return group.members;
  };

  const isUserMember = (index: number): boolean => {
    // First member (index 0) is the user if it's their own group
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      if (userData.groupId === selectedGroup?.id && index === 0) {
        return true;
      }
    }
    return false;
  };

  const getMemberAvatar = (member: string, index: number): string => {
    // If this is the user (index 0 in own group), use their avatar
    if (isUserMember(index)) {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        return getRandomProfileImage(userData.avatar);
      }
    }
    // Check if memberProfiles exist and get avatar
    if (selectedGroup?.memberProfiles) {
      const profile = selectedGroup.memberProfiles.find(p => p.name === member);
      if (profile) {
        return getRandomProfileImage(profile.avatar);
      }
    }
    // Otherwise use member name for avatar
    return getRandomProfileImage(member);
  };

  const getStatusText = (score: number): string => {
    if (score >= 4.5) return 'ดีเยี่ยม';
    if (score >= 3.5) return 'ดี';
    if (score >= 2.5) return 'ปานกลาง';
    if (score >= 1.5) return 'พอใช้';
    return 'ควรปรับปรุงด่วน';
  };

  const getProgressBarColor = (score: number): string => {
    if (score >= 4.0) return 'bg-emerald-500';
    if (score >= 2.5) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (!selectedGroup || !groupStats) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-[#1D324B]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-[#1D324B] selection:bg-[#1D324B]/10">
      <div className="fixed inset-0 bg-[#1D324B]/[0.03] pointer-events-none" />
      <div className="relative z-10 w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push(`/?userGroupId=${userGroupId}&roomId=${roomId}`)}
            className="flex items-center gap-2 text-slate-600 hover:text-[#1D324B] transition-colors mb-6 font-black text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO LIST
          </button>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 pb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-tight rounded">Analysis Dashboard</span>
                </div>
                <h2 className="text-3xl font-black text-[#1D324B] mb-1">{selectedGroup.groupName}</h2>
                <p className="text-slate-500 font-bold">{selectedGroup.projectName}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-right p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Evaluators</p>
                  <p className="text-3xl font-black text-[#1D324B] flex items-center justify-end gap-2">
                    <Users className="w-5 h-5 text-slate-400" />
                    {groupStats.totalEvaluators}
                  </p>
                </div>
                <div className="text-right p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Overall Avg</p>
                  <p className={`text-3xl font-black flex items-center justify-end gap-2 ${groupStats.overallAverage >= 3.5 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    <Star className="w-5 h-5 fill-current" />
                    {groupStats.overallAverage}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <UserCircle className="w-4 h-4" /> Team Members
              </h3>
              <div className="flex flex-wrap gap-8">
                {getDisplayMembers(selectedGroup).map((member, i) => {
                  const isCurrentUser = isUserMember(i);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 group">
                      <div className={`w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 ring-2 ${
                        isCurrentUser ? 'border-blue-600 ring-blue-100' : 'border-slate-200 ring-slate-100'
                      }`}>
                        <img 
                          src={getMemberAvatar(member, i)} 
                          alt={member}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-black ${isCurrentUser ? 'text-blue-600' : 'text-[#1D324B]'}`}>
                          {member}
                        </p>
                        <p className={`text-[8px] font-bold uppercase ${
                          isCurrentUser ? 'text-blue-600' : 'text-slate-400'
                        }`}>
                          {isCurrentUser ? 'You' : 'Member'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Performance Metrics
              </h3>

              <div className="grid gap-8">
                {groupStats.statsByCriteria.map((item) => (
                  <div key={item.id} className="group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="p-2 bg-slate-50 rounded-xl text-slate-500 border border-slate-200">
                          {item.icon}
                        </div>
                        <span className="font-bold text-sm text-[#1D324B]">{item.label}</span>
                      </div>

                      <div className="flex-1 flex items-center gap-4 max-w-md">
                        <div className="h-4 w-full bg-slate-100 overflow-hidden relative border border-slate-200 shadow-inner">
                           <div 
                            className={`h-full transition-all duration-1000 ease-out ${getProgressBarColor(item.avgScore)}`}
                            style={{ width: `${(item.avgScore / 5) * 100}%` }}
                           />
                        </div>
                        
                        <div className="flex items-center gap-2 whitespace-nowrap min-w-[140px]">
                          <span className="font-black text-sm text-[#1D324B]">
                            {item.avgScore.toFixed(1)}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 border rounded-sm ${
                            item.avgScore < 2.5 ? 'text-red-600 bg-red-50 border-red-100' : 
                            item.avgScore >= 4.0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                            'text-slate-500 bg-slate-50 border-slate-200'
                          }`}>
                            {getStatusText(item.avgScore)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-[#1D324B] text-white rounded-3xl border border-white/10 shadow-xl space-y-4">
                 <div className="flex items-start gap-4">
                    <div className="mt-1 p-1 bg-emerald-500/20 rounded-full flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium">โดดเด่นคือ: <span className="ml-1 text-emerald-300 font-black italic">{[...groupStats.statsByCriteria].sort((a,b) => b.avgScore - a.avgScore)[0].label}</span></p>
                 </div>
                 <div className="flex items-start gap-4 pt-2 border-t border-white/5">
                    <div className="mt-1 p-1 bg-red-500/20 rounded-full flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    </div>
                    <p className="text-sm font-medium">ควรพัฒนาคือ: <span className="ml-1 text-red-300 font-black italic">{[...groupStats.statsByCriteria].sort((a,b) => a.avgScore - b.avgScore)[0].label}</span></p>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Feedback from Peers
                </h3>
                <button
                  onClick={() => router.push(`/feedback?userGroupId=${userGroupId}&roomId=${roomId}`)}
                  className="px-4 py-2 bg-[#1D324B] hover:bg-[#152238] text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-md uppercase"
                >
                  <MessageSquare className="w-4 h-4" />
                  ดูทั้งหมด ({groupStats.comments.length})
                </button>
              </div>
              
              <div className="grid gap-6">
                  {groupStats.comments.length > 0 ? (
                      groupStats.comments.slice(0, 3).map((comment, idx) => (
                          <div key={idx} className="relative p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#1D324B]/20 transition-all group">
                              <Quote className="absolute -top-3 -left-1 w-8 h-8 text-[#1D324B]/10 group-hover:text-[#1D324B]/20 transition-colors" />
                              <p className="text-[#1D324B] text-sm leading-relaxed font-medium pl-2">
                                  "{comment.text}"
                              </p>
                              <div className="mt-4 flex items-center justify-between pl-2">
                                  <div className="flex items-center gap-2">
                                      {comment.isTeacher && comment.avatar ? (
                                        <>
                                          <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-300">
                                            <img 
                                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.avatar}`} 
                                              alt={comment.from}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <span className="text-xs font-black text-[#1D324B]">{comment.from}</span>
                                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded-full uppercase">ครู</span>
                                        </>
                                      ) : (
                                        <>
                                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{comment.from}</span>
                                        </>
                                      )}
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-medium">{comment.date}</span>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-400 font-bold italic">ยังไม่มีความคิดเห็นในขณะนี้</p>
                      </div>
                  )}
                  {groupStats.comments.length > 3 && (
                      <button
                          onClick={() => router.push(`/feedback?userGroupId=${userGroupId}&roomId=${roomId}`)}
                          className="w-full py-3 text-center text-[#1D324B] font-bold hover:bg-slate-50 rounded-xl transition-colors text-sm"
                      >
                          ดูความคิดเห็นทั้งหมด ({groupStats.comments.length})
                      </button>
                  )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
