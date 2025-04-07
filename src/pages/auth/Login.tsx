// src/pages/auth/Login.tsx
import KakaoLoginButton from "../../components/KakaoLoginButton.tsx";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">로그인</h1>
      <KakaoLoginButton />
    </div>
  );
};

export default Login;
