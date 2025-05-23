import type { FormEvent } from "react";
import React, { useState } from "react";
import { MdOutlinePerson } from 'react-icons/md';
import { MdOutlineLock } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../../services/auth/AuthService";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const user = await AuthService.login(username.trim(), password.trim());

      if (user) {
        // Store authentication state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userId', user.id.toString());

        // Navigation with replace to prevent back button issues
        switch (user.role) {
          case "admin":
            navigate("/admin/manage/users", { replace: true });
            break;
          case "agent":
            navigate("/agent/dashboard", { replace: true });
            break;
          case "user":
            navigate("/user/dashboard", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("Invalid username or password");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-sm bg-[#031849] text-white text-2xl font-bold">N</span>
          <span className="text-2xl font-bold text-[#031849] tracking-wide">NexDesk</span>
        </div>
        <div className="w-full max-w-md">
          <h2 className="text-6xl font-bold mb-15 text-center text-[#031849]">Sign In</h2>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <MdOutlinePerson className="text-xl text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full outline-none bg-transparent"
                required
              />
            </div>
            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <MdOutlineLock className="text-xl text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none bg-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#031849] hover:bg-[#192F64] text-white font-medium py-2 rounded-md transition mt-5 cursor-pointer"
            >
              SIGN IN
            </button>
          </form>

          {/* <p className="text-center mt-6 text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#031849] font-medium hover:underline">
              Register
            </Link>
          </p> */}
        </div>
      </div>

      {/* Right Panel - Design */}
      <div className="hidden md:flex w-1/2 bg-[#031849] text-white items-center justify-center p-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg max-w-md mx-auto">
            Manage your help desk tickets with ease.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;