import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#001e2b] text-white flex flex-col items-center justify-center font-sans">
      {/* Background hiệu ứng nhẹ giống MongoDB */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00684a22] via-transparent to-transparent pointer-events-none"></div>

      <main className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          One data platform. <br />
          <span className="text-[#00ed64]">Unlimited AI potential.</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Chào mừng bạn đến với Law Connect. Hệ thống quản lý hồ sơ và ứng viên chuyên nghiệp.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/user/login" 
            className="bg-[#00ed64] text-[#001e2b] px-8 py-3 rounded-md font-bold text-lg hover:bg-[#00c552] transition-all">
            Đăng nhập ngay
          </Link>
          
          <Link href="/user/register" 
            className="border border-gray-500 px-8 py-3 rounded-md font-bold text-lg hover:bg-white/10 transition-all">
            Tạo tài khoản mới
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-gray-500 text-sm">
        © 2026 Law Connect Platform. All rights reserved.
      </footer>
    </div>
  );
}