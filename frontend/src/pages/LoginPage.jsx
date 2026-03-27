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
      <div className="absolute inset-0 bg-white/60" />

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

      <footer className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center border-t-2 border-red-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-md sm:text-base">
        <p className="tracking-wide">
          Made by{" "}
          <a
            href="https://www.linkedin.com/in/shashwat-singh-57220420b/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-red-600 underline hover:text-red-700"
          >
            Shashwat Singh
          </a>
        </p>
      </footer>
    </div>
  );
}
