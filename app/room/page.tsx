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

    // Save to user's rooms if not already there
    const roomExists = myRooms.some(r => r.id === joinRoomId);
    if (!roomExists) {
      const updatedRooms = [...myRooms, room];
      setMyRooms(updatedRooms);
      localStorage.setItem(`rooms_${userData.name}`, JSON.stringify(updatedRooms));
    }

    // Navigate to main page with room ID
    router.push(`/?userGroupId=${userData.groupId}&roomId=${joinRoomId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-[#1D324B] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1D324B]/[0.02] pointer-events-none" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-blue-100">
              <img src={getAvatarUrl(userData.avatar)} alt={userData.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-[#1D324B] mb-3 tracking-tight">ยินดีต้อนรับ, {userData.name}</h1>
          <p className="text-slate-600 text-lg font-medium">เลือกสร้างห้อง, เข้าร่วมห้อง หรือเข้าห้องของคุณ</p>
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

        {/* Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`p-6 rounded-3xl border-2 transition-all ${
              activeTab === 'create'
                ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-600 shadow-2xl shadow-blue-500/30'
                : 'bg-white border-slate-200 hover:border-blue-300'
            }`}
          >
            <Plus className={`w-12 h-12 mx-auto mb-3 ${activeTab === 'create' ? 'text-white' : 'text-blue-600'}`} />
            <h3 className={`text-xl font-black mb-1 ${activeTab === 'create' ? 'text-white' : 'text-[#1D324B]'}`}>
              สร้างห้อง
            </h3>
            <p className={`text-sm font-medium ${activeTab === 'create' ? 'text-white/80' : 'text-slate-600'}`}>
              สร้างห้องใหม่สำหรับทีมของคุณ
            </p>
          </button>

          <button
            onClick={() => setActiveTab('join')}
            className={`p-6 rounded-3xl border-2 transition-all ${
              activeTab === 'join'
                ? 'bg-gradient-to-br from-green-600 to-emerald-600 border-green-600 shadow-2xl shadow-green-500/30'
                : 'bg-white border-slate-200 hover:border-green-300'
            }`}
          >
            <LogIn className={`w-12 h-12 mx-auto mb-3 ${activeTab === 'join' ? 'text-white' : 'text-green-600'}`} />
            <h3 className={`text-xl font-black mb-1 ${activeTab === 'join' ? 'text-white' : 'text-[#1D324B]'}`}>
              เข้าร่วมห้อง
            </h3>
            <p className={`text-sm font-medium ${activeTab === 'join' ? 'text-white/80' : 'text-slate-600'}`}>
              ใส่ Room ID เพื่อเข้าร่วม
            </p>
          </button>

          <button
            onClick={() => setActiveTab('myrooms')}
            className={`p-6 rounded-3xl border-2 transition-all ${
              activeTab === 'myrooms'
                ? 'bg-gradient-to-br from-amber-600 to-orange-600 border-amber-600 shadow-2xl shadow-amber-500/30'
                : 'bg-white border-slate-200 hover:border-amber-300'
            }`}
          >
            <History className={`w-12 h-12 mx-auto mb-3 ${activeTab === 'myrooms' ? 'text-white' : 'text-amber-600'}`} />
            <h3 className={`text-xl font-black mb-1 ${activeTab === 'myrooms' ? 'text-white' : 'text-[#1D324B]'}`}>
              ห้องของฉัน
            </h3>
            <p className={`text-sm font-medium ${activeTab === 'myrooms' ? 'text-white/80' : 'text-slate-600'}`}>
              ห้องที่คุณเคยเข้าร่วม ({myRooms.length})
            </p>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-8 sm:p-12">
          {/* Create Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1D324B]">สร้างห้องใหม่</h2>
                  <p className="text-sm text-slate-600 font-medium">สร้างห้องสำหรับการประเมินกลุ่มโปรเจกต์</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider">ชื่อห้อง</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="เช่น CS101 Final Project Evaluation"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-bold text-[#1D324B] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider">Room ID (สร้างอัตโนมัติ)</label>
                <div className="flex gap-3">
                  <div className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
                    <p className="text-3xl font-black text-[#1D324B] text-center tracking-widest">{generatedRoomId}</p>
                  </div>
                  <button
                    onClick={handleRegenerateRoomId}
                    className="px-6 py-4 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl transition-all"
                    title="สุ่มใหม่"
                  >
                    <RefreshCw className="w-6 h-6 text-slate-600" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleCreateRoom}
                disabled={!roomName.trim()}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-wider disabled:cursor-not-allowed text-lg"
              >
                <Sparkles className="w-6 h-6" />
                สร้างห้อง
              </button>
            </div>
          )}

          {/* Join Tab */}
          {activeTab === 'join' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1D324B]">เข้าร่วมห้อง</h2>
                  <p className="text-sm text-slate-600 font-medium">ใส่ Room ID ที่คุณได้รับจากเพื่อนหรือครู</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-wider">Room ID (6 หลัก)</label>
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-6 py-6 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-green-600 focus:bg-white outline-none font-black text-[#1D324B] text-4xl text-center tracking-[0.5em] transition-all"
                />
                <p className="text-xs text-slate-500 font-medium mt-2 text-center">
                  {joinRoomId.length}/6 ตัวอักษร
                </p>
              </div>

              <button
                onClick={handleJoinRoom}
                disabled={joinRoomId.length !== 6}
                className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-wider disabled:cursor-not-allowed text-lg"
              >
                เข้าร่วมห้อง
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* My Rooms Tab */}
          {activeTab === 'myrooms' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <History className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1D324B]">ห้องของฉัน</h2>
                  <p className="text-sm text-slate-600 font-medium">ห้องที่คุณสร้างหรือเคยเข้าร่วม</p>
                </div>
              </div>

              {myRooms.length > 0 ? (
                <div className="grid gap-4">
                  {myRooms.map((room) => (
                    <div key={room.id} className="p-5 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl hover:border-blue-300 transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-black text-lg text-[#1D324B] mb-1">{room.name}</h3>
                          <p className="text-xs text-slate-600 font-medium">
                            สร้างโดย: {room.createdBy} • {new Date(room.createdAt).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-all"
                          title="ลบห้อง"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="px-4 py-2 bg-white border border-slate-300 rounded-xl">
                            <p className="text-xs text-slate-500 font-bold mb-1">Room ID</p>
                            <p className="text-xl font-black text-[#1D324B] tracking-wider">{room.id}</p>
                          </div>
                          <button
                            onClick={() => handleCopyRoomId(room.id)}
                            className="p-3 bg-white hover:bg-blue-50 border-2 border-slate-300 hover:border-blue-400 rounded-xl transition-all"
                            title="คัดลอก Room ID"
                          >
                            {copiedRoomId === room.id ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <Copy className="w-5 h-5 text-slate-600" />
                            )}
                          </button>
                        </div>

                        <button
                          onClick={() => handleEnterRoom(room.id)}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black rounded-xl transition-all flex items-center gap-2"
                        >
                          เข้าห้อง
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-bold mb-2">ยังไม่มีห้อง</p>
                  <p className="text-sm text-slate-500">สร้างห้องใหม่หรือเข้าร่วมห้องที่มีอยู่</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}