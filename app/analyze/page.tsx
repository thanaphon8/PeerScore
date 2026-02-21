'use client';

import React, { Suspense, useState, useMemo, useEffect } from 'react';
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
  { id: 'design', label: 'ความสวยงามและการออกแบบ', icon: <LayoutTemplate className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'usability', label: 'ความง่ายในการใช้งาน', icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'functionality', label: 'ความสมบูรณ์ของฟีเจอร์', icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'innovation', label: 'ความคิดสร้างสรรค์และนวัตกรรม', icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'presentation', label: 'การนำเสนอและสื่อสาร', icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'teamwork', label: 'การทำงานเป็นทีม', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
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

function AnalyzePageContent(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(null);
  const [userGroupId, setUserGroupId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const userGrpId = searchParams.get('userGroupId');
    const rmId = searchParams.get('roomId');
    
    if (userGrpId) {
      const storedGroups = localStorage.getItem('projectGroups');
      let allGroups = [...PROJECT_GROUPS];
      if (storedGroups) {
        const customGroups = JSON.parse(storedGroups);
        allGroups = [...PROJECT_GROUPS, ...customGroups];
      }
      
      if (rmId) {
        const roomMembersKey = `roomMembers_${rmId}`;
        const storedRoomMembers = localStorage.getItem(roomMembersKey);
        if (storedRoomMembers) {
          const roomMembers = JSON.parse(storedRoomMembers);
          
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
    
    let realComments: Array<{text: string, from: string, date: string}> = [];
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const evaluationsStr = localStorage.getItem('evaluations');
        if (evaluationsStr) {
          const allEvaluations = JSON.parse(evaluationsStr);
          const groupEvaluations = allEvaluations.filter(
            (e: any) => e.groupId === selectedGroup.id && e.comment && e.comment.trim()
          );
          
          const storedGroups = localStorage.getItem('projectGroups');
          let allGroups = [...PROJECT_GROUPS];
          if (storedGroups) {
            const customGroups = JSON.parse(storedGroups);
            allGroups = [...PROJECT_GROUPS, ...customGroups];
          }
          
          realComments = groupEvaluations.map((e: any) => {
            const isTeacher = e.evaluatorType === 'teacher';
            let displayName = 'Unknown';
            let avatar = 'default';
            
            if (isTeacher) {
              displayName = e.evaluatorName || 'ครู';
              avatar = e.evaluatorAvatar || 'default';
            } else {
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

  const getDisplayMembers = (group: ProjectGroup): Array<{name: string; avatar: string; isCurrentUser?: boolean}> => {
    if (group.memberProfiles && group.memberProfiles.length > 0) {
      const storedUserData = localStorage.getItem('userData');
      const currentUserName = storedUserData ? JSON.parse(storedUserData).name : null;
      return group.memberProfiles.map(m => ({
        ...m,
        isCurrentUser: m.name === currentUserName
      }));
    }
    return group.members.map(m => ({ name: m, avatar: m, isCurrentUser: false }));
  };

  const getMemberAvatar = (member: string, index: number): string => {
    if (selectedGroup?.memberProfiles) {
      const profile = selectedGroup.memberProfiles.find(p => p.name === member);
      if (profile) return getRandomProfileImage(profile.avatar);
    }
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
      <div className="relative z-10 w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push(`/?userGroupId=${userGroupId}&roomId=${roomId}`)}
            className="flex items-center gap-2 text-slate-600 hover:text-[#1D324B] transition-colors mb-4 sm:mb-6 font-black text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            BACK TO LIST
          </button>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 lg:p-10 shadow-2xl overflow-hidden mb-4 sm:mb-6 lg:mb-8">
            <div className="flex flex-col gap-4 mb-6 sm:mb-8 border-b border-slate-200 pb-6 sm:pb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[9px] sm:text-[10px] font-black uppercase tracking-tight rounded">Analysis Dashboard</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1D324B] mb-1">{selectedGroup.groupName}</h2>
                <p className="text-sm sm:text-base text-slate-500 font-bold">{selectedGroup.projectName}</p>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="flex-1 min-w-[140px] p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-[9px] sm:text-[10px] uppercase font-black text-slate-400 mb-1">Evaluators</p>
                  <p className="text-2xl sm:text-3xl font-black text-[#1D324B] flex items-center gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    {groupStats.totalEvaluators}
                  </p>
                </div>
                <div className="flex-1 min-w-[140px] p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-[9px] sm:text-[10px] uppercase font-black text-slate-400 mb-1">Overall Avg</p>
                  <p className={`text-2xl sm:text-3xl font-black flex items-center gap-2 ${groupStats.overallAverage >= 3.5 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    {groupStats.overallAverage}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 sm:mb-10 lg:mb-12">
              <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2">
                <UserCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Team Members
              </h3>
              <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8">
                {getDisplayMembers(selectedGroup).map((member, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden shadow-lg border-2 ring-2 ${
                      member.isCurrentUser ? 'border-blue-600 ring-blue-100' : 'border-slate-200 ring-slate-100'
                    }`}>
                      <img 
                        src={getRandomProfileImage(member.avatar)} 
                        alt={member.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] sm:text-xs font-black ${member.isCurrentUser ? 'text-blue-600' : 'text-[#1D324B]'}`}>
                        {member.name}
                      </p>
                      <p className={`text-[8px] sm:text-[8px] font-bold uppercase ${member.isCurrentUser ? 'text-blue-600' : 'text-slate-400'}`}>
                        {member.isCurrentUser ? 'You' : 'Member'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
              <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" /> Performance Metrics
              </h3>

              <div className="grid gap-4 sm:gap-6 lg:gap-8">
                {groupStats.statsByCriteria.map((item) => (
                  <div key={item.id} className="group">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-slate-50 rounded-xl text-slate-500 border border-slate-200 flex-shrink-0">
                          {item.icon}
                        </div>
                        <span className="font-bold text-xs sm:text-sm text-[#1D324B]">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="h-3 sm:h-4 flex-1 bg-slate-100 overflow-hidden relative border border-slate-200 shadow-inner rounded-full">
                           <div 
                            className={`h-full transition-all duration-1000 ease-out ${getProgressBarColor(item.avgScore)}`}
                            style={{ width: `${(item.avgScore / 5) * 100}%` }}
                           />
                        </div>
                        
                        <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                          <span className="font-black text-xs sm:text-sm text-[#1D324B]">
                            {item.avgScore.toFixed(1)}
                          </span>
                          <span className={`text-[8px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 border rounded-sm ${
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

              <div className="mt-8 sm:mt-10 lg:mt-12 p-4 sm:p-6 lg:p-8 bg-[#1D324B] text-white rounded-3xl border border-white/10 shadow-xl space-y-3 sm:space-y-4">
                 <div className="flex items-start gap-3 sm:gap-4">
                    <div className="mt-1 p-1 bg-emerald-500/20 rounded-full flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium">โดดเด่นคือ: <span className="ml-1 text-emerald-300 font-black italic">{[...groupStats.statsByCriteria].sort((a,b) => b.avgScore - a.avgScore)[0].label}</span></p>
                 </div>
                 <div className="flex items-start gap-3 sm:gap-4 pt-2 border-t border-white/5">
                    <div className="mt-1 p-1 bg-red-500/20 rounded-full flex-shrink-0">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium">ควรพัฒนาคือ: <span className="ml-1 text-red-300 font-black italic">{[...groupStats.statsByCriteria].sort((a,b) => a.avgScore - b.avgScore)[0].label}</span></p>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 lg:p-10 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 border-b border-slate-100 pb-4">
                <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" /> Feedback from Peers
                </h3>
                <button
                  onClick={() => router.push(`/feedback?userGroupId=${userGroupId}&roomId=${roomId}`)}
                  className="px-3 sm:px-4 py-2 bg-[#1D324B] hover:bg-[#152238] text-white rounded-xl font-bold text-[10px] sm:text-xs transition-all flex items-center gap-1.5 sm:gap-2 shadow-md uppercase"
                >
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                  ดูทั้งหมด ({groupStats.comments.length})
                </button>
              </div>
              
              <div className="grid gap-4 sm:gap-6">
                  {groupStats.comments.length > 0 ? (
                      groupStats.comments.slice(0, 3).map((comment, idx) => (
                          <div key={idx} className="relative p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#1D324B]/20 transition-all group">
                              <Quote className="absolute -top-2 sm:-top-3 -left-1 w-6 h-6 sm:w-8 sm:h-8 text-[#1D324B]/10 group-hover:text-[#1D324B]/20 transition-colors" />
                              <p className="text-[#1D324B] text-xs sm:text-sm leading-relaxed font-medium pl-2">
                                  "{comment.text}"
                              </p>
                              <div className="mt-3 sm:mt-4 flex items-center justify-between pl-2">
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                      {comment.isTeacher && comment.avatar ? (
                                        <>
                                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-slate-300 flex-shrink-0">
                                            <img 
                                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.avatar}`} 
                                              alt={comment.from}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <span className="text-[10px] sm:text-xs font-black text-[#1D324B]">{comment.from}</span>
                                          <span className="px-1.5 sm:px-2 py-0.5 bg-amber-100 text-amber-700 text-[8px] sm:text-[9px] font-black rounded-full uppercase">ครู</span>
                                        </>
                                      ) : (
                                        <>
                                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-300"></div>
                                          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-tighter">{comment.from}</span>
                                        </>
                                      )}
                                  </div>
                                  <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium">{comment.date}</span>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="py-8 sm:py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                          <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                          <p className="text-sm sm:text-base text-slate-400 font-bold italic">ยังไม่มีความคิดเห็นในขณะนี้</p>
                      </div>
                  )}
                  {groupStats.comments.length > 3 && (
                      <button
                          onClick={() => router.push(`/feedback?userGroupId=${userGroupId}&roomId=${roomId}`)}
                          className="w-full py-2.5 sm:py-3 text-center text-[#1D324B] font-bold hover:bg-slate-50 rounded-xl transition-colors text-xs sm:text-sm"
                      >
                          ดูความคิดเห็นทั้งหมด ({groupStats.comments.length})
                      </button>
                  )}
              </div>
          </div>

          <TeacherFeedbackSection 
            groupId={selectedGroup.id}
            roomId={roomId}
            onFeedbackSubmitted={() => window.location.reload()}
          />
        </div>
      </div>
    </div>
  );
}

function TeacherFeedbackSection({ 
  groupId, 
  roomId, 
  onFeedbackSubmitted 
}: { 
  groupId: string; 
  roomId: string | null; 
  onFeedbackSubmitted: () => void;
}) {
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const storedUserData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
  const isTeacher = userData?.userType === 'teacher';

  if (!isTeacher) return null;

  const handleSubmit = () => {
    if (!feedback.trim() || !roomId) return;

    setIsSubmitting(true);

    const evaluationData = {
      groupId: groupId,
      evaluatorGroupId: 'teacher',
      evaluatorType: 'teacher',
      evaluatorName: userData.name,
      evaluatorAvatar: userData.avatar,
      scores: {},
      comment: feedback,
      timestamp: new Date().toISOString()
    };

    const existingEvaluations = localStorage.getItem('evaluations') || '[]';
    const evaluations = JSON.parse(existingEvaluations);
    evaluations.push(evaluationData);
    localStorage.setItem('evaluations', JSON.stringify(evaluations));

    setFeedback('');
    setIsSubmitting(false);
    onFeedbackSubmitted();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 lg:p-10 shadow-2xl mt-4 sm:mt-6">
      <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6 border-b border-slate-100 pb-4">
        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
        <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">
          Teacher Feedback
        </h3>
        <span className="px-1.5 sm:px-2 py-0.5 bg-amber-100 text-amber-700 text-[8px] sm:text-[9px] font-black rounded-full uppercase">
          ครู
        </span>
      </div>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="เขียนความคิดเห็นและข้อเสนอแนะให้กับกลุ่มนี้..."
        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-slate-200 rounded-xl focus:border-[#1D324B] outline-none resize-none min-h-[100px] sm:min-h-[120px] font-medium text-[#1D324B] text-sm sm:text-base"
      />

      <button
        onClick={handleSubmit}
        disabled={!feedback.trim() || isSubmitting}
        className="mt-3 sm:mt-4 w-full py-2.5 sm:py-3 bg-[#1D324B] hover:bg-[#152238] disabled:bg-slate-300 text-white font-black rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 uppercase disabled:cursor-not-allowed text-xs sm:text-base"
      >
        {isSubmitting ? 'กำลังส่ง...' : 'ส่ง Feedback'}
        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}

export default function AnalyzePage(): React.ReactElement {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-[#1D324B] font-black">Loading...</p>
      </div>
    }>
      <AnalyzePageContent />
    </Suspense>
  );
}