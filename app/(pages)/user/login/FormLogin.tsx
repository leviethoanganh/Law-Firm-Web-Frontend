"use client";

import JustValidate from "just-validate";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner"; // Sử dụng sonner cho thông báo chuyên nghiệp hơn alert
import Link from "next/dist/client/link";

export const FormLogin = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. Khởi tạo bộ kiểm tra dữ liệu
    const validator = new JustValidate("#loginForm", {
      validateBeforeSubmitting: true,
    });

    validator
      .addField("#email", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập email!",
        },
        {
          rule: "email",
          errorMessage: "Email không đúng định dạng!",
        },
      ])
      .addField("#password", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập mật khẩu!",
        },
      ])
      // 2. Thực thi khi dữ liệu hợp lệ
      .onSuccess(async (event: any) => {
        const formData = event.target;
        const dataFinal = {
          email: formData.email.value,
          password: formData.password.value,
        };

        try {
          // Gửi yêu cầu tới Server (đã được bạn cấu hình Supabase ở Backend)
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataFinal),
            credentials: "include", // Quan trọng để nhận Cookie Token từ Backend
          });

          const data = await response.json();

          if (data.code === "error") {
            toast.error(data.message);
          } else if (data.code === "success") {
            toast.success("Đăng nhập thành công! Đang chuyển hướng...");
            
            // Chuyển hướng sang trang chủ sau một khoảng thời gian ngắn
            setTimeout(() => {
              router.push("/home");
            }, 1000);
          }
        } catch (error) {
          console.error("Lỗi đăng nhập:", error);
          toast.error("Không thể kết nối đến máy chủ!");
        }
      });

    // Dọn dẹp validator khi component unmount
    return () => {
      validator.destroy();
    };
  }, [router]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <form className="grid grid-cols-1 gap-y-[15px]" id="loginForm">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black focus:border-[#0088FF] outline-none transition-all"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mật khẩu *
          </label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black focus:border-[#0088FF] outline-none transition-all"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button 
            type="submit"
            className="bg-[#0088FF] hover:bg-[#0077ee] active:scale-[0.98] cursor-pointer transition-all rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white shadow-md"
          >
            Đăng nhập
          </button>
        </div>

        <div className="text-center mt-[10px]">
          <span className="text-[14px] text-gray-500 font-[500]">
            Bạn chưa có tài khoản?{" "}
            <Link 
              href="/user/register" 
              className="text-[#0088FF] hover:text-[#0077ee] font-[700] transition-colors"
            >
              Đăng ký ngay
            </Link>
          </span>
        </div>
      </form>
    </>
  );
};