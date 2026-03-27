import { GoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { loginWithGoogleCredential, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSuccess = async (response) => {
    try {
      await loginWithGoogleCredential(response.credential);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/college-campus.jpg')" }}
      />
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border-2 border-red-200 bg-white/95 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-600">
            <span className="text-4xl font-bold text-white">ti</span>
          </div>
          <h1 className="text-3xl font-bold text-red-700">
            Smart Lab Inventory
          </h1>
          <p className="mt-1 text-sm font-semibold text-red-600">
            Thapar Institute
          </p>
          <p className="mt-3 text-sm text-zinc-600">
            Sign in with your authorized Thapar account
          </p>
          <div className="mt-8 flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => toast.error("Google login cancelled")}
            />
          </div>
          <p className="mt-6 text-xs text-zinc-500">
            Only whitelisted @thapar.edu users can access the system.
          </p>
        </div>
      </div>
    </div>
  );
}
