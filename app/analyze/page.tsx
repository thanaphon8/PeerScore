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

export default function AnalyzePage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(null);
  const [userGroupId, setUserGroupId] = useState<string | null>(null);

  useEffect(() => {
    const userGrpId = searchParams.get('userGroupId');
    if (userGrpId) {
      const group = PROJECT_GROUPS.find(g => g.id === userGrpId);
      if (group) {
        setSelectedGroup(group);
        setUserGroupId(userGrpId);
      }
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
  }, [selectedGroup]);

  const getDisplayMembers = (group: ProjectGroup): string[] => {
    return [group.groupName, ...group.members];
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
            onClick={() => router.push(`/?userGroupId=${userGroupId}`)}
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