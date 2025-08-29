import React, { useState } from "react";
import { useAuth } from "../../src/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Loader2 } from "lucide-react";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginAdmin, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin({ email, password });
      navigate("/dashboard/admin");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-purple-600 text-white rounded-xl shadow-inner">
              <Shield className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center mb-2">Admin Sign In</h1>
          <p className="text-center text-sm text-gray-500 mb-6">Access the admin dashboard</p>
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4 text-center text-sm border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError && clearError(); }}
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="admin@company.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError && clearError(); }}
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-md hover:bg-purple-700 transition-colors shadow"
            >
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>) : "Sign In"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">Only authorized administrators can sign in.</p>
      </div>
    </div>
  );
};

export default LoginAdmin;
