"use client";
import { Clock, CheckCircle2, Eye, AlertCircle, CheckCheck, User2, Send } from 'lucide-react';

interface TaskItemProps {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  // Bổ sung thêm 2 prop mới để nhận tên người giao và người nhận
  assignerName?: string; 
  assigneeName?: string;
  isReadByAssignee?: boolean; 
  showCompleteButton?: boolean;
  showMarkAsReadButton?: boolean; 
  onComplete?: () => void;
  onMarkAsRead?: () => void;
}

export const TaskItem = ({
  title,
  description,
  dueDate,
  status,
  assignerName,
  assigneeName,
  isReadByAssignee,
  showCompleteButton,
  showMarkAsReadButton,
  onComplete,
  onMarkAsRead
}: TaskItemProps) => {
  
  const isUnread = showMarkAsReadButton; 

  return (
    <div className={`relative bg-white border rounded-xl p-5 transition-all group ${
      isUnread 
        ? 'border-red-300 shadow-md bg-red-50/50' 
        : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
    }`}>
      
      {isUnread && (
        <div className="absolute -right-2 -top-2 z-20">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg animate-pulse border-2 border-white">
            <AlertCircle className="w-4 h-4" />
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          {/* Hiển thị vai trò người giao/nhận task phía trên tiêu đề */}
          <div className="flex gap-3 mb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
              <Send className="w-3 h-3" /> From: {assignerName || "N/A"}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase">
              <User2 className="w-3 h-3" /> To: {assigneeName || "N/A"}
            </div>
          </div>

          <h4 className={`font-bold text-lg ${isUnread ? 'text-red-900' : 'text-gray-900'}`}>
            {title}
          </h4>
          
          <p className="text-gray-600 text-sm max-w-2xl">{description}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-2">
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <Clock className="w-4 h-4" /> Due: {dueDate ? new Date(dueDate).toLocaleDateString('vi-VN') : 'N/A'}
            </span>
            
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {status}
            </span>
            
            {isReadByAssignee && (
              <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                <Eye className="w-4 h-4" /> Partner đã xem
              </span>
            )}
          </div>

          {showMarkAsReadButton && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                onMarkAsRead?.();
              }}
              className="mt-3 flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-lg shadow-sm active:scale-95"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Xác nhận đã xem nhiệm vụ
            </button>
          )}
        </div>
        
        {showCompleteButton && status !== 'completed' && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              onComplete?.();
            }}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-bold shadow-md active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" /> Complete
          </button>
        )}
      </div>
    </div>
  );
};