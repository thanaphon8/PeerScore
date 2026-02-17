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
  Crown,
  Settings,
  User,
  Copy,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';

// --- Types ---
interface MemberProfile {
  name: string;
  avatar: string;
}

interface ProjectGroup {
  id: string;
  groupName: string;
  projectName: string;
  members: string[]; // For backward compatibility
  memberProfiles?: MemberProfile[]; // Full member data with avatars
}

interface UserData {
  name: string;
  avatar: string;
  groupId: string;
  userType: 'student' | 'teacher';
  groupName?: string;
  projectName?: string;
  isNewGroup?: boolean;
  newMembers?: string[];
  newMemberProfiles?: MemberProfile[];
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
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>(PROJECT_GROUPS);
  const [userGroupId, setUserGroupId] = useState<string | null>(null);
  const [submittedGroups, setSubmittedGroups] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [copiedRoomId, setCopiedRoomId] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>('');
  const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      router.push('/login');
      return;
    }

    const parsedUserData: UserData = JSON.parse(storedUserData);
    setUserData(parsedUserData);

    // Check for room ID from URL
    const roomIdFromUrl = searchParams.get('roomId');
    if (!roomIdFromUrl) {
      // No room ID, redirect to room lobby
      router.push('/room');
      return;
    }
    setRoomId(roomIdFromUrl);

    // Load room name
    const allRooms = localStorage.getItem('allRooms') || '{}';
    const roomsData = JSON.parse(allRooms);
    const room = roomsData[roomIdFromUrl];
    if (room) {
      setRoomName(room.name);
    }

    // Load custom groups from localStorage
    const storedGroups = localStorage.getItem('projectGroups');
    let allGroups = [...PROJECT_GROUPS];
    if (storedGroups) {
      const customGroups = JSON.parse(storedGroups);
      allGroups = [...PROJECT_GROUPS, ...customGroups];
    }

    // Load room-specific member assignments
    const roomMembersKey = `roomMembers_${roomIdFromUrl}`;
    const storedRoomMembers = localStorage.getItem(roomMembersKey);
    const roomMembers: { [groupId: string]: MemberProfile[] } = storedRoomMembers ? JSON.parse(storedRoomMembers) : {};

    // Update group members with room-specific data
    allGroups = allGroups.map(group => {
      if (roomMembers[group.id]) {
        return { 
          ...group, 
          memberProfiles: roomMembers[group.id],
          members: roomMembers[group.id].map(m => m.name)
        };
      }
      return group;
    });

    // If user created a new group, add it to the groups list
    if (parsedUserData.isNewGroup && parsedUserData.groupName && parsedUserData.projectName) {
      const newGroup: ProjectGroup = {
        id: parsedUserData.groupId,
        groupName: parsedUserData.groupName,
        projectName: parsedUserData.projectName,
        members: parsedUserData.newMembers || [],
        memberProfiles: parsedUserData.newMemberProfiles || []
      };
      
      const groupExists = allGroups.some(g => g.id === newGroup.id);
      if (!groupExists) {
        allGroups = [...allGroups, newGroup];
        // Save all groups
        const customOnly = allGroups.filter(g => !PROJECT_GROUPS.some(pg => pg.id === g.id));
        localStorage.setItem('projectGroups', JSON.stringify(customOnly));
        
        // Save room-specific members with full profiles
        roomMembers[newGroup.id] = newGroup.memberProfiles || [];
        localStorage.setItem(roomMembersKey, JSON.stringify(roomMembers));
      }
    }

    // Update room members if user has changed groups
    if (parsedUserData.groupId && parsedUserData.name) {
      let membersUpdated = false;
      
      const currentUserProfile: MemberProfile = {
        name: parsedUserData.name,
        avatar: parsedUserData.avatar || 'default'
      };
      
      // Remove user from all groups first
      Object.keys(roomMembers).forEach(groupId => {
        roomMembers[groupId] = roomMembers[groupId].filter(m => m.name !== parsedUserData.name);
        if (roomMembers[groupId].length !== (roomMembers[groupId] || []).length) {
          membersUpdated = true;
        }
      });
      
      // Add user to their current group
      if (!roomMembers[parsedUserData.groupId]) {
        roomMembers[parsedUserData.groupId] = [];
      }
      if (!roomMembers[parsedUserData.groupId].some(m => m.name === parsedUserData.name)) {
        roomMembers[parsedUserData.groupId].push(currentUserProfile);
        membersUpdated = true;
      }
      
      // Save updated room members
      if (membersUpdated) {
        localStorage.setItem(roomMembersKey, JSON.stringify(roomMembers));
        
        // Update allGroups with new member data
        allGroups = allGroups.map(group => {
          if (roomMembers[group.id]) {
            return { 
              ...group, 
              memberProfiles: roomMembers[group.id],
              members: roomMembers[group.id].map(m => m.name)
            };
          }
          return group;
        });
      }
    }

    setProjectGroups(allGroups);

    const groupIdFromUrl = searchParams.get('userGroupId');
    if (groupIdFromUrl) {
      setUserGroupId(groupIdFromUrl);
      
      // Load submitted groups for this specific groupId from URL
      if (parsedUserData.userType === 'student') {
        const storedSubmissions = localStorage.getItem(`submissions_${groupIdFromUrl}`);
        if (storedSubmissions) {
          setSubmittedGroups(JSON.parse(storedSubmissions));
        } else {
          setSubmittedGroups([]); // Reset if no submissions for this group
        }
      }
    } else {
      // For teachers, set to first group or teacher's group
      if (parsedUserData.userType === 'teacher') {
        setUserGroupId(parsedUserData.groupId || 'teacher');
      } else {
        setUserGroupId(parsedUserData.groupId);
        
        // Load submitted groups for userData.groupId
        const storedSubmissions = localStorage.getItem(`submissions_${parsedUserData.groupId}`);
        if (storedSubmissions) {
          setSubmittedGroups(JSON.parse(storedSubmissions));
        }
      }
    }

    setIsLoading(false);
  }, [searchParams, router]);

  const currentUserGroup = projectGroups.find(g => g.id === userGroupId);
  const totalGroups = projectGroups.length;
  const evaluatableGroupsCount = userData?.userType === 'teacher' ? 0 : projectGroups.filter(g => g.id !== userGroupId).length;
  const completedCount = submittedGroups.length;
  const pendingCount = evaluatableGroupsCount - completedCount;

  // Count total students (for teacher view)
  const getTotalStudents = (): number => {
    // Check if we're on client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 0;
    }
    
    // In real app, this would come from database
    // For now, count from localStorage (exclude teachers)
    let studentCount = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('profile_')) {
          try {
            const profileData = JSON.parse(localStorage.getItem(key) || '{}');
            // ไม่นับครู - เฉพาะนักเรียนเท่านั้น
            if (!profileData.userType || profileData.userType === 'student') {
              studentCount++;
            }
          } catch {
            // Skip invalid profile data
          }
        }
      }
      // Fallback: count members in groups (if no profiles found)
      const membersCount = projectGroups.reduce((acc, g) => acc + g.members.length, 0);
      return Math.max(studentCount, membersCount);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return 0;
    }
  };

  const totalStudents = getTotalStudents();

  // Get all evaluations for teacher
  const getAllEvaluations = () => {
    // Check if we're on client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [];
    }
    
    try {
      const evaluationsStr = localStorage.getItem('evaluations');
      return evaluationsStr ? JSON.parse(evaluationsStr) : [];
    } catch (error) {
      console.error('Error accessing evaluations:', error);
      return [];
    }
  };

  const totalEvaluations = userData?.userType === 'teacher' ? getAllEvaluations().length : 0;

  const sortedGroups = [...projectGroups].sort((a, b) => {
    if (a.id === userGroupId) return -1;
    if (b.id === userGroupId) return 1;
    return 0;
  });

  const handleSelectGroup = (group: ProjectGroup): void => {
    if (userData?.userType === 'teacher') {
      // Teachers can view analysis of any group
      router.push(`/analyze?userGroupId=${group.id}&roomId=${roomId}`);
    } else if (group.id === userGroupId) {
      router.push(`/analyze?userGroupId=${userGroupId}&roomId=${roomId}`);
    } else if (!submittedGroups.includes(group.id)) {
      router.push(`/evaluate?groupId=${group.id}&userGroupId=${userGroupId}&roomId=${roomId}`);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem('userData');
    localStorage.removeItem(`submissions_${userGroupId}`);
    router.push('/login');
  };

  const handleProfile = (): void => {
    router.push('/profile');
  };

  const handleCopyRoomId = (): void => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopiedRoomId(true);
      setTimeout(() => setCopiedRoomId(false), 2000);
    }
  };

  const handleDeleteGroup = (groupId: string, event: React.MouseEvent): void => {
    event.stopPropagation(); // Prevent card click
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบกลุ่มนี้?')) return;
    
    // Remove from custom groups in localStorage
    const storedGroups = localStorage.getItem('projectGroups');
    if (storedGroups) {
      const customGroups = JSON.parse(storedGroups);
      const updatedGroups = customGroups.filter((g: ProjectGroup) => g.id !== groupId);
      localStorage.setItem('projectGroups', JSON.stringify(updatedGroups));
      
      // Update displayed groups
      const newAllGroups = [...PROJECT_GROUPS, ...updatedGroups];
      setProjectGroups(newAllGroups);
    }
    
    // Also remove evaluations for this group
    const evaluationsStr = localStorage.getItem('evaluations');
    if (evaluationsStr) {
      const evaluations = JSON.parse(evaluationsStr);
      const updatedEvaluations = evaluations.filter((e: any) => e.groupId !== groupId);
      localStorage.setItem('evaluations', JSON.stringify(updatedEvaluations));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1D324B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1D324B] font-bold">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!userData || !userGroupId) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-[#1D324B] font-bold">กำลังโหลด...</p>
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
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-slate-200 ring-2 ring-slate-100 hover:ring-4 hover:ring-blue-100 transition-all cursor-pointer"
                  >
                    <img 
                      src={getRandomProfileImage(userData.avatar)} 
                      alt={userData.name}
                      className="object-cover w-full h-full"
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowProfileMenu(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                          <p className="font-black text-[#1D324B] text-sm">{userData.name}</p>
                          <p className="text-xs text-slate-500 font-medium mt-1">
                            {currentUserGroup?.groupName}
                          </p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-black uppercase ${
                              userData.userType === 'teacher' 
                                ? 'bg-amber-100 text-amber-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {userData.userType === 'teacher' ? '👨‍🏫 ครู' : '🎓 นักเรียน'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleProfile}
                          className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 border-b border-slate-100"
                        >
                          <Settings className="w-4 h-4 text-slate-600" />
                          <span className="font-bold text-sm text-slate-700">แก้ไขโปรไฟล์</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-bold text-sm">ออกจากระบบ</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xl font-black text-[#1D324B] tracking-tight">{userData.name}</span>
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-3xl font-black text-[#1D324B] italic tracking-tighter uppercase">Group Evaluation</h1>
              </div>
              
              {/* Room Name and Room ID Display */}
              <div className="flex flex-col items-end gap-2">
                {/* Room Name */}
                {roomName && (
                  <div>
                    <span className="text-lg font-black text-[#1D324B] tracking-tight">{roomName}</span>
                  </div>
                )}
                
                {/* Room ID */}
                {roomId && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-600 uppercase">Room ID:</span>
                    <span className="text-lg font-black text-[#1D324B] tracking-wider">{roomId}</span>
                    <button
                      onClick={handleCopyRoomId}
                      className="p-1.5 hover:bg-blue-100 rounded-lg transition-all"
                      title="คัดลอก Room ID"
                    >
                      {copiedRoomId ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </header>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-600 border border-amber-500 p-5 rounded-2xl shadow-md flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black text-amber-100 uppercase">
                  {userData?.userType === 'teacher' ? 'Total Students' : 'Total Groups'}
                </p>
                <p className="text-2xl font-black text-white">
                  {userData?.userType === 'teacher' ? totalStudents : totalGroups}
                </p>
              </div>
            </div>
            <div className="bg-[#47A15A] border border-[#3e8a4d] p-5 rounded-2xl shadow-md flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white"><CheckCircle2 className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black text-emerald-50 uppercase">
                  {userData?.userType === 'teacher' ? 'Total Evaluations' : 'Evaluated'}
                </p>
                <p className="text-2xl font-black text-white">
                  {userData?.userType === 'teacher' ? totalEvaluations : completedCount}
                </p>
              </div>
            </div>
            <div className="bg-[#7F5CFF] border border-[#6b4ae0] p-5 rounded-2xl shadow-md flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white"><Clock className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black text-purple-100 uppercase">
                  {userData?.userType === 'teacher' ? 'Total Groups' : 'Pending'}
                </p>
                <p className="text-2xl font-black text-white">
                  {userData?.userType === 'teacher' ? totalGroups : pendingCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Start White Background Section */}
        <div className="bg-white min-h-screen relative shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12 sm:pt-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <PieChart className="w-4 h-4 text-[#1D324B]/70" /> 
                  <h2 className="text-sm font-bold text-[#1D324B] uppercase tracking-tight">Project Groups List</h2>
                </div>
                
                <div className="flex items-center gap-3">
                  {userData?.userType === 'teacher' && (
                    <button
                      onClick={() => setIsEditMode(!isEditMode)}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md ${
                        isEditMode 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-slate-200 hover:bg-slate-300 text-[#1D324B]'
                      }`}
                    >
                      {isEditMode ? (
                        <>
                          <Trash2 className="w-4 h-4" />
                          โหมดลบ
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4" />
                          จัดการกลุ่ม
                        </>
                      )}
                    </button>
                  )}
                  
                  {userData?.userType === 'student' && roomId && (
                    <>
                      <button
                        onClick={() => setShowCreateGroupModal(true)}
                        className="px-4 py-2 bg-[#1D324B] hover:bg-[#152238] text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        สร้างกลุ่มใหม่
                      </button>
                      <button
                        onClick={() => router.push(`/select-group?roomId=${roomId}`)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md"
                      >
                        <Users className="w-4 h-4" />
                        เปลี่ยนกลุ่ม
                      </button>
                      <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md ${
                          isEditMode 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-slate-200 hover:bg-slate-300 text-[#1D324B]'
                        }`}
                      >
                        {isEditMode ? (
                          <>
                            <Trash2 className="w-4 h-4" />
                            โหมดลบ
                          </>
                        ) : (
                          <>
                            <Edit3 className="w-4 h-4" />
                            จัดการกลุ่ม
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {sortedGroups.map((group) => {
                  const isOwnGroup = group.id === userGroupId;
                  const hasBeenEvaluated = submittedGroups.includes(group.id);
                  const isTeacher = userData?.userType === 'teacher';
                  
                  // Logic for conditional styling
                  const cardBg = isOwnGroup && !isTeacher ? 'bg-amber-600 border-amber-500' : 
                                 hasBeenEvaluated ? 'bg-slate-100 border-slate-200 opacity-80' : 
                                 'bg-[#1D324B] border-[#1D324B]';
                  const footerBg = isOwnGroup && !isTeacher ? 'bg-amber-700/40' : 
                                   hasBeenEvaluated ? 'bg-slate-200/50' : 
                                   'bg-black/20';

                  return (
                    <div
                      key={group.id}
                      onClick={() => !isEditMode && handleSelectGroup(group)}
                      className={`group relative border rounded-3xl text-left transition-all duration-300 shadow-xl overflow-hidden flex flex-col h-full hover:scale-[1.02] ${cardBg} ${hasBeenEvaluated && !isOwnGroup && !isTeacher ? 'cursor-not-allowed' : isEditMode ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {/* Delete Button for Teachers and Students in Edit Mode (only for custom groups) */}
                      {isEditMode && !PROJECT_GROUPS.some(pg => pg.id === group.id) && (
                        <button
                          onClick={(e) => handleDeleteGroup(group.id, e)}
                          className="absolute top-2 left-2 z-30 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all"
                          title="ลบกลุ่ม"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      {isOwnGroup && !isTeacher && (
                        <div className="absolute top-2 right-2 px-5 py-2.5 bg-white text-amber-600 text-[11px] font-black uppercase rounded-3xl shadow-lg z-20 border border-amber-100 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 fill-current" />
                          กลุ่มของฉัน
                        </div>
                      )}
                      {hasBeenEvaluated && !isOwnGroup && !isTeacher && (
                        <div className="absolute top-2 right-2 px-5 py-2.5 bg-emerald-500 text-white text-[11px] font-black uppercase rounded-3xl shadow-lg z-20 flex items-center gap-1.5 border border-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          ประเมินแล้ว
                        </div>
                      )}

                      {/* Top Section Padding */}
                      <div className="p-5 pt-8 relative z-10 flex-grow">
                        <span className={`text-[10px] font-black uppercase tracking-widest block mb-2 ${isOwnGroup && !isTeacher ? 'text-amber-200' : hasBeenEvaluated ? 'text-slate-400' : 'text-slate-400'}`}>PROJECT</span>
                        <h3 className={`text-2xl font-black mb-1 leading-tight ${isOwnGroup && !isTeacher ? 'text-white' : hasBeenEvaluated ? 'text-[#1D324B]' : 'text-white'}`}>
                          {group.groupName}
                        </h3>
                        <p className={`text-sm font-bold mt-2 ${isOwnGroup && !isTeacher ? 'text-amber-50' : hasBeenEvaluated ? 'text-slate-500' : 'text-slate-200/80'}`}>
                          {group.projectName}
                        </p>
                      </div>

                      {/* Member Section with Darker Background & No Line */}
                      <div className={`relative z-10 p-5 pt-4 flex flex-col gap-4 ${footerBg}`}>
                        <div className="flex items-end justify-between">
                            <div className="flex flex-col gap-2">
                                 <span className={`text-[9px] font-black uppercase tracking-widest ${isOwnGroup && !isTeacher ? 'text-white/80' : hasBeenEvaluated ? 'text-slate-400' : 'text-white/60'}`}>
                                    MEMBERS: {isOwnGroup && !isTeacher ? group.members.length + 1 : group.members.length}
                                 </span>
                                 <div className="flex -space-x-3">
                                    {isOwnGroup && !isTeacher && currentUserGroup && (
                                        <div className="h-10 w-10 rounded-full border-2 border-slate-200 shadow-sm transition-transform group-hover:translate-y-[-2px] overflow-hidden">
                                        <img 
                                            src={getRandomProfileImage(userData.avatar)} 
                                            alt={userData.name}
                                            className="object-cover w-full h-full"
                                        />
                                        </div>
                                    )}
                                    {group.members.slice(0, 5).map((member, i) => (
                                        <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-200 shadow-sm transition-transform group-hover:translate-y-[-2px] overflow-hidden">
                                        <img 
                                            src={getRandomProfileImage(member)} 
                                            alt={member}
                                            className="object-cover w-full h-full"
                                        />
                                        </div>
                                    ))}
                                    {group.members.length > 5 && (
                                      <div className="h-10 w-10 rounded-full border-2 border-slate-200 shadow-sm bg-slate-300 flex items-center justify-center">
                                        <span className="text-xs font-black text-slate-600">+{group.members.length - 5}</span>
                                      </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                                {isTeacher ? (
                                    <div className="flex flex-col items-center gap-1 group/btn">
                                        <BarChart3 className="w-5 h-5 text-white" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-white">ดูข้อมูล</span>
                                    </div>
                                ) : !isOwnGroup && !hasBeenEvaluated ? (
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
                    </div>
                  );
                })}
              </div>
           </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroupModal && userData && roomId && (
        <CreateGroupModal 
          isOpen={showCreateGroupModal}
          onClose={() => setShowCreateGroupModal(false)}
          roomId={roomId}
          userData={userData}
          onGroupCreated={() => {
            // Reload the page to show new group
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

// Create Group Modal Component
interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  userData: any;
  onGroupCreated: () => void;
}

function CreateGroupModal({ isOpen, onClose, roomId, userData, onGroupCreated }: CreateGroupModalProps) {
  const router = useRouter();
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [availableUsers, setAvailableUsers] = useState<MemberProfile[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Load available users with profiles
      const users: MemberProfile[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('profile_')) {
          const profileData = JSON.parse(localStorage.getItem(key) || '{}');
          if (profileData.name && profileData.name !== userData.name && profileData.userType !== 'teacher') {
            users.push({
              name: profileData.name,
              avatar: profileData.avatar || 'default'
            });
          }
        }
      }
      // Fallback demo users if none found
      if (users.length === 0) {
        users.push(
          { name: 'สมชาย ใจดี', avatar: 'Felix' },
          { name: 'วิภา สุขใจ', avatar: 'Aneka' },
          { name: 'กิตติ รักเรียน', avatar: 'Luna' },
          { name: 'อรทัย แสงใส', avatar: 'Mia' },
          { name: 'นพดล มั่นคง', avatar: 'Milo' }
        );
      }
      setAvailableUsers(users);
    }
  }, [isOpen, userData]);

  const handleCreate = () => {
    if (!newGroupName.trim() || !newProjectName.trim()) return;

    const newGroupId = `g${Date.now()}`;
    
    // Get full profiles for selected members
    const selectedMemberProfiles = availableUsers.filter(user => 
      selectedMembers.includes(user.name)
    );
    
    const newGroup = {
      id: newGroupId,
      groupName: newGroupName,
      projectName: newProjectName,
      members: selectedMembers,
      memberProfiles: selectedMemberProfiles
    };

    const storedGroups = localStorage.getItem('projectGroups') || '[]';
    const groups = JSON.parse(storedGroups);
    groups.push(newGroup);
    localStorage.setItem('projectGroups', JSON.stringify(groups));

    // Save room-specific member profiles
    const roomMembersKey = `roomMembers_${roomId}`;
    const storedRoomMembers = localStorage.getItem(roomMembersKey);
    const roomMembers = storedRoomMembers ? JSON.parse(storedRoomMembers) : {};
    roomMembers[newGroupId] = selectedMemberProfiles;
    localStorage.setItem(roomMembersKey, JSON.stringify(roomMembers));

    const updatedUserData = {
      ...userData,
      groupId: newGroupId,
      groupName: newGroupName,
      projectName: newProjectName,
      isNewGroup: true,
      newMembers: selectedMembers,
      newMemberProfiles: selectedMemberProfiles
    };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));

    // DON'T clear old submission data - allow user to evaluate their previous group
    // The key is to NOT mark the old group as submitted automatically
    
    onClose();
    // Navigate to main page
    router.push(`/?userGroupId=${newGroupId}&roomId=${roomId}`);
    onGroupCreated();
  };

  const toggleMember = (memberName: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberName) ? prev.filter(m => m !== memberName) : [...prev, memberName]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-[#1D324B] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">สร้างกลุ่มใหม่</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <User className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-2 uppercase">ชื่อกลุ่ม</label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="เช่น Code Warriors"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#1D324B] outline-none font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 mb-2 uppercase">ชื่อโปรเจกต์</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="เช่น AI System"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#1D324B] outline-none font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 mb-3 uppercase">
              สมาชิก ({selectedMembers.length} คน)
            </label>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-3 bg-slate-50 rounded-xl border-2 border-slate-200">
              {availableUsers.map((user) => (
                <button
                  key={user.name}
                  onClick={() => toggleMember(user.name)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    selectedMembers.includes(user.name) ? 'border-[#1D324B] bg-slate-100' : 'border-slate-200 hover:border-[#1D324B]/30 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-300">
                      <img src={getRandomProfileImage(user.name)} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-bold text-sm text-[#1D324B] truncate flex-1">{user.name}</p>
                    {selectedMembers.includes(user.name) && (
                      <CheckCircle2 className="w-5 h-5 text-[#1D324B]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-300 rounded-xl font-black uppercase">
            ยกเลิก
          </button>
          <button
            onClick={handleCreate}
            disabled={!newGroupName.trim() || !newProjectName.trim()}
            className="flex-1 py-3 bg-[#1D324B] hover:bg-[#152238] disabled:bg-slate-300 text-white font-black rounded-xl uppercase"
          >
            สร้างกลุ่ม
          </button>
        </div>
      </div>
    </div>
  );
}