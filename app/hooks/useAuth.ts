import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [infoUser, setInfoUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Gọi API kiểm tra trạng thái đăng nhập từ Server
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      credentials: "include", 
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "error") {
          setIsLogin(false);
          setInfoUser(null);
          // Đẩy về trang login nếu token lỗi
          router.push("/user/login");
        } else if (data.code === "success") {
          setIsLogin(true);
          const userPayload = { ...data.data };
          setInfoUser(userPayload);
        }
      })
      .catch((err) => {
        console.error("Auth check error:", err);
      });
  // THÊM router VÀO ĐÂY ĐỂ VERCEL HẾT BÁO LỖI
  }, [pathname, router]); 

  return {
    isLogin: isLogin,
    infoUser: infoUser
  };
};