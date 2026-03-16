"use client";

import { useEffect, useState, useCallback } from 'react';
import { TaskItem } from './TaskItem';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const MyCases = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCases = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/my-created-cases`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.code === "success") {
        let rawTasks = data.data;

        rawTasks.sort((a: any, b: any) => {
          const aNeedsAttention = a.status === 'completed' && !a.is_read_by_assigner;
          const bNeedsAttention = b.status === 'completed' && !b.is_read_by_assigner;

          if (aNeedsAttention && !bNeedsAttention) return -1;
          if (!aNeedsAttention && bNeedsAttention) return 1;
          
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        setTasks(rawTasks);
      }
    } catch (error) {
      console.error("Lỗi fetch cases:", error);
      toast.error("Không thể tải danh sách công việc đã giao");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCases();
  }, [fetchMyCases]);

  const handleMarkAsRead = async (taskId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/mark-seen/${taskId}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await response.json();

      if (data.code === "success") {
        fetchMyCases();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Lỗi xác nhận đã xem:", error);
      toast.error("Lỗi kết nối server");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.length > 0 ? (
        tasks.map((item) => (
          <div key={item.id} className="relative">
            {item.status === 'completed' && !item.is_read_by_assigner && (
              <div className="absolute -top-2 -left-2 z-10 flex items-center gap-1 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm border border-white animate-bounce">
                <AlertCircle className="w-3 h-3" /> KẾT QUẢ MỚI
              </div>
            )}
            
            <TaskItem 
              title={item.title} 
              description={item.description} 
              dueDate={item.due_date} 
              status={item.status}
              // CHỈNH SỬA TẠI ĐÂY: Truy cập vào object lồng nhau từ Backend trả về
              assignerName={item.assigner?.full_name} 
              assigneeName={item.assignee?.full_name}
              // ------------------------------------------------------------
              isReadByAssignee={item.is_read_by_assignee}
              showMarkAsReadButton={item.status === 'completed' && !item.is_read_by_assigner}
              onMarkAsRead={() => handleMarkAsRead(item.id)}
              showCompleteButton={false} 
            />
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
          Bạn chưa giao công việc nào.
        </div>
      )}
    </div>
  );
};