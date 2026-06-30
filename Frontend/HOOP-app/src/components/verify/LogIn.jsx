import { useEffect , useState } from "react";
import axios from "axios";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/api/auth.api";
import { useAuth } from "../../context/AuthContext";

export default function Login({ onSwitchView }) {
  const { loginContext } = useAuth();
  const [view, setView] = useState("login"); // "login" or "reset_password"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(email,password)
      console.log('Login sucess', data)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        loginContext(data.user);
      }
      setLoading(false)
      navigate("/")
    }catch(err){
      console.error(err)
      setError(err.response?.data?.message || "Failed to login")
      setLoading(false)
    
    }

  }

  function handleResetPassword(e) {
    e.preventDefault();
    if (!email) { setError("Please enter your email."); return; }
    setError("");
    setSuccess("");
    setLoading(true);

    // Mock reset password
    setTimeout(() => {
      setLoading(false);
      setSuccess("If that email is in our database, we have sent a reset link to it.");
    }, 500);
  }

  const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.654-3.343-11.303-8l-6.571 4.819C9.656 39.663 16.318 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );

  const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5 fill-current">
      <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25v178.72A162.55 162.55 0 1 1 162.6 181.79V284c-35.09-12.72-73.49-14-106.31-2.91v112.56c38.5 13 83.19 12 121.2-3.15V0h113.88a183.05 183.05 0 0 0 156.63 151.72z" />
    </svg>
  );

  if (view === "reset_password") {
    return (
      <div className="w-full max-w-sm flex flex-col">
        <div className="mb-8">
          <button onClick={() => { setView("login"); setError(""); setSuccess(""); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to login
          </button>
          <h2 className="text-3xl font-heading font-bold text-gray-900 tracking-tight mb-2">Reset Password</h2>
          <p className="text-sm text-gray-500">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleResetPassword} noValidate className="flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); setSuccess(""); }}
              className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          {success && <p className="text-sm text-emerald-600 font-medium">{success}</p>}

          <Button
            id="reset-submit"
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2"
          >
            {loading ? "Sending link…" : "Send Reset Link"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-gray-900 tracking-tight mb-2">Welcome back</h2>
        <p className="text-sm text-gray-500">Log in to your Hoop account to continue planning.</p>
      </div>

      <form onSubmit={handleLogin} noValidate className="flex flex-col gap-5">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email <span className="text-red-500">*</span></Label>
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password">Password <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className={`pr-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-[-8px]">
          <button type="button" onClick={() => { setView("reset_password"); setError(""); setSuccess(""); }} className="text-xs font-semibold text-blue-600 hover:underline">
            Forgot password?
          </button>
        </div>

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        <Button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-2 gap-2"
        >
          {loading ? "Logging in…" : <>Log In <ArrowRight size={16} /></>}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="outline" className="w-full h-11 gap-2" type="button">
          <GoogleIcon />
          Google
        </Button>
        <Button variant="outline" className="w-full h-11 gap-2" type="button">
          <TikTokIcon />
          TikTok
        </Button>
      </div>

      <div className="flex items-center gap-4 mt-8 text-sm text-gray-500">
        <div className="h-px bg-gray-200 flex-1" />
        <p>Don't have an account? <button onClick={onSwitchView} className="text-blue-600 font-semibold hover:underline">Sign up</button></p>
        <div className="h-px bg-gray-200 flex-1" />
      </div>
    </div>
  );
}
