'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft,
  Users,
  Calendar,
  Hash,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface UserData {
  name: string;
  avatar: string;
  userType: 'student' | 'teacher';
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

export default function RoomPreview(): React.ReactElement | null {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [groupCount, setGroupCount] = useState<number>(6); // Mock data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [roomNotFound, setRoomNotFound] = useState<boolean>(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      router.push('/login');
      return;
    }

    const parsedUserData: UserData = JSON.parse(storedUserData);
    setUserData(parsedUserData);

    // Get room ID from URL
    const roomId = searchParams.get('roomId');
    if (!roomId) {
      router.push('/room');
      return;
    }

    // Load room data
    const allRooms = localStorage.getItem('allRooms') || '{}';
    const roomsData = JSON.parse(allRooms);
    const roomData = roomsData[roomId];

    if (!roomData) {
      setRoomNotFound(true);
      setIsLoading(false);
      return;
    }

    setRoom(roomData);
    setIsLoading(false);
  }, [router, searchParams]);

  const handleJoinRoom = (): void => {
    if (!room || !userData) return;

    // Save room to user's rooms if not already there
    const storedRooms = localStorage.getItem(`rooms_${userData.name}`) || '[]';
    const myRooms = JSON.parse(storedRooms);
    
    const roomExists = myRooms.some((r: Room) => r.id === room.id);
    if (!roomExists) {
      const updatedRooms = [...myRooms, room];
      localStorage.setItem(`rooms_${userData.name}`, JSON.stringify(updatedRooms));
    }

    // Navigate to main page with room ID (without userGroupId yet)
    router.push(`/select-group?roomId=${room.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#1D324B] animate-spin mx-auto mb-4" />
          <p className="text-[#1D324B] font-bold">กำลังโหลดข้อมูลห้อง...</p>
        </div>
      </div>
    );
  }

  if (roomNotFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-[#1D324B] mb-3">ไม่พบห้องนี้</h2>
          <p className="text-slate-600 font-medium mb-6">
            Room ID ที่คุณป้อนไม่ถูกต้อง หรือห้องนี้ไม่มีอยู่ในระบบ
          </p>
          <button
            onClick={() => router.push('/room')}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black rounded-2xl transition-all"
          >
            กลับไปหน้าห้อง
          </button>
        </div>
      </div>
    );
  }

  if (!room || !userData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-[#1D324B] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1D324B]/[0.02] pointer-events-none" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <button 
          onClick={() => router.push('/room')}
          className="flex items-center gap-2 text-slate-600 hover:text-[#1D324B] mb-8 font-black text-xs uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          ย้อนกลับ
        </button>

        {/* Room Preview Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-sm font-black uppercase tracking-wider">ตรวจสอบห้อง</span>
              </div>
              <h1 className="text-3xl font-black mb-2">พบห้องแล้ว!</h1>
              <p className="text-white/80 font-medium">ตรวจสอบข้อมูลก่อนเข้าร่วม</p>
            </div>
          </div>

          {/* Room Details */}
          <div className="p-8 space-y-6">
            {/* Room Name */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
              <h2 className="text-2xl font-black text-[#1D324B] text-center">{room.name}</h2>
            </div>

            {/* Room Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Room ID */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="w-5 h-5 text-slate-600" />
                  <p className="text-xs font-black text-slate-600 uppercase">Room ID</p>
                </div>
                <p className="text-2xl font-black text-[#1D324B] tracking-wider">{room.id}</p>
              </div>

              {/* Groups Count */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-slate-600" />
                  <p className="text-xs font-black text-slate-600 uppercase">จำนวนกลุ่ม</p>
                </div>
                <p className="text-2xl font-black text-[#1D324B]">{groupCount} กลุ่ม</p>
              </div>
            </div>

            {/* Creator Info */}
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-amber-700" />
                <p className="text-xs font-black text-amber-700 uppercase">ข้อมูลห้อง</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={getAvatarUrl(room.createdBy)} 
                    alt={room.createdBy}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-black text-[#1D324B] mb-1">สร้างโดย: {room.createdBy}</p>
                  <p className="text-sm text-slate-600 font-medium">
                    {new Date(room.createdAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800 font-medium text-center">
                ⚠️ กรุณาตรวจสอบว่านี่คือห้องที่ถูกต้อง ก่อนกดเข้าร่วม
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => router.push('/room')}
                className="flex-1 py-4 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-2xl font-black text-slate-700 transition-all uppercase tracking-wider"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleJoinRoom}
                className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <CheckCircle2 className="w-5 h-5" />
                ยืนยันเข้าร่วม
              </button>
            </div>
          </div>
        </div>

        {/* Your Profile */}
        <div className="mt-6 p-4 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-300">
              <img 
                src={getAvatarUrl(userData.name)} 
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold">คุณจะเข้าร่วมในชื่อ</p>
              <p className="font-black text-[#1D324B]">{userData.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}