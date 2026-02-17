'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus,
  LogIn,
  History,
  Copy,
  Check,
  ArrowRight,
  Users,
  Lock,
  Sparkles,
  X,
  RefreshCw
} from 'lucide-react';

interface UserData {
  name: string;
  avatar: string;
  groupId: string;
  userType: 'student' | 'teacher';
  groupName?: string;
}

interface Room {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
}

const getAvatarUrl = (seed: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffffff`;
};

const generateRoomId = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default function RoomLobby(): React.ReactElement {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'join' | 'myrooms'>('create');
  const [roomId, setRoomId] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [generatedRoomId, setGeneratedRoomId] = useState<string>('');
  const [joinRoomId, setJoinRoomId] = useState<string>('');
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [copiedRoomId, setCopiedRoomId] = useState<string | null>(null);
  const [showCreateSuccess, setShowCreateSuccess] = useState<boolean>(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      router.push('/login');
      return;
    }

    const parsedUserData: UserData = JSON.parse(storedUserData);
    setUserData(parsedUserData);

    // Generate initial room ID
    setGeneratedRoomId(generateRoomId());

    // Load user's rooms from localStorage
    const storedRooms = localStorage.getItem(`rooms_${parsedUserData.name}`);
    if (storedRooms) {
      setMyRooms(JSON.parse(storedRooms));
    }
  }, [router]);

  const handleCreateRoom = (): void => {
    if (!roomName.trim() || !userData) return;

    const newRoom: Room = {
      id: generatedRoomId,
      name: roomName,
      createdAt: new Date().toISOString(),
      createdBy: userData.name
    };

    // Save room to user's rooms
    const updatedRooms = [...myRooms, newRoom];
    setMyRooms(updatedRooms);
    localStorage.setItem(`rooms_${userData.name}`, JSON.stringify(updatedRooms));

    // Save room data globally
    const allRooms = localStorage.getItem('allRooms') || '{}';
    const roomsData = JSON.parse(allRooms);
    roomsData[generatedRoomId] = newRoom;
    localStorage.setItem('allRooms', JSON.stringify(roomsData));

    // Show success modal
    setShowCreateSuccess(true);
    setRoomId(generatedRoomId);
  };

  const handleJoinRoom = (): void => {
    if (!joinRoomId.trim() || joinRoomId.length !== 6 || !userData) return;

    // Check if room exists
    const allRooms = localStorage.getItem('allRooms') || '{}';
    const roomsData = JSON.parse(allRooms);
    const room = roomsData[joinRoomId];

    if (!room) {
      alert('ไม่พบห้องนี้ กรุณาตรวจสอบ Room ID อีกครั้ง');
      return;
    }

    // Navigate to room preview page
    router.push(`/room/preview?roomId=${joinRoomId}`);
  };

  const handleEnterRoom = (roomId: string): void => {
    if (!userData) return;
    router.push(`/?userGroupId=${userData.groupId}&roomId=${roomId}`);
  };

  const handleCopyRoomId = (id: string): void => {
    navigator.clipboard.writeText(id);
    setCopiedRoomId(id);
    setTimeout(() => setCopiedRoomId(null), 2000);
  };

  const handleRegenerateRoomId = (): void => {
    setGeneratedRoomId(generateRoomId());
  };

  const handleDeleteRoom = (roomId: string): void => {
    if (!userData) return;
    if (!confirm('คุณต้องการลบห้องนี้ใช่หรือไม่?')) return;

    const updatedRooms = myRooms.filter(r => r.id !== roomId);
    setMyRooms(updatedRooms);
    localStorage.setItem(`rooms_${userData.name}`, JSON.stringify(updatedRooms));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-[#1D324B] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header with Profile */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-slate-200 mx-auto mb-3">
            <img src={getAvatarUrl(userData.avatar)} alt={userData.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-black text-[#1D324B] mb-1">{userData.name}</h2>
          <p className="text-slate-500 text-sm font-medium">{userData.userType === 'teacher' ? 'อาจารย์' : 'นักเรียน'}</p>
        </div>

        {/* Success Modal */}
        {showCreateSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-[#1D324B] mb-3">สร้างห้องสำเร็จ!</h2>
                <p className="text-slate-600 font-medium mb-6">แชร์ Room ID นี้ให้กับเพื่อนของคุณ</p>
                
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 mb-6">
                  <p className="text-xs font-black text-slate-600 uppercase mb-2">Room ID</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-4xl font-black text-[#1D324B] tracking-wider">{roomId}</p>
                    <button
                      onClick={() => handleCopyRoomId(roomId)}
                      className="p-3 bg-white hover:bg-blue-50 border-2 border-blue-300 rounded-xl transition-all"
                    >
                      {copiedRoomId === roomId ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowCreateSuccess(false);
                    handleEnterRoom(roomId);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  เข้าสู่ห้อง
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stacked Cards */}
        <div className="space-y-0 relative">
          {/* Create Card - Yellow/Green */}
          <button
            onClick={() => setActiveTab('create')}
            className={`group relative w-full rounded-t-[2.5rem] rounded-b-none p-8 hover:shadow-xl transition-all duration-300 overflow-hidden border-4 border-white ${
              activeTab === 'create' 
                ? 'bg-gradient-to-br from-yellow-300 to-yellow-400' 
                : 'bg-gradient-to-br from-yellow-400 to-yellow-500'
            }`}
            style={{ transform: 'skewY(-2deg)', transformOrigin: 'bottom left' }}
          >
            <div className="relative z-10" style={{ transform: 'skewY(2deg)' }}>
              <h2 className="text-5xl font-black text-green-700 mb-2 text-left">Create</h2>
              <p className="text-green-700 text-base font-bold text-left">สร้างห้อง</p>
            </div>
          </button>

          {/* Join Card - Blue */}
          <button
            onClick={() => setActiveTab('join')}
            className={`group relative w-full rounded-none p-8 hover:shadow-xl transition-all duration-300 overflow-hidden border-4 border-t-0 border-white ${
              activeTab === 'join'
                ? 'bg-gradient-to-br from-sky-300 to-blue-300'
                : 'bg-gradient-to-br from-sky-400 to-blue-400'
            }`}
            style={{ transform: 'skewY(-2deg)', transformOrigin: 'bottom left' }}
          >
            <div className="relative z-10" style={{ transform: 'skewY(2deg)' }}>
              <h2 className="text-5xl font-black text-orange-500 mb-2 text-left">Join</h2>
              <p className="text-orange-500 text-base font-bold text-left">เข้าร่วมด้วยรหัส</p>
            </div>
          </button>

          {/* Team Card - Purple */}
          <button
            onClick={() => setActiveTab('myrooms')}
            className={`group relative w-full rounded-b-[2.5rem] rounded-t-none p-8 hover:shadow-xl transition-all duration-300 overflow-hidden border-4 border-t-0 border-white ${
              activeTab === 'myrooms'
                ? 'bg-gradient-to-br from-purple-400 to-purple-500'
                : 'bg-gradient-to-br from-purple-500 to-purple-600'
            }`}
            style={{ transform: 'skewY(-2deg)', transformOrigin: 'bottom left' }}
          >
            <div className="relative z-10" style={{ transform: 'skewY(2deg)' }}>
              <h2 className="text-5xl font-black text-white mb-2 text-left">Team</h2>
              <p className="text-white text-base font-bold text-left">ทีมของฉัน ({myRooms.length})</p>
            </div>
          </button>
        </div>

        {/* Content Panel - Slides up when card is selected */}
        <div className="mt-6 bg-white rounded-3xl shadow-2xl border-4 border-slate-200 overflow-hidden">
          <div className="p-6">
            {/* Create Tab Content */}
            {activeTab === 'create' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#1D324B]">สร้างห้องใหม่</h3>
                    <p className="text-xs text-slate-600 font-medium">สร้างห้องสำหรับการประเมิน</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2 uppercase">ชื่อห้อง</label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="CS101 Final Project"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-yellow-500 focus:bg-white outline-none font-bold text-[#1D324B] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2 uppercase">Room ID</label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl">
                      <p className="text-2xl font-black text-[#1D324B] text-center tracking-wider">{generatedRoomId}</p>
                    </div>
                    <button
                      onClick={handleRegenerateRoomId}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-xl transition-all"
                    >
                      <RefreshCw className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleCreateRoom}
                  disabled={!roomName.trim()}
                  className="w-full py-4 bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 disabled:from-slate-300 disabled:to-slate-300 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5" />
                  สร้างห้อง
                </button>
              </div>
            )}

            {/* Join Tab Content */}
            {activeTab === 'join' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <LogIn className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#1D324B]">เข้าร่วมห้อง</h3>
                    <p className="text-xs text-slate-600 font-medium">ใส่ Room ID 6 หลัก</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2 uppercase">Room ID</label>
                  <input
                    type="text"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none font-black text-[#1D324B] text-3xl text-center tracking-[0.3em] transition-all"
                  />
                  <p className="text-xs text-slate-500 font-medium mt-2 text-center">
                    {joinRoomId.length}/6 ตัวอักษร
                  </p>
                </div>

                <button
                  onClick={handleJoinRoom}
                  disabled={joinRoomId.length !== 6}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 disabled:from-slate-300 disabled:to-slate-300 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider disabled:cursor-not-allowed"
                >
                  เข้าร่วมห้อง
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* My Rooms Tab Content */}
            {activeTab === 'myrooms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <History className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#1D324B]">ห้องของฉัน</h3>
                    <p className="text-xs text-slate-600 font-medium">ห้องที่คุณสร้าง ({myRooms.length})</p>
                  </div>
                </div>

                {myRooms.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {myRooms.map((room) => (
                      <div key={room.id} className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-purple-300 transition-all">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-300 shadow-sm flex-shrink-0">
                            <img 
                              src={getAvatarUrl(room.createdBy)} 
                              alt={room.createdBy}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-base text-[#1D324B] mb-1 truncate">{room.name}</h4>
                            <p className="text-xs text-slate-500 font-medium">
                              {new Date(room.createdAt).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>

                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="p-1.5 hover:bg-red-100 rounded-lg transition-all flex-shrink-0"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200">
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg">
                              <p className="text-xs font-black text-[#1D324B] tracking-wide">{room.id}</p>
                            </div>
                            <button
                              onClick={() => handleCopyRoomId(room.id)}
                              className="p-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-all"
                            >
                              {copiedRoomId === room.id ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-slate-600" />
                              )}
                            </button>
                          </div>

                          <button
                            onClick={() => handleEnterRoom(room.id)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-lg transition-all flex items-center gap-1 text-sm"
                          >
                            เข้าห้อง
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <History className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-bold mb-1 text-sm">ยังไม่มีห้อง</p>
                    <p className="text-xs text-slate-500">สร้างห้องใหม่หรือเข้าร่วมห้อง</p>
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