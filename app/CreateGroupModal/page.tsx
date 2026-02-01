'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X,
  Users,
  Check,
  Plus
} from 'lucide-react';

interface ProjectGroup {
  id: string;
  groupName: string;
  projectName: string;
  members: string[];
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  userData: any;
  onSuccess: () => void;
}

const getAvatarUrl = (seed: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffffff`;
};

export default function CreateGroupModal({ isOpen, onClose, roomId, userData, onSuccess }: CreateGroupModalProps): React.ReactElement | null {
  const router = useRouter();
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && userData && roomId) {
      // Load all users who have joined this room
      const allUsers: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('rooms_')) {
          const userName = key.replace('rooms_', '');
          const userRooms = localStorage.getItem(key);
          if (userRooms) {
            const rooms = JSON.parse(userRooms);
            const hasRoom = rooms.some((r: any) => r.id === roomId);
            if (hasRoom && userName !== userData.name) {
              allUsers.push(userName);
            }
          }
        }
      }
      
      // Add mock users if no users found
      if (allUsers.length === 0) {
        allUsers.push('สมชาย ใจดี', 'วิภา สุขใจ', 'กิตติ รักเรียน', 'อรทัย แสงใส', 'นพดล มั่นคง');
      }
      
      setAvailableUsers(allUsers);
    }
  }, [isOpen, userData, roomId]);

  const handleCreateGroup = (): void => {
    if (!newGroupName.trim() || !newProjectName.trim() || !roomId || !userData) return;

    const newGroupId = `g${Date.now()}`;
    
    const newGroup: ProjectGroup = {
      id: newGroupId,
      groupName: newGroupName,
      projectName: newProjectName,
      members: selectedMembers
    };

    // Get existing custom groups
    const storedGroups = localStorage.getItem('projectGroups') || '[]';
    const groups = JSON.parse(storedGroups);
    groups.push(newGroup);
    localStorage.setItem('projectGroups', JSON.stringify(groups));

    // Update user data
    const updatedUserData = {
      ...userData,
      groupId: newGroupId,
      groupName: newGroupName,
      projectName: newProjectName,
      isNewGroup: true,
      newMembers: selectedMembers
    };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));

    // Close modal and navigate
    onClose();
    onSuccess();
    router.push(`/?userGroupId=${newGroupId}&roomId=${roomId}`);
  };

  const toggleMemberSelection = (member: string): void => {
    setSelectedMembers(prev => {
      if (prev.includes(member)) {
        return prev.filter(m => m !== member);
      } else {
        return [...prev, member];
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1D324B] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">สร้างกลุ่มใหม่</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">ชื่อกลุ่ม</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="เช่น Code Warriors"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#1D324B] focus:bg-white outline-none font-bold text-[#1D324B] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">ชื่อโปรเจกต์</label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="เช่น AI Chatbot System"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#1D324B] focus:bg-white outline-none font-bold text-[#1D324B] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-3 uppercase tracking-wider">
                เลือกสมาชิกในกลุ่ม ({selectedMembers.length} คน)
              </label>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-3 bg-slate-50 rounded-xl border-2 border-slate-200">
                {availableUsers.map((user) => (
                  <button
                    key={user}
                    onClick={() => toggleMemberSelection(user)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      selectedMembers.includes(user)
                        ? 'border-[#1D324B] bg-slate-100'
                        : 'border-slate-200 hover:border-[#1D324B]/30 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-300 flex-shrink-0">
                        <img 
                          src={getAvatarUrl(user)} 
                          alt={user}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-[#1D324B] truncate">{user}</p>
                      </div>
                      {selectedMembers.includes(user) && (
                        <div className="w-5 h-5 bg-[#1D324B] rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {availableUsers.length === 0 && (
                <p className="text-xs text-slate-500 mt-2">ไม่พบผู้ใช้งานอื่นในห้องนี้</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-slate-300 hover:border-slate-400 rounded-xl font-black text-slate-700 transition-all uppercase tracking-wider"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={!newGroupName.trim() || !newProjectName.trim()}
            className="flex-1 py-3 bg-[#1D324B] hover:bg-[#152238] disabled:bg-slate-300 text-white font-black rounded-xl shadow-lg transition-all uppercase tracking-wider disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            สร้างกลุ่ม
          </button>
        </div>
      </div>
    </div>
  );
}