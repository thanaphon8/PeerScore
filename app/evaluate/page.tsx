'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  MessageSquare,
  ShieldCheck,
  LayoutTemplate,
  Cpu,
  Star,
  UserCircle
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

interface ScoreLabel {
  text: string;
  color: string;
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

const getRandomProfileImage = (seed: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffffff`;
};

const getAvatarUrl = (avatar: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatar)}&backgroundColor=ffffff`;
};

function EvaluatePageContent(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(null);
  const [userGroupId, setUserGroupId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const groupId = searchParams.get('groupId');
    const userGrpId = searchParams.get('userGroupId');
    const rmId = searchParams.get('roomId');
    
    if (groupId) {
      // Load all groups including custom ones from localStorage
      let allGroups = [...PROJECT_GROUPS];
      
      // Check if we're on client side before accessing localStorage
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
          const storedGroups = localStorage.getItem('projectGroups');
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
        } catch (error) {
          console.error('Error loading custom groups:', error);
        }
      }
      
      // Find group in all groups (default + custom)
      const group = allGroups.find(g => g.id === groupId);
      if (group) {
        setSelectedGroup(group);
      }
    }
    if (userGrpId) {
      setUserGroupId(userGrpId);
    }
    if (rmId) {
      setRoomId(rmId);
    }
  }, [searchParams]);

  const handleSetScore = (criteriaId: string, value: number): void => {
    setScores(prev => ({ ...prev, [criteriaId]: value }));
  };

  const handleSubmit = (): void => {
    if (!selectedGroup) return;
    if (Object.keys(scores).length < EVALUATION_CRITERIA.length) return;
    
    // Get user data to check if teacher
    const userData = localStorage.getItem('userData');
    const userInfo = userData ? JSON.parse(userData) : null;
    const isTeacher = userInfo?.userType === 'teacher';
    
    // Save evaluation data
    const evaluationData = {
      groupId: selectedGroup.id,
      evaluatorGroupId: userGroupId,
      evaluatorType: isTeacher ? 'teacher' : 'student',
      evaluatorName: isTeacher ? userInfo.name : undefined,
      evaluatorAvatar: isTeacher ? userInfo.avatar : undefined,
      scores,
      comment,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const existingEvaluations = localStorage.getItem('evaluations') || '[]';
    const evaluations = JSON.parse(existingEvaluations);
    evaluations.push(evaluationData);
    localStorage.setItem('evaluations', JSON.stringify(evaluations));
    
    // Update submitted groups for this user (only for students)
    if (userGroupId && !isTeacher) {
      const submittedKey = `submissions_${userGroupId}`;
      const existingSubmissions = localStorage.getItem(submittedKey) || '[]';
      const submissions = JSON.parse(existingSubmissions);
      if (!submissions.includes(selectedGroup.id)) {
        submissions.push(selectedGroup.id);
        localStorage.setItem(submittedKey, JSON.stringify(submissions));
      }
    }
    
    setIsSubmitted(true);
  };

  if (!selectedGroup) {
    return (
      <div className="min-h-screen bg-[#1D324B] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D324B] text-white selection:bg-white/10">
      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <button 
          onClick={() => router.push(`/?userGroupId=${userGroupId}&roomId=${roomId}`)}
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
                      {(selectedGroup.memberProfiles && selectedGroup.memberProfiles.length > 0
                        ? selectedGroup.memberProfiles
                        : selectedGroup.members.map(m => ({ name: m, avatar: m }))
                      ).map((member, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-slate-200 ring-2 ring-slate-100">
                          <img 
                            src={getAvatarUrl(member.avatar)} 
                            alt={member.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 text-center max-w-[64px]">
                          {member.name}
                        </p>
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
                <button onClick={() => router.push(`/?userGroupId=${userGroupId}&roomId=${searchParams.get('roomId')}`)} className="px-12 py-4 bg-[#1D324B] text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-transform uppercase tracking-widest text-xs">Return to List</button>
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

export default function EvaluatePage(): React.ReactElement {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-[#1D324B] font-black">Loading...</p>
      </div>
    }>
      <EvaluatePageContent />
    </Suspense>
  );
}