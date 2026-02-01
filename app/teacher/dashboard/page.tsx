'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Users,
  BarChart3,
  Download,
  Plus,
  Trash2,
  Eye,
  FileJson,
  GraduationCap,
  CheckCircle2,
  Clock,
  TrendingUp,
  Settings,
  LogOut,
  Search,
  Filter,
  Edit
} from 'lucide-react';

interface UserData {
  name: string;
  avatar: string;
  groupId: string;
  userType: 'student' | 'teacher';
  username?: string;
}

interface ProjectGroup {
  id: string;
  groupName: string;
  projectName: string;
  members: string[];
}

interface Student {
  name: string;
  groupId: string;
  groupName: string;
  avatar: string;
  evaluationsCompleted: number;
  lastActive: string;
}

interface Evaluation {
  groupId: string;
  evaluatorGroupId: string;
  scores: Record<string, number>;
  comment: string;
  timestamp: string;
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

export default function TeacherDashboard(): React.ReactElement {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'groups' | 'evaluations'>('overview');
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>(PROJECT_GROUPS);
  const [students, setStudents] = useState<Student[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddGroup, setShowAddGroup] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newMembers, setNewMembers] = useState<string>('');

  useEffect(() => {
    // Check authentication
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      router.push('/login');
      return;
    }

    const parsedUserData: UserData = JSON.parse(storedUserData);
    if (parsedUserData.userType !== 'teacher') {
      router.push('/');
      return;
    }

    setUserData(parsedUserData);

    // Load evaluations
    const storedEvaluations = localStorage.getItem('evaluations');
    if (storedEvaluations) {
      setEvaluations(JSON.parse(storedEvaluations));
    }

    // Mock student data (in real app, this would come from a database)
    const mockStudents: Student[] = [
      { name: 'สมชาย สายเทพ', groupId: 'g1', groupName: 'Cyber Knights', avatar: 'Felix', evaluationsCompleted: 5, lastActive: '2 ชั่วโมงที่แล้ว' },
      { name: 'นพดล คนดี', groupId: 'g2', groupName: 'Quantum Coders', avatar: 'Luna', evaluationsCompleted: 4, lastActive: '5 ชั่วโมงที่แล้ว' },
      { name: 'จิรายุ บินหลา', groupId: 'g3', groupName: 'Data Wizards', avatar: 'Oliver', evaluationsCompleted: 3, lastActive: '1 วันที่แล้ว' },
    ];
    setStudents(mockStudents);
  }, [router]);

  const handleLogout = (): void => {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.removeItem('userData');
      router.push('/login');
    }
  };

  const handleAddGroup = (): void => {
    if (!newGroupName.trim() || !newProjectName.trim()) return;

    const newGroup: ProjectGroup = {
      id: `g${Date.now()}`,
      groupName: newGroupName,
      projectName: newProjectName,
      members: newMembers.split(',').map(m => m.trim()).filter(m => m)
    };

    setProjectGroups([...projectGroups, newGroup]);
    setNewGroupName('');
    setNewProjectName('');
    setNewMembers('');
    setShowAddGroup(false);

    // Save to localStorage (in real app, this would go to a database)
    localStorage.setItem('projectGroups', JSON.stringify([...projectGroups, newGroup]));
  };

  const handleDeleteGroup = (groupId: string): void => {
    if (confirm('คุณต้องการลบกลุ่มนี้ใช่หรือไม่?')) {
      const updatedGroups = projectGroups.filter(g => g.id !== groupId);
      setProjectGroups(updatedGroups);
      localStorage.setItem('projectGroups', JSON.stringify(updatedGroups));
    }
  };

  const handleViewGroupAnalysis = (groupId: string): void => {
    router.push(`/teacher/analysis?groupId=${groupId}`);
  };

  const handleExportData = (): void => {
    const exportData = {
      groups: projectGroups,
      evaluations: evaluations,
      students: students,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `evaluation-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1D324B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1D324B] font-bold">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  const totalStudents = students.length;
  const totalGroups = projectGroups.length;
  const totalEvaluations = evaluations.length;
  const avgEvaluationsPerStudent = totalStudents > 0 ? (totalEvaluations / totalStudents).toFixed(1) : 0;

  const filteredGroups = projectGroups.filter(group => 
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 text-[#1D324B]">
      <div className="absolute inset-0 bg-[#1D324B]/[0.02] pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#1D324B] tracking-tight">ระบบจัดการครู</h1>
                <p className="text-sm text-slate-600 font-medium">ยินดีต้อนรับ, {userData.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/profile')}
                className="px-4 py-2 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-bold text-sm text-slate-700 transition-all flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                ตั้งค่า
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-black text-[#1D324B] mb-1">{totalStudents}</p>
            <p className="text-xs font-bold text-slate-600 uppercase">นักเรียนทั้งหมด</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#1D324B] mb-1">{totalGroups}</p>
            <p className="text-xs font-bold text-slate-600 uppercase">กลุ่มทั้งหมด</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#1D324B] mb-1">{totalEvaluations}</p>
            <p className="text-xs font-bold text-slate-600 uppercase">การประเมินทั้งหมด</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#1D324B] mb-1">{avgEvaluationsPerStudent}</p>
            <p className="text-xs font-bold text-slate-600 uppercase">ค่าเฉลี่ย/คน</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-6">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-black text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-slate-600 hover:text-[#1D324B]'
              }`}
            >
              ภาพรวม
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-6 py-4 font-black text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'students'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-slate-600 hover:text-[#1D324B]'
              }`}
            >
              นักเรียน
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-6 py-4 font-black text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'groups'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-slate-600 hover:text-[#1D324B]'
              }`}
            >
              จัดการกลุ่ม
            </button>
            <button
              onClick={() => setActiveTab('evaluations')}
              className={`px-6 py-4 font-black text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'evaluations'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-slate-600 hover:text-[#1D324B]'
              }`}
            >
              ข้อมูลการประเมิน
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black text-[#1D324B]">ภาพรวมระบบ</h2>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export ข้อมูล JSON
                  </button>
                </div>

                <div className="grid gap-4">
                  <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl">
                    <h3 className="font-black text-sm text-blue-900 mb-2 uppercase">กลุ่มล่าสุด</h3>
                    {projectGroups.slice(0, 3).map((group) => (
                      <div key={group.id} className="py-2 flex justify-between items-center">
                        <span className="font-bold text-blue-800">{group.groupName}</span>
                        <span className="text-xs text-blue-600 font-medium">{group.members.length} สมาชิก</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 bg-green-50 border border-green-200 rounded-2xl">
                    <h3 className="font-black text-sm text-green-900 mb-2 uppercase">นักเรียนที่ active ล่าสุด</h3>
                    {students.slice(0, 3).map((student, idx) => (
                      <div key={idx} className="py-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-300">
                            <img src={getAvatarUrl(student.avatar)} alt={student.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-bold text-green-800">{student.name}</span>
                        </div>
                        <span className="text-xs text-green-600 font-medium">{student.lastActive}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-[#1D324B]">รายชื่อนักเรียน</h2>
                
                {students.length > 0 ? (
                  <div className="grid gap-3">
                    {students.map((student, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-300">
                              <img src={getAvatarUrl(student.avatar)} alt={student.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-black text-[#1D324B]">{student.name}</p>
                              <p className="text-xs text-slate-600 font-medium">{student.groupName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-green-600">{student.evaluationsCompleted} การประเมิน</p>
                            <p className="text-xs text-slate-500 font-medium">{student.lastActive}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-bold">ยังไม่มีนักเรียนในระบบ</p>
                  </div>
                )}
              </div>
            )}

            {/* Groups Tab */}
            {activeTab === 'groups' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black text-[#1D324B]">จัดการกลุ่ม</h2>
                  <button
                    onClick={() => setShowAddGroup(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    เพิ่มกลุ่มใหม่
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหากลุ่ม..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white outline-none font-bold text-[#1D324B] transition-all"
                  />
                </div>

                {/* Add Group Modal */}
                {showAddGroup && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                      <h3 className="text-2xl font-black text-[#1D324B] mb-6">เพิ่มกลุ่มใหม่</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-black text-slate-700 mb-2 uppercase">ชื่อกลุ่ม</label>
                          <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="เช่น Super Coders"
                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 outline-none font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-700 mb-2 uppercase">ชื่อโปรเจกต์</label>
                          <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="เช่น Mobile App Development"
                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 outline-none font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-black text-slate-700 mb-2 uppercase">สมาชิก (คั่นด้วย ,)</label>
                          <textarea
                            value={newMembers}
                            onChange={(e) => setNewMembers(e.target.value)}
                            placeholder="เช่น สมชาย ใจดี, วิภา สุขใจ"
                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 outline-none font-bold resize-none h-24"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => setShowAddGroup(false)}
                          className="flex-1 py-3 border-2 border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all"
                        >
                          ยกเลิก
                        </button>
                        <button
                          onClick={handleAddGroup}
                          disabled={!newGroupName.trim() || !newProjectName.trim()}
                          className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-bold transition-all disabled:cursor-not-allowed"
                        >
                          เพิ่มกลุ่ม
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Groups List */}
                <div className="grid gap-3">
                  {filteredGroups.map((group) => (
                    <div key={group.id} className="p-5 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-300 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-black text-lg text-[#1D324B] mb-1">{group.groupName}</h3>
                          <p className="text-sm text-slate-600 font-medium mb-2">{group.projectName}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Users className="w-3 h-3" />
                            <span className="font-bold">{group.members.length} สมาชิก</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewGroupAnalysis(group.id)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all"
                            title="ดูการวิเคราะห์"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGroup(group.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all"
                            title="ลบกลุ่ม"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.members.slice(0, 3).map((member, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded">
                            {member}
                          </span>
                        ))}
                        {group.members.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded">
                            +{group.members.length - 3} คน
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluations Tab */}
            {activeTab === 'evaluations' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black text-[#1D324B]">ข้อมูลการประเมิน</h2>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                  >
                    <FileJson className="w-4 h-4" />
                    Export JSON
                  </button>
                </div>

                {evaluations.length > 0 ? (
                  <div className="space-y-3">
                    {evaluations.slice(0, 10).map((evaluation, idx) => {
                      const evaluatorGroup = projectGroups.find(g => g.id === evaluation.evaluatorGroupId);
                      const evaluatedGroup = projectGroups.find(g => g.id === evaluation.groupId);
                      const avgScore = Object.values(evaluation.scores).reduce((a, b) => a + b, 0) / Object.values(evaluation.scores).length;
                      
                      return (
                        <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-black text-[#1D324B] mb-1">
                                {evaluatorGroup?.groupName || 'Unknown'} → {evaluatedGroup?.groupName || 'Unknown'}
                              </p>
                              <p className="text-xs text-slate-600 font-medium mb-2">
                                {new Date(evaluation.timestamp).toLocaleString('th-TH')}
                              </p>
                              {evaluation.comment && (
                                <p className="text-sm text-slate-700 italic">"{evaluation.comment}"</p>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <div className={`px-3 py-1 rounded-lg font-black text-sm ${
                                avgScore >= 4 ? 'bg-green-100 text-green-700' :
                                avgScore >= 3 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {avgScore.toFixed(1)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-bold">ยังไม่มีข้อมูลการประเมิน</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}