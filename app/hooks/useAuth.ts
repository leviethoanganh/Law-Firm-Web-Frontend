import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [infoUser, setInfoUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Gọi API kiểm tra trạng thái đăng nhập từ Server
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      credentials: "include", // Quan trọng: Gửi kèm Cookie chứa JWT để Server xác thực
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("--- Dữ liệu từ Auth Check API ---", data); // CHECK DÒNG NÀY
        if (data.code === "error") {
          setIsLogin(false);
          setInfoUser(null);
          router.push("/user/login");
        }
        if(data.code == "success") {
          setIsLogin(true);
          if(data.data) {
            setInfoUser(data.data);
          }
          setIsLogin(true);
          // Đảm bảo fullName luôn có giá trị
          const userPayload = {
            ...data.data
          };
          setInfoUser(userPayload);
          console.log("--- InfoUser sau khi setState ---", userPayload); // CHECK DÒNG NÀY
        }
      })
  }, [pathname]);
// Chạy lại mỗi khi người dùng chuyển trang để cập nhật trạng thái

  return {
    isLogin: isLogin,
    infoUser: infoUser
  };
};
