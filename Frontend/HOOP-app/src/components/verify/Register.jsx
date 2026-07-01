import { useState } from "react";
import { Eye, EyeOff, CheckCircle2, XCircle, Circle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/api/auth.api";

export default function Register({ onSwitchView }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const hasMinLength  = password.length >= 8;
  const hasUpperCase  = /[A-Z]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

  const requirements = [
    { label: "At least 8 characters",   met: hasMinLength },
    { label: "One uppercase letter",    met: hasUpperCase },
    { label: "One special character",   met: hasSpecialChar },
  ];

  async function handleRegister(e) {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (!hasMinLength || !hasUpperCase || !hasSpecialChar) {
      setError("Password does not meet the requirements."); return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await registerUser({ username: name, email, password });
      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => onSwitchView(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-gray-900 tracking-tight mb-2">Create your account</h2>
        <p className="text-sm text-gray-500">Start planning your events with Hoop today.</p>
      </div>

      <form onSubmit={handleRegister} noValidate className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="register-name">Full Name <span className="text-red-500">*</span></Label>
          <Input
            id="register-name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">Email <span className="text-red-500">*</span></Label>
          <Input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Password <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="pr-10"
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

        {/* Password requirements */}
        <ul className="flex flex-col gap-1.5 mt-2">
          {requirements.map((req, i) => (
            <li key={i} className="flex items-center gap-2 text-xs">
              {password.length === 0
                ? <Circle size={13} className="text-gray-300" />
                : req.met
                ? <CheckCircle2 size={13} className="text-green-500" />
                : <XCircle size={13} className="text-red-500" />}
              <span className={password.length === 0 ? "text-gray-400" : req.met ? "text-green-600" : "text-red-500"}>
                {req.label}
              </span>
            </li>
          ))}
        </ul>

        {error && <p className="text-sm text-red-500 font-medium mt-1">{error}</p>}
        {success && <p className="text-sm text-emerald-600 font-medium mt-1">{success}</p>}

        <Button
          id="register-submit"
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-4 gap-2"
        >
          {loading ? "Creating account…" : <>Create Account <ArrowRight size={16} /></>}
        </Button>
      </form>

      <div className="flex items-center gap-4 mt-8 text-sm text-gray-500">
        <div className="h-px bg-gray-200 flex-1" />
        <p>Already have an account? <button onClick={onSwitchView} className="text-blue-600 font-semibold hover:underline">Log in</button></p>
        <div className="h-px bg-gray-200 flex-1" />
      </div>
    </div>
  );
}