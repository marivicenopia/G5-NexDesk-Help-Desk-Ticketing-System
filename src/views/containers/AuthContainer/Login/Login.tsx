import type { FormEvent } from "react";
import React, { useState } from "react";
import { MdOutlinePerson, MdOutlineLock } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../../services/auth/AuthService";

// Interface for C# API response structure
interface ApiResponse<T> {
  status: 'Success' | 'Error' | 0 | 1; // C# enum: 0 = Success, 1 = Error
  message: string;
  response: T;
}

// Interface for C# login response
interface LoginResponseModel {
  userId: string;
  email: string;
  role: string;
  departmentId: string;
  fullName: string;
  isActive: boolean;
  token?: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Updated to use C# backend AuthController API
      const response = await fetch(`http://localhost:5000/api/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      console.log("Available users:", "C# Backend Integration");
      console.log("Looking for:", { username: username.trim(), password: password.trim() });
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const result: ApiResponse<LoginResponseModel> = await response.json();
      console.log("Backend response:", result);

      // C# backend returns status as number: 0 = Success, 1 = Error
      if (response.ok && (result.status === 'Success' || result.status === 0) && result.response) {
        const user = result.response;
        console.log("Found user:", user);

        if (user && user.isActive) {
          console.log("User authenticated, navigating to:", user.role);
          console.log("Full user object:", user);
          console.log("User isActive:", user.isActive);
          console.log("JWT Token received:", user.token ? "Yes" : "No");

          // Store authentication data with JWT token
          AuthService.login(user.userId, user.role, user.email, user.departmentId, user.fullName, user.token);
          console.log("AuthService.login completed with JWT token");

          // Navigate based on role - keeping your exact logic (case-insensitive)
          const userRole = user.role.toLowerCase();
          switch (userRole) {
            case "admin":
            case "superadmin":
              console.log("Navigating to admin dashboard");
              navigate("/admin/dashboard", { replace: true });
              console.log("Navigation called for admin dashboard");
              break;
            case "agent":
              console.log("Navigating to agent dashboard");
              navigate("/agent/dashboard", { replace: true });
              console.log("Navigation called for agent dashboard");
              break;
            case "staff":
              console.log("Navigating to staff dashboard");
              navigate("/user/dashboard", { replace: true });
              console.log("Navigation called for staff dashboard");
              break;
            default:
              console.log("Unknown role:", userRole, "navigating to home");
              navigate("/", { replace: true });
              console.log("Navigation called for home");
          }
        } else {
          setError("Account is deactivated. Please contact administrator.");
        }
      } else {
        setError(result.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login error details:", error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError("Cannot connect to server. Make sure the C# backend is running on http://localhost:5000");
      } else {
        setError("Unable to connect to server. Please try again.");
      }
    } finally {
      setLoading(false);
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
          <h2 className="text-6xl font-bold mb-8 text-center text-[#031849]">Sign In</h2>
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            {/* Error message below password input */}
            {error && (
              <p className="text-red-600 text-center mb-2">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#031849] hover:bg-[#192F64] text-white font-medium py-2 rounded-md transition mt-5 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing in..." : "SIGN IN"}
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
          <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg max-w-md mx-auto">
            To keep connected with us, please
            sign in with your username and password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;