"use client";

import { useEffect, useState, useCallback } from 'react';
import { TaskItem } from './TaskItem';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const MyTasks = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // fetchMyTasks: Lấy dữ liệu mới nhất từ server
    const fetchMyTasks = useCallback(async (isSilent = false) => {
        try {
            if (!isSilent) setLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/my-tasks`, {
                credentials: "include",
            });
            const data = await response.json();

            if (data.code === "success") {
                let rawTasks = data.data;

                // LOGIC SẮP XẾP: Task CHƯA XÁC NHẬN (is_read_by_assignee: false) lên đầu
                rawTasks.sort((a: any, b: any) => {
                    if (a.is_read_by_assignee === b.is_read_by_assignee) {
                        // Sắp xếp theo ngày tạo mới nhất (created_at từ Supabase)
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    }
                    return a.is_read_by_assignee ? 1 : -1;
                });

                setTasks(rawTasks);
            }
        } catch (error) {
            console.error("Lỗi fetch tasks:", error);
            toast.error("Không thể tải danh sách nhiệm vụ.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyTasks();
    }, [fetchMyTasks]);

    // 1. Xác nhận đã xem
    const handleMarkAsRead = async (taskId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/mark-seen/${taskId}`, {
                method: "PATCH",
                credentials: "include",
            });
            const data = await response.json();

            if (data.code === "success") {
                await fetchMyTasks(true); 
            }
        } catch (error) {
            console.error("Lỗi xác nhận:", error);
        }
    };

    // 2. Hoàn thành nhiệm vụ
    const handleComplete = async (taskId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/complete/${taskId}`, {
                method: "PATCH",
                credentials: "include",
            });
            const data = await response.json();

            if (data.code === "success") {
                toast.success("Chúc mừng! Bạn đã nhận được điểm thưởng.");
                await fetchMyTasks(true);
            }
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái hoàn thành.");
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
                    // THAY ĐỔI: Sử dụng item.id thay cho item._id
                    <div key={item.id} className="relative group">
                        {/* Badge NHIỆM VỤ MỚI: Dựa trên trường is_read_by_assignee của SQL */}
                        {!item.is_read_by_assignee && (
                            <div className="absolute -top-2 -left-2 z-10 flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg border border-white">
                                <Sparkles className="w-3 h-3 text-yellow-300" /> NHIỆM VỤ MỚI
                            </div>
                        )}
                        
                        <TaskItem 
                            title={item.title} 
                            description={item.description} 
                            // Supabase dùng due_date
                            dueDate={item.due_date} 
                            status={item.status}
                            // Mapping dữ liệu cho TaskItem (vốn vẫn dùng camelCase làm props)
                            isReadByAssignee={item.is_read_by_assignee}
                            showMarkAsReadButton={!item.is_read_by_assignee}
                            onMarkAsRead={() => handleMarkAsRead(item.id)}
                            showCompleteButton={item.status !== 'completed'}
                            onComplete={() => handleComplete(item.id)}
                        />
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                    Hiện tại bạn không có công việc nào cần xử lý.
                </div>
            )}
        </div>
    );
};