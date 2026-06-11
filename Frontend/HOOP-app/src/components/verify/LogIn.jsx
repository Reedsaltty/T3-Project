import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login({ onSwitchView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("/home"); }, 800);
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
          <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Forgot password?</a>
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

      <div className="flex items-center gap-4 mt-8 text-sm text-gray-500">
        <div className="h-px bg-gray-200 flex-1" />
        <p>Don't have an account? <button onClick={onSwitchView} className="text-blue-600 font-semibold hover:underline">Sign up</button></p>
        <div className="h-px bg-gray-200 flex-1" />
      </div>
    </div>
  );
}
