"use client";

import { useEffect, useState } from "react";
import { Header } from '@/app/components/Header/header';
import { ArrowLeft, Send, Calendar, User, Mail, AlignLeft, Type, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import JustValidate from "just-validate";

// Định nghĩa kiểu dữ liệu cho Member
interface Member {
    full_name: string;
    email: string;
}

export default function CreateTaskPage() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    
    // --- BỔ SUNG 1: State lưu danh sách member và email được chọn ---
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedEmail, setSelectedEmail] = useState("");

    // --- BỔ SUNG 2: Fetch danh sách member từ Backend khi load trang ---
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/all-members`, {
                    credentials: "include"
                });
                const data = await response.json();
                if (data.code === "success") {
                    setMembers(data.data);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách member:", error);
            }
        };
        fetchMembers();
    }, []);

    useEffect(() => {
        let isSubmitting = false;

        const validator = new JustValidate("#createTaskForm", {
            validateBeforeSubmitting: true,
        });

        validator
            .addField("#title", [
                { rule: "required", errorMessage: "Tiêu đề công việc là bắt buộc!" },
                { rule: "minLength", value: 5, errorMessage: "Tiêu đề quá ngắn!" },
            ])
            .addField("#description", [
                { rule: "required", errorMessage: "Mô tả công việc là bắt buộc!" },
            ])
            .addField("#assigneeName", [
                { rule: "required", errorMessage: "Vui lòng chọn người nhận!" },
            ])
            .onSuccess(async (event: any) => {
                if (isSubmitting) return;
                
                isSubmitting = true;
                setIsPending(true);

                const form = event.target;
                const dataFinal = {
                    title: form.title.value,
                    description: form.description.value,
                    assigneeName: form.assigneeName.value,
                    assigneeEmail: form.assigneeEmail.value, // Giá trị này sẽ lấy từ state selectedEmail
                    dueDate: form.dueDate.value,
                };

                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/create`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(dataFinal),
                    });

                    const data = await response.json();

                    if (data.code === "error") {
                        toast.error(data.message);
                        isSubmitting = false;
                        setIsPending(false);
                    } else if (data.code === "success") {
                        toast.success("Tạo và giao việc thành công!");
                        setTimeout(() => router.push("/home"), 1000);
                    }
                } catch (error) {
                    toast.error("Lỗi kết nối đến hệ thống!");
                    isSubmitting = false;
                    setIsPending(false);
                }
            });

        return () => { validator.destroy(); };
    }, [router]);

    // --- BỔ SUNG 3: Hàm xử lý khi chọn member ---
    const handleMemberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        const member = members.find(m => m.full_name === selectedName);
        if (member) {
            setSelectedEmail(member.email);
        } else {
            setSelectedEmail("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Toaster position="top-right" richColors />
            <Header />

            <main className="max-w-3xl mx-auto px-6 py-10">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Dashboard</span>
                </button>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-indigo-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <PlusCircleIcon /> Create New Task
                        </h2>
                        <p className="text-indigo-100 mt-1">Giao việc cho cộng sự của bạn thông qua danh sách thành viên.</p>
                    </div>

                    <form id="createTaskForm" className="p-8 space-y-6">
                        {/* Title & Description giữ nguyên... */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2" htmlFor="title">
                                <Type className="w-4 h-4 text-indigo-500" /> Task Title *
                            </label>
                            <input type="text" name="title" id="title" placeholder="Tiêu đề..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white" />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2" htmlFor="description">
                                <AlignLeft className="w-4 h-4 text-indigo-500" /> Description *
                            </label>
                            <textarea name="description" id="description" placeholder="Chi tiết..." rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* --- THAY ĐỔI: Chuyển Input sang Select --- */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2" htmlFor="assigneeName">
                                    <User className="w-4 h-4 text-indigo-500" /> Assignee Name *
                                </label>
                                <select
                                    name="assigneeName"
                                    id="assigneeName"
                                    onChange={handleMemberChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                >
                                    <option value="">-- Chọn thành viên --</option>
                                    {members.map((m, index) => (
                                        <option key={index} value={m.full_name}>{m.full_name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* --- THAY ĐỔI: Email tự động điền và để readonly --- */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2" htmlFor="assigneeEmail">
                                    <Mail className="w-4 h-4 text-indigo-500" /> Assignee Email *
                                </label>
                                <input
                                    type="email"
                                    name="assigneeEmail"
                                    id="assigneeEmail"
                                    value={selectedEmail}
                                    readOnly
                                    placeholder="Email sẽ tự hiện..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                                />
                            </div>
                        </div>

                        {/* Due Date & Buttons giữ nguyên... */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2" htmlFor="dueDate">
                                <Calendar className="w-4 h-4 text-indigo-500" /> Due Date
                            </label>
                            <input type="date" name="dueDate" id="dueDate" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-600" />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => router.back()} className="flex-1 px-6 py-4 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all">Cancel</button>
                            <button type="submit" disabled={isPending} className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-indigo-400">
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                {isPending ? "Processing..." : "Create & Assign Task"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

function PlusCircleIcon() {
    return (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}