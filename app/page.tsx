'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  Award,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  LayoutTemplate,
  Cpu,
  Lock,
  UserCircle,
  PieChart,
  Clock,
  User,
  Star,
  TrendingUp,
  AlertCircle,
  LogOut,
  Quote,
  ChevronRightCircle,
  CircleChevronRight,
  Crown
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
}

interface ScoreLabel {
  text: string;
  color: string;
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
  comments: string[];
}

const EVALUATION_CRITERIA: Criteria[] = [
  { id: 'design', label: 'ความสวยงามและการออกแบบ', icon: <LayoutTemplate className="w-5 h-5" /> },
  { id: 'usability', label: 'ความง่ายในการใช้งาน', icon: <CheckCircle2 className="w-5 h-5" /> },
  { id: 'functionality', label: 'ความสมบูรณ์ของฟีเจอร์', icon: <Cpu className="w-5 h-5" /> },
  { id: 'innovation', label: 'ความคิดสร้างสรรค์และนวัตกรรม', icon: <Star className="w-5 h-5" /> },
  { id: 'presentation', label: 'การนำเสนอและสื่อสาร', icon: <MessageSquare className="w-5 h-5" /> },
  { id: 'teamwork', label: 'การทำงานเป็นทีม', icon: <Users className="w-5 h-5" /> },
];

const SCORE_LABELS: Record<number, ScoreLabel> = {
  1: { text: 'ปรับปรุง', color: 'text-red-700 border-red-200 bg-red-50' },
  2: { text: 'พอใช้', color: 'text-orange-700 border-orange-200 bg-orange-50' },
  3: { text: 'ปานกลาง', color: 'text-amber-700 border-amber-200 bg-amber-50' },
  4: { text: 'ดี', color: 'text-emerald-700 border-emerald-200 bg-emerald-50' },
  5: { text: 'ดีมาก', color: 'text-blue-700 border-blue-200 bg-blue-50' },
};

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
  const [projectGroups] = useState<ProjectGroup[]>(PROJECT_GROUPS);
  const [userGroupId, setUserGroupId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedGroups, setSubmittedGroups] = useState<string[]>([]);

  const currentUserGroup = projectGroups.find(g => g.id === userGroupId);
  const totalGroups = projectGroups.length;
  const evaluatableGroupsCount = projectGroups.filter(g => g.id !== userGroupId).length;
  const completedCount = submittedGroups.length;
  const pendingCount = evaluatableGroupsCount - completedCount;

  const groupStats = useMemo((): GroupStats | null => {
    if (!userGroupId) return null;
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
    
    const mockComments = [
      "งานออกแบบ UI สวยงามมากครับ ใช้งานง่ายและดูเป็นมืออาชีพ",
      "ฟีเจอร์ AI ตอบโจทย์ได้ดี แต่อยากให้เพิ่มการแจ้งเตือนผ่านมือถือด้วยจะดีมาก",
      "การนำเสนอทำได้ชัดเจน เข้าใจง่ายมากครับ เป็นโปรเจกต์ที่น่าสนใจ",
      "ชอบความคิดสร้างสรรค์ในการแก้ปัญหาเรื่องความปลอดภัยครับ",
      "อยากให้พัฒนาส่วนของ Dashboard ให้รองรับ Dark Mode ในอนาคตครับ"
    ];

    return {
      totalEvaluators,
      statsByCriteria,
      overallAverage: parseFloat(overallAverage.toFixed(1)),
      comments: mockComments
    };
  }, [userGroupId]);

  const sortedGroups = [...projectGroups].sort((a, b) => {
    if (a.id === userGroupId) return -1;
    if (b.id === userGroupId) return 1;
    return 0;
  });

  const getDisplayMembers = (group: ProjectGroup): string[] => {
    if (group.id === userGroupId && currentUserGroup) {
      return [currentUserGroup.groupName, ...group.members];
    }
    return group.members;
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

  const handleSelectGroup = (group: ProjectGroup): void => {
    if (group.id !== userGroupId && submittedGroups.includes(group.id)) return;
    setSelectedGroup(group);
    setScores({});
    setComment('');
    setIsSubmitted(false);
  };

  const handleSetScore = (criteriaId: string, value: number): void => {
    setScores(prev => ({ ...prev, [criteriaId]: value }));
  };

  const handleSubmit = (): void => {
    if (!selectedGroup) return;
    if (Object.keys(scores).length < EVALUATION_CRITERIA.length) return;
    setSubmittedGroups(prev => [...prev, selectedGroup.id]);
    setIsSubmitted(true);
  };

  if (!userGroupId) {
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
                onClick={() => setUserGroupId(group.id)}
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

  if (selectedGroup && selectedGroup.id === userGroupId && groupStats) {
    return (
      <div className="min-h-screen bg-slate-100 text-[#1D324B] selection:bg-[#1D324B]/10">
        <div className="fixed inset-0 bg-[#1D324B]/[0.03] pointer-events-none" />
        <div className="relative z-10 w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={() => setSelectedGroup(null)}
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
                  {getDisplayMembers(selectedGroup).map((member, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group">
                      <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-slate-200 ring-2 ring-slate-100">
                        <img 
                          src={getRandomProfileImage(member)} 
                          alt={member}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-black text-[#1D324B]">{member}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">{i === 0 ? 'You' : 'Member'}</p>
                      </div>
                    </div>
                  ))}
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
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <MessageSquare className="w-4 h-4" /> Feedback from Peers (ความคิดเห็นจากเพื่อน)
                </h3>
                
                <div className="grid gap-6">
                    {groupStats.comments.length > 0 ? (
                        groupStats.comments.map((text, idx) => (
                            <div key={idx} className="relative p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#1D324B]/20 transition-all group">
                                <Quote className="absolute -top-3 -left-1 w-8 h-8 text-[#1D324B]/10 group-hover:text-[#1D324B]/20 transition-colors" />
                                <p className="text-[#1D324B] text-sm leading-relaxed font-medium pl-2">
                                    "{text}"
                                </p>
                                <div className="mt-4 flex items-center gap-2 pl-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Verified Peer Feedback</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold italic">ยังไม่มีความคิดเห็นในขณะนี้</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedGroup && selectedGroup.id !== userGroupId) {
    return (
      <div className="min-h-screen bg-[#1D324B] text-white selection:bg-white/10">
        <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
          <button 
            onClick={() => setSelectedGroup(null)}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-8 font-black text-xs uppercase tracking-[0.3em] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            BACK TO LIST
          </button>
          
          <div className="bg-white text-[#1D324B] border border-white/10 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="bg-slate-50 p-6 sm:p-12 border-b border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="flex-1">
                  <span className="px-3 py-1 bg-[#1D324B] text-white text-[10px] font-black uppercase rounded mb-4 inline-block tracking-widest">Evaluation Mode</span>
                  <h2 className="text-4xl font-black text-[#1D324B] tracking-tight">{selectedGroup.groupName}</h2>
                  <p className="text-slate-500 font-bold mt-2 text-lg">{selectedGroup.projectName}</p>
                </div>

                <div className="flex flex-col lg:items-end gap-3">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <UserCircle className="w-4 h-4" /> Group Members
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {selectedGroup.members.map((member, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-slate-200 ring-2 ring-slate-100">
                            <img 
                              src={getRandomProfileImage(member)} 
                              alt={member}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <p className="text-[9px] font-bold text-slate-500 text-center max-w-[64px]">{member}</p>
                        </div>
                        ))}
                    </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-12">
              {isSubmitted ? (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-[#1D324B] mb-4 uppercase tracking-tight">Evaluation Submitted</h3>
                  <p className="text-slate-500 mb-8 font-medium">Thank you for your valuable feedback.</p>
                  <button onClick={() => setSelectedGroup(null)} className="px-12 py-4 bg-[#1D324B] text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-transform uppercase tracking-widest text-xs">Return to List</button>
                </div>
              ) : (
                <div className="space-y-12">
                  {EVALUATION_CRITERIA.map((criteria) => (
                    <div key={criteria.id} className="pb-12 border-b border-slate-200 last:border-0">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-slate-50 rounded-2xl text-[#1D324B] border border-slate-200 transition-colors">
                          {criteria.icon}
                        </div>
                        <h4 className="font-black text-lg text-[#1D324B] uppercase tracking-tight">{criteria.label}</h4>
                      </div>
                      <div className="grid grid-cols-5 gap-3 sm:gap-6">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button 
                            key={num} 
                            onClick={() => handleSetScore(criteria.id, num)} 
                            className={`flex flex-col items-center gap-3 transition-all ${scores[criteria.id] === num ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                          >
                            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center text-2xl font-black transition-all ${
                              scores[criteria.id] === num 
                              ? 'bg-[#1D324B] border-[#1D324B] text-white shadow-2xl scale-110' 
                              : 'bg-white border-slate-400 text-slate-500 hover:border-slate-600 hover:text-slate-700'
                            }`}>
                              {num}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${scores[criteria.id] === num ? 'text-[#1D324B]' : 'text-slate-600'}`}>
                              {SCORE_LABELS[num].text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-8">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.3em]"><MessageSquare className="w-4 h-4" /> Additional Feedback</label>
                    <textarea 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)} 
                      placeholder="Provide constructive feedback for the team..." 
                      className="w-full h-40 bg-slate-50 border border-slate-200 rounded-[2rem] p-6 focus:border-[#1D324B] focus:bg-white outline-none font-bold text-[#1D324B] transition-all resize-none shadow-inner" 
                    />
                  </div>

                  <button 
                    onClick={handleSubmit} 
                    className="w-full py-6 bg-[#1D324B] hover:bg-slate-800 text-white font-black rounded-3xl shadow-[0_20px_40px_-12px_rgba(19,19,51,0.4)] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.25em] text-sm"
                  >
                    <ShieldCheck className="w-6 h-6" /> Submit Evaluation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
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
                      onClick={() => { setUserGroupId(null); setSubmittedGroups([]); setSelectedGroup(null); }}
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