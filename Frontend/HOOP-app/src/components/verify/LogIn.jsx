import { useState } from "react";
import {  Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login({ onSwitchView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    // Redirect to the home page after login
    navigate("/home");
  }

  return (
    <div className="w-full max-w-md h-full rounded-3xl p-10 flex flex-col justify-center" style={{ backgroundColor: "#d9d9d9" }}>
      <h2 className="text-2xl font-bold text-black mb-2">Welcome Back</h2>
      <p className="text-sm text-black opacity-50 mb-8">
        Log in to your account to continue
      </p>

      <form onSubmit={handleLogin} noValidate>
        <div className="mb-5">
          <label className="block text-sm font-normal text-black mb-1">
            Email <span style={{ color: "#cd1e1e" }}>*</span>
          </label>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className="w-full h-11 px-4 rounded-lg outline-none text-sm text-black placeholder-[#8b8b8b]"
            style={{ backgroundColor: "#fffefe", border: "none" }}
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-normal text-black mb-1">
            Password <span style={{ color: "#cd1e1e" }}>*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full h-11 px-4 pr-11 rounded-lg outline-none text-sm text-black placeholder-[#8b8b8b]"
              style={{ backgroundColor: "#fffefe", border: "none" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <a href="#" className="text-xs text-black underline opacity-60 hover:opacity-100">
            Forgot password?
          </a>
        </div>

        {error && <p className="text-xs mb-4" style={{ color: "#c80208" }}>{error}</p>}

        <button
          type="submit"
          className="w-full h-11 rounded-lg text-sm font-normal text-black transition-opacity hover:opacity-80 mb-5"
          style={{ backgroundColor: "#fffefe" }}
        >
          Log In
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-black" />
        <p className="text-xs text-black whitespace-nowrap">
          Don't have an account?{" "}
          <button onClick={onSwitchView} className="underline font-medium cursor-pointer">Sign Up</button>
        </p>
        <div className="flex-1 h-px bg-black" />
      </div>
    </div>
  );
}

