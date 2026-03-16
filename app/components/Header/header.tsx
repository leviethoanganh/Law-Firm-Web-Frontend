"use client";

import { LogOut, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/hooks/useAuth"; 
import Link from "next/link";

export const Header = () => {
  const router = useRouter();
  
  // Lấy dữ liệu thực tế từ hook useAuth
  const { isLogin, infoUser } = useAuth();

  const handleLogout = () => {
    // Gọi API logout để Server xóa HttpOnly Cookie
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, { // Cập nhật đúng route /user/logout của bạn
      credentials: "include",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("--- InfoUser trong Header ---", infoUser); // CHECK DÒNG NÀY
      if (data.code === "success") {
        router.push('/user/login');
      }
    })
    .catch((error) => {
      console.error("Lỗi khi đăng xuất:", error);
    });
  };

  // Nếu chưa đăng nhập, không hiển thị Header này
  if (!isLogin) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Logo & Brand: Minh Nguyen Law */}
        <div className="flex items-center gap-3">
          <Link href="/home" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 leading-tight">Minh Nguyen Law</h1>
              <p className="text-xs text-gray-500 font-medium">Internal Portal</p>
            </div>
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-6">
          
          {/* Points Display: Hiển thị điểm từ bảng account_users */}
          <div className="text-right hidden sm:flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            <Award className="w-4 h-4 text-indigo-600" />
            <div>
              <span className="text-indigo-600 font-bold">{infoUser?.points || 0}</span>
              <span className="text-[10px] text-indigo-400 font-bold ml-1 uppercase">pts</span>
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                {infoUser?.fullName || infoUser?.full_name || "Guest"}
              </p>
              <p className="text-[11px] text-gray-400 font-medium">
                {infoUser?.email}
              </p>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};