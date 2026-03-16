"use client";

import { useState } from 'react';
import { Search, FolderOpen, CheckSquare, FileText, Plus } from 'lucide-react';
import { Toaster } from 'sonner';
import { Header } from '@/app/components/Header/header';
import { MyTasks } from '@/app/components/MyTasks';
import { MyCases } from '@/app/components/MyCases';
import { useRouter } from 'next/navigation';

export default function DashboardStatic() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'tasks' | 'cases' | 'reflections'>('tasks');
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toaster position="top-right" richColors />
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-8 uppercase tracking-wide">
          Work Area
        </h2>

        {/* Search Bar - Thêm state để sau này Anh filter dữ liệu từ Supabase dễ hơn */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, cases by title..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm bg-white"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-2 py-4 border-b-2 transition-all ${
              activeTab === 'tasks' 
              ? 'border-indigo-600 text-indigo-600 font-bold' 
              : 'border-transparent text-gray-500 font-medium hover:text-indigo-400'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span>Tasks</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('cases')}
            className={`flex items-center gap-2 px-2 py-4 border-b-2 transition-all ${
              activeTab === 'cases' 
              ? 'border-indigo-600 text-indigo-600 font-bold' 
              : 'border-transparent text-gray-500 font-medium hover:text-indigo-400'
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            <span>Cases</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('reflections')}
            className={`flex items-center gap-2 px-2 py-4 border-b-2 transition-all ${
              activeTab === 'reflections' 
              ? 'border-indigo-600 text-indigo-600 font-bold' 
              : 'border-transparent text-gray-500 font-medium hover:text-indigo-400'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Reflections</span>
          </button>
        </div>

        {/* Header hành động */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {activeTab === 'tasks' ? 'Tasks Assigned to Me' : activeTab === 'cases' ? 'Tasks I Created' : 'Point Reflections'}
          </h3>
          
          {/* Nút Add Task chỉ nên hiện khi ở tab Cases (Người giao việc) */}
          {activeTab === 'cases' && (
            <button 
              onClick={() => router.push('/create-task')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add New Task
            </button>
          )}
        </div>

        {/* Nội dung thay đổi theo Tab - Truyền searchQuery xuống nếu Anh muốn làm filter nhanh */}
        <div className="min-h-[400px]">
          {activeTab === 'tasks' && <MyTasks />}
          {activeTab === 'cases' && <MyCases />}
          {activeTab === 'reflections' && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400 w-8 h-8" />
              </div>
              <p className="text-gray-500 font-medium">No reflections or point history found.</p>
              <p className="text-sm text-gray-400">Complete tasks to earn points and see your progress here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}