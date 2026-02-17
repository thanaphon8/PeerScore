'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Copy,
  Check,
  ArrowRight,
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
  const [activeTab, setActiveTab] = useState<'create' | 'join' | 'myteam' | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [generatedRoomId, setGeneratedRoomId] = useState<string>('');
  const [joinRoomId, setJoinRoomId] = useState<string>('');
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [copiedRoomId, setCopiedRoomId] = useState<string | null>(null);
  const [showCreateSuccess, setShowCreateSuccess] = useState<boolean>(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) { router.push('/login'); return; }
    const parsedUserData: UserData = JSON.parse(storedUserData);
    setUserData(parsedUserData);
    setGeneratedRoomId(generateRoomId());
    const storedRooms = localStorage.getItem(`rooms_${parsedUserData.name}`);
    if (storedRooms) setMyRooms(JSON.parse(storedRooms));
  }, [router]);

  const handleCreateRoom = (): void => {
    if (!roomName.trim() || !userData) return;
    const newRoom: Room = { id: generatedRoomId, name: roomName, createdAt: new Date().toISOString(), createdBy: userData.name };
    const updatedRooms = [...myRooms, newRoom];
    setMyRooms(updatedRooms);
    localStorage.setItem(`rooms_${userData.name}`, JSON.stringify(updatedRooms));
    const allRooms = localStorage.getItem('allRooms') || '{}';
    const roomsData = JSON.parse(allRooms);
    roomsData[generatedRoomId] = newRoom;
    localStorage.setItem('allRooms', JSON.stringify(roomsData));
    setShowCreateSuccess(true);
    setRoomId(generatedRoomId);
  };

  const handleJoinRoom = (): void => {
    if (!joinRoomId.trim() || joinRoomId.length !== 6 || !userData) return;
    const allRooms = localStorage.getItem('allRooms') || '{}';
    const roomsData = JSON.parse(allRooms);
    const room = roomsData[joinRoomId];
    if (!room) { alert('ไม่พบห้องนี้ กรุณาตรวจสอบ Room ID อีกครั้ง'); return; }
    if (!myRooms.some(r => r.id === joinRoomId)) {
      const updatedRooms = [...myRooms, room];
      setMyRooms(updatedRooms);
      localStorage.setItem(`rooms_${userData.name}`, JSON.stringify(updatedRooms));
    }
    router.push(`/?userGroupId=${userData.groupId}&roomId=${joinRoomId}`);
  };

  const handleEnterRoom = (id: string): void => {
    if (!userData) return;
    router.push(`/?userGroupId=${userData.groupId}&roomId=${id}`);
  };

  const handleCopyRoomId = (id: string): void => {
    navigator.clipboard.writeText(id);
    setCopiedRoomId(id);
    setTimeout(() => setCopiedRoomId(null), 2000);
  };

  const handleDeleteRoom = (id: string): void => {
    if (!userData || !confirm('คุณต้องการลบห้องนี้ใช่หรือไม่?')) return;
    const updatedRooms = myRooms.filter(r => r.id !== id);
    setMyRooms(updatedRooms);
    localStorage.setItem(`rooms_${userData.name}`, JSON.stringify(updatedRooms));
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1D324B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#1D324B] font-bold">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // ─── CREATE PAGE ─────────────────────────────────────────────────

  if (activeTab === 'create') {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <button onClick={() => setActiveTab(null)} className="flex items-center gap-2 text-gray-500 hover:text-[#1D324B] mb-8 font-semibold text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ย้อนกลับ
          </button>

          <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-white px-10 pt-8 pb-0 flex flex-col items-center border-b border-gray-100">
              <h1 className="text-4xl font-black tracking-widest mb-5" style={{ color: '#D4A017' }}>CREATE</h1>
              <div className="w-52 h-52 relative">
                <Image src="/images/create.png" alt="Create" fill className="object-contain" />
              </div>
            </div>
            <div className="p-8 space-y-5">
              <p className="text-center text-gray-500 text-sm font-medium mb-2">สร้างห้องใหม่สำหรับทีมของคุณ</p>
              <div>
                <label className="block text-sm font-bold text-[#1D324B] mb-2 uppercase tracking-wider">ชื่อห้อง</label>
                <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="เช่น CS101 Final Project Evaluation"
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#1D324B] focus:bg-white outline-none font-semibold text-[#1D324B] transition-all placeholder:text-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1D324B] mb-2 uppercase tracking-wider">Room ID (สร้างอัตโนมัติ)</label>
                <div className="flex gap-3">
                  <div className="flex-1 px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl">
                    <p className="text-3xl font-black text-[#1D324B] text-center tracking-widest">{generatedRoomId}</p>
                  </div>
                  <button onClick={() => setGeneratedRoomId(generateRoomId())} className="px-4 bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 rounded-2xl transition-all" title="สุ่มใหม่">
                    <RefreshCw className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <button onClick={handleCreateRoom} disabled={!roomName.trim()}
                className="w-full py-4 bg-[#1D324B] hover:bg-[#152238] disabled:bg-gray-300 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:cursor-not-allowed">
                <Sparkles className="w-5 h-5" /> สร้างห้อง
              </button>
            </div>
          </div>

          <div className="mt-6 text-center"><p className="text-gray-400 text-sm">ระบบประเมินกลุ่มโปรเจกต์ สำหรับการเรียนการสอน</p></div>
        </div>

        {showCreateSuccess && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Check className="w-8 h-8 text-[#1D324B]" />
                </div>
                <h2 className="text-2xl font-black text-[#1D324B] mb-2">สร้างห้องสำเร็จ!</h2>
                <p className="text-gray-500 font-medium mb-6 text-sm">แชร์ Room ID นี้ให้กับเพื่อนของคุณ</p>
                <div className="p-5 bg-gray-50 rounded-2xl border-2 border-gray-200 mb-6">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Room ID</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-4xl font-black text-[#1D324B] tracking-widest">{roomId}</p>
                    <button onClick={() => handleCopyRoomId(roomId)} className="p-2 bg-white hover:bg-gray-100 border-2 border-gray-200 rounded-xl transition-all">
                      {copiedRoomId === roomId ? <Check className="w-5 h-5 text-[#1D324B]" /> : <Copy className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <button onClick={() => { setShowCreateSuccess(false); handleEnterRoom(roomId); }}
                  className="w-full py-4 bg-[#1D324B] hover:bg-[#152238] text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                  เข้าสู่ห้อง <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── JOIN PAGE ───────────────────────────────────────────────────

  if (activeTab === 'join') {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <button onClick={() => setActiveTab(null)} className="flex items-center gap-2 text-gray-500 hover:text-[#1D324B] mb-8 font-semibold text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ย้อนกลับ
          </button>

          <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-white px-10 pt-8 pb-0 flex flex-col items-center border-b border-gray-100">
              <h1 className="text-4xl font-black tracking-widest mb-5" style={{ color: '#3BAADF' }}>JOIN</h1>
              <div className="w-52 h-52 relative">
                <Image src="/images/join.png" alt="Join" fill className="object-contain" />
              </div>
            </div>
            <div className="p-8 space-y-5">
              <p className="text-center text-gray-500 text-sm font-medium mb-2">ใส่ Room ID ที่คุณได้รับจากเพื่อนหรือครู</p>
              <div>
                <label className="block text-sm font-bold text-[#1D324B] mb-2 uppercase tracking-wider">Room ID (6 หลัก)</label>
                <input type="text" value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000" maxLength={6}
                  className="w-full px-6 py-6 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#1D324B] focus:bg-white outline-none font-black text-[#1D324B] text-4xl text-center tracking-[0.5em] transition-all placeholder:text-gray-200" />
                <p className="text-xs text-gray-400 font-medium mt-2 text-center">{joinRoomId.length}/6 ตัวอักษร</p>
              </div>
              <button onClick={handleJoinRoom} disabled={joinRoomId.length !== 6}
                className="w-full py-4 bg-[#1D324B] hover:bg-[#152238] disabled:bg-gray-300 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:cursor-not-allowed">
                เข้าร่วมห้อง <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-6 text-center"><p className="text-gray-400 text-sm">ระบบประเมินกลุ่มโปรเจกต์ สำหรับการเรียนการสอน</p></div>
        </div>
      </div>
    );
  }

  // ─── MY TEAM PAGE ────────────────────────────────────────────────

  if (activeTab === 'myteam') {
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-start p-8">
        <div className="w-full max-w-2xl">
          <button onClick={() => setActiveTab(null)} className="flex items-center gap-2 text-gray-500 hover:text-[#1D324B] mb-8 font-semibold text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ย้อนกลับ
          </button>

          <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-white px-10 pt-8 pb-0 flex flex-col items-center border-b border-gray-100">
              <h1 className="text-4xl font-black tracking-widest mb-5" style={{ color: '#7F5CFF' }}>MY TEAM</h1>
              <div className="w-52 h-52 relative">
                <Image src="/images/myteam.png" alt="My Team" fill className="object-contain" />
              </div>
            </div>
            <div className="p-8">
              <p className="text-center text-gray-500 text-sm font-medium mb-6">ห้องที่คุณสร้างหรือเคยเข้าร่วม</p>
              {myRooms.length > 0 ? (
                <div className="grid gap-4">
                  {myRooms.map((room) => (
                    <div key={room.id} className="p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl hover:border-[#1D324B]/30 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-black text-base text-[#1D324B]">{room.name}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">สร้างโดย: {room.createdBy} • {new Date(room.createdAt).toLocaleDateString('th-TH')}</p>
                        </div>
                        <button onClick={() => handleDeleteRoom(room.id)} className="p-2 hover:bg-red-100 rounded-lg transition-all">
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl">
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Room ID</p>
                            <p className="text-xl font-black text-[#1D324B] tracking-wider">{room.id}</p>
                          </div>
                          <button onClick={() => handleCopyRoomId(room.id)} className="p-2 bg-white hover:bg-gray-100 border-2 border-gray-200 rounded-xl transition-all">
                            {copiedRoomId === room.id ? <Check className="w-4 h-4 text-[#1D324B]" /> : <Copy className="w-4 h-4 text-gray-400" />}
                          </button>
                        </div>
                        <button onClick={() => handleEnterRoom(room.id)} className="px-5 py-2.5 bg-[#1D324B] hover:bg-[#152238] text-white font-black rounded-xl transition-all flex items-center gap-2 text-sm">
                          เข้าห้อง <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-400 font-bold mb-1">ยังไม่มีห้อง</p>
                  <p className="text-sm text-gray-300">สร้างห้องใหม่หรือเข้าร่วมห้องที่มีอยู่</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center"><p className="text-gray-400 text-sm">ระบบประเมินกลุ่มโปรเจกต์ สำหรับการเรียนการสอน</p></div>
        </div>
      </div>
    );
  }

  // ─── MAIN LOBBY ──────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto mb-4">
            <img src={getAvatarUrl(userData.avatar)} alt={userData.name} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-black text-[#1D324B] mb-1">ยินดีต้อนรับ, {userData.name}</h1>
          <p className="text-gray-500 text-base">เลือกสิ่งที่ต้องการทำ</p>
        </div>

        {/* 3 Cards */}
        <div className="grid sm:grid-cols-3 gap-6">

          {/* CREATE */}
          <button
            onClick={() => setActiveTab('create')}
            className="group bg-white rounded-3xl flex flex-col items-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-yellow-300 overflow-hidden"
          >
            <div className="bg-white w-full pt-8 pb-2 flex flex-col items-center">
              <p className="text-3xl font-black tracking-widest mb-5" style={{ color: '#D4A017' }}>CREATE</p>
              <div className="w-48 h-48 relative">
                <Image src="/images/create.png" alt="Create Room" fill className="object-contain" />
              </div>
            </div>
            <div className="px-6 py-4 text-center">
              <p className="text-gray-400 text-xs font-medium">สร้างห้องใหม่สำหรับทีม</p>
            </div>
          </button>

          {/* JOIN */}
          <button
            onClick={() => setActiveTab('join')}
            className="group bg-white rounded-3xl flex flex-col items-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-sky-300 overflow-hidden"
          >
            <div className="bg-white w-full pt-8 pb-2 flex flex-col items-center">
              <p className="text-3xl font-black tracking-widest mb-5" style={{ color: '#3BAADF' }}>JOIN</p>
              <div className="w-48 h-48 relative">
                <Image src="/images/join.png" alt="Join Room" fill className="object-contain" />
              </div>
            </div>
            <div className="px-6 py-4 text-center">
              <p className="text-gray-400 text-xs font-medium">เข้าร่วมด้วย Room ID</p>
            </div>
          </button>

          {/* MY TEAM */}
          <button
            onClick={() => setActiveTab('myteam')}
            className="group bg-white rounded-3xl flex flex-col items-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-purple-300 overflow-hidden"
          >
            <div className="bg-white w-full pt-8 pb-2 flex flex-col items-center">
              <p className="text-3xl font-black tracking-widest mb-5" style={{ color: '#7F5CFF' }}>MY TEAM</p>
              <div className="w-48 h-48 relative">
                <Image src="/images/myteam.png" alt="My Team" fill className="object-contain" />
              </div>
            </div>
            <div className="px-6 py-4 text-center">
              <p className="text-gray-400 text-xs font-medium">ห้องของฉัน ({myRooms.length})</p>
            </div>
          </button>

        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">ระบบประเมินกลุ่มโปรเจกต์ สำหรับการเรียนการสอน</p>
        </div>

      </div>
    </div>
  );
}