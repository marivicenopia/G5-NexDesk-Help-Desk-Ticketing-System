import type { FormEvent } from "react";
import React, { useState } from "react";
import { MdOutlinePerson, MdOutlineLock } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../../services/auth/AuthService";

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
      // Make API call to authenticate user
      const response = await fetch(`/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const user = data.user;

      console.log("Found user:", user);

      if (user && user.isActive) {
        console.log("User authenticated, navigating to:", user.role);
        // Store authentication data
        AuthService.login(user.id.toString(), user.role, user.email, user.department);

        // Navigate based on rolei
        switch (user.role) {
          case "Admin":
            console.log("Navigating to admin dashboard");
            navigate("/admin", { replace: true });
            break;
          case "Agent":
            console.log("Navigating to agent dashboard");
            navigate("/agent", { replace: true });
            break;
          case "Staff":
            console.log("Navigating to staff dashboard");
            navigate("/user", { replace: true });
            break;
          default:
            console.log("Unknown role, navigating to home");
            navigate("/", { replace: true });
        }
      } else if (user && !user.isActive) {
        setError("Account is deactivated. Please contact administrator.");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("Unable to connect to server. Please try again.");
      console.error("Login error:", error);
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