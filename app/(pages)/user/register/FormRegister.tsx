"use client";

import JustValidate from "just-validate";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import Link from "next/dist/client/link";

export const FormRegister = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. Khởi tạo Validator
    const validator = new JustValidate("#registerForm", {
      validateBeforeSubmitting: true,
    });

    // 2. Thiết lập quy tắc kiểm tra
    validator
      .addField("#fullName", [
        { rule: "required", errorMessage: "Vui lòng nhập họ tên!" },
        { rule: "minLength", value: 5, errorMessage: "Vui lòng nhập ít nhất 5 ký tự!" },
        { rule: "maxLength", value: 50, errorMessage: "Vui lòng nhập tối đa 50 ký tự!" },
      ])
      .addField("#email", [
        { rule: "required", errorMessage: "Vui lòng nhập email!" },
        { rule: "email", errorMessage: "Email không đúng định dạng!" },
      ])
      .addField("#password", [
        { rule: "required", errorMessage: "Vui lòng nhập mật khẩu!" },
        { rule: "minLength", value: 8, errorMessage: "Mật khẩu phải có ít nhất 8 ký tự!" },
        {
          rule: "customRegexp",
          value: /[a-z]/,
          errorMessage: "Mật khẩu phải chứa ký tự thường!",
        },
        {
          rule: "customRegexp",
          value: /[A-Z]/,
          errorMessage: "Mật khẩu phải chứa ký tự hoa!",
        },
        {
          rule: "customRegexp",
          value: /\d/,
          errorMessage: "Mật khẩu phải chứa chữ số!",
        },
        {
          rule: "customRegexp",
          value: /[^A-Za-z0-9]/,
          errorMessage: "Mật khẩu phải chứa ký tự đặc biệt!",
        },
      ])
      // 3. Xử lý khi dữ liệu hợp lệ
      .onSuccess(async (event: any) => {
        const formData = event.target;
        const dataFinal = {
          fullName: formData.fullName.value,
          email: formData.email.value,
          password: formData.password.value,
        };

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataFinal),
          });

          const data = await response.json();

          if (data.code === "error") {
            toast.error(data.message);
          } else if (data.code === "success") {
            toast.success("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
            
            setTimeout(() => {
              router.push("/user/login");
            }, 1500);
          }
        } catch (error) {
          console.error("Lỗi đăng ký:", error);
          toast.error("Không thể kết nối đến máy chủ Supabase!");
        }
      });

    return () => {
      validator.destroy();
    };
  }, [router]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <form className="grid grid-cols-1 gap-y-[15px]" id="registerForm">
        {/* Họ tên */}
        <div>
          <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
            Họ tên *
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Nguyễn Văn A"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black focus:border-indigo-600 outline-none transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="name@example.com"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black focus:border-indigo-600 outline-none transition-all"
          />
        </div>

        {/* Mật khẩu */}
        <div>
          <label htmlFor="password" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mật khẩu *
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black focus:border-indigo-600 outline-none transition-all"
          />
        </div>

        {/* Nút đăng ký */}
        <div>
          <button className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white shadow-md">
            Đăng ký tài khoản
          </button>
        </div>
        {/* MỤC THÊM MỚI: Điều hướng sang trang Login */}
        <div className="text-center mt-[10px]">
          <span className="text-[14px] text-gray-500 font-[500]">
            Bạn đã có tài khoản?{" "}
            <Link 
              href="/user/login" 
              className="text-indigo-600 hover:text-indigo-800 font-[700] transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </span>
        </div>
      </form>
    </>
  );
};