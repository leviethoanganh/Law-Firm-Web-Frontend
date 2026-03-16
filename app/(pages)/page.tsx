import Link from 'next/link';

export default function LandingPage() {
  return (
    // Đổi bg-[#001e2b] thành bg-[#f0f9ff] (xanh nước biển cực nhạt) 
    // hoặc bg-[#e0f2fe] để có cảm giác "sạch" và chuyên nghiệp hơn
    <div className="min-h-screen bg-[#f0f9ff] text-[#0369a1] font-sans overflow-hidden flex flex-col">
      
      {/* Header điều hướng */}
      <header className="relative z-20 w-full px-8 py-6 flex justify-end gap-6 items-center">
        <Link href="/user/login" 
          className="text-sm font-bold text-[#0369a1] hover:text-[#0ea5e9] transition-colors">
          Đăng nhập
        </Link>
        <Link href="/user/register" 
          className="text-sm font-bold bg-[#0ea5e9] text-white px-6 py-2.5 rounded-full hover:bg-[#0284c7] transition-all shadow-lg shadow-blue-200">
          Đăng ký ngay
        </Link>
      </header>

      {/* Nội dung chính */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6">
        {/* Nhãn nhỏ */}
        <div className="inline-block px-4 py-1.5 mb-8 border border-[#bae6fd] rounded-full bg-[#e0f2fe]">
          <span className="text-[#0ea5e9] text-[10px] font-black uppercase tracking-[0.25em]">
            Welcome to Law Connect
          </span>
        </div>

        {/* Tiêu đề 1 dòng, chữ vừa phải */}
        <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight text-[#0c4a6e]">
          One Law Platform. <span className="text-[#0ea5e9]">Unlimited Potential.</span>
        </h1>
        
        <p className="text-[#334155] text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          Nền tảng quản lý hồ sơ pháp lý và kết nối ứng viên chuyên nghiệp, <br className="hidden md:block" /> 
          tin cậy và hiệu quả tối ưu cho doanh nghiệp.
        </p>

        {/* Hiệu ứng mảng màu xanh nước biển nhạt tạo chiều sâu */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-200/40 blur-[120px] rounded-full pointer-events-none"></div>
      </main>

      <footer className="relative z-10 py-10 text-center text-[#94a3b8] text-[10px] tracking-[0.3em] uppercase font-bold">
        © 2026 Law Connect Platform. All rights reserved.
      </footer>
    </div>
  );
}