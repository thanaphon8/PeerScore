'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft,
  MessageSquare,
  Quote,
  Star
} from 'lucide-react';

interface Evaluation {
  groupId: string;
  evaluatorGroupId: string;
  evaluatorType?: 'teacher' | 'student';
  evaluatorName?: string;
  evaluatorAvatar?: string;
  scores: Record<string, number>;
  comment: string;
  timestamp: string;
}

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

export default function FeedbackPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(null);
  const [userGroupId, setUserGroupId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Evaluation[]>([]);
  const [allGroups, setAllGroups] = useState<ProjectGroup[]>(PROJECT_GROUPS);

  useEffect(() => {
    const userGrpId = searchParams.get('userGroupId');
    const rmId = searchParams.get('roomId');
    
    // Load all groups including custom ones
    let loadedGroups = [...PROJECT_GROUPS];
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const storedGroups = localStorage.getItem('projectGroups');
        if (storedGroups) {
          const customGroups = JSON.parse(storedGroups);
          loadedGroups = [...PROJECT_GROUPS, ...customGroups];
          setAllGroups(loadedGroups);
        }
      } catch (error) {
        console.error('Error loading groups:', error);
      }
    }
    
    if (userGrpId) {
      const group = loadedGroups.find(g => g.id === userGrpId);
      if (group) {
        setSelectedGroup(group);
        setUserGroupId(userGrpId);
      }
    }
    if (rmId) {
      setRoomId(rmId);
    }

    // Load evaluations for this group
    if (userGrpId && typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const evaluationsStr = localStorage.getItem('evaluations');
        if (evaluationsStr) {
          const allEvaluations: Evaluation[] = JSON.parse(evaluationsStr);
          // Filter evaluations for this group that have comments
          const groupFeedbacks = allEvaluations.filter(e => e.groupId === userGrpId && e.comment && e.comment.trim());
          setFeedbacks(groupFeedbacks);
        }
      } catch (error) {
        console.error('Error loading evaluations:', error);
      }
    }
  }, [searchParams]);

  const getAverageScore = (scores: Record<string, number>): number => {
    const values = Object.values(scores);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return parseFloat((sum / values.length).toFixed(1));
  };

  if (!selectedGroup) {
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
    <div className="min-h-screen bg-slate-100">
      <div className="fixed inset-0 bg-[#1D324B]/[0.03] pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <button 
          onClick={() => router.push(`/analyze?userGroupId=${userGroupId}&roomId=${roomId}`)}
          className="flex items-center gap-2 text-slate-600 hover:text-[#1D324B] mb-8 font-black text-xs uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          กลับไปหน้าวิเคราะห์
        </button>

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#1D324B] rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#1D324B] mb-1">Feedback & Comments</h1>
              <p className="text-slate-600 font-medium">ความคิดเห็นจากผู้ประเมิน (ไม่เปิดเผยตัวตน)</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">กลุ่มที่ถูกประเมิน</p>
                <p className="text-xl font-black text-[#1D324B]">{selectedGroup.groupName}</p>
                <p className="text-sm text-slate-600 font-medium">{selectedGroup.projectName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">ความคิดเห็น</p>
                <p className="text-3xl font-black text-[#1D324B]">{feedbacks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedbacks List */}
        {feedbacks.length > 0 ? (
          <div className="space-y-4">
            {feedbacks.map((feedback, index) => {
              const avgScore = getAverageScore(feedback.scores);
              
              return (
                <div key={index} className="bg-white border-2 border-slate-200 rounded-2xl shadow-md p-6 hover:border-[#1D324B]/30 transition-all">
                  {/* Header with Score and Date */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1.5 rounded-lg border-2 flex items-center gap-2 ${
                        avgScore >= 4 ? 'bg-emerald-50 border-emerald-200' :
                        avgScore >= 3 ? 'bg-amber-50 border-amber-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <Star className={`w-4 h-4 ${
                          avgScore >= 4 ? 'text-emerald-600 fill-emerald-600' :
                          avgScore >= 3 ? 'text-amber-600 fill-amber-600' :
                          'text-red-600 fill-red-600'
                        }`} />
                        <span className={`text-base font-black ${
                          avgScore >= 4 ? 'text-emerald-600' :
                          avgScore >= 3 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {avgScore}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-bold">คะแนนเฉลี่ย</span>
                    </div>
                    
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(feedback.timestamp).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Comment */}
                  <div className="relative p-5 bg-slate-50 border-2 border-slate-200 rounded-xl">
                    <Quote className="absolute top-3 left-3 w-6 h-6 text-slate-300" />
                    <p className="text-[#1D324B] font-medium pl-8 leading-relaxed">
                      {feedback.comment}
                    </p>
                  </div>

                  {/* Evaluator Info - Show teacher name/avatar or anonymous */}
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    {feedback.evaluatorType === 'teacher' && feedback.evaluatorName ? (
                      <>
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-300">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${feedback.evaluatorAvatar || 'default'}`}
                            alt={feedback.evaluatorName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-black text-[#1D324B]">{feedback.evaluatorName}</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded-full uppercase">ครู</span>
                      </>
                    ) : (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        <span className="font-bold uppercase tracking-wider text-slate-400">ไม่เปิดเผยตัวตน</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-md p-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-xl font-black text-slate-600 mb-2">ยังไม่มีความคิดเห็น</p>
            <p className="text-slate-500 font-medium">รอผู้ประเมินให้ความคิดเห็นเกี่ยวกับกลุ่มของคุณ</p>
          </div>
        )}
      </div>
    </div>
  );
}