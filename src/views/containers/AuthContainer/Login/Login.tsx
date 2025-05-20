import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { dummyUsers } from "../../../../data/dummyUsers";
import { AuthService } from "../../../../services/auth/AuthService";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const matchedUser = dummyUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (matchedUser) {
      AuthService.login(matchedUser.role);

      switch (matchedUser.role) {
        case "admin":
          navigate("/admin/manage/users"); 
          break;
        case "agent":
          navigate("/agent/dashboard");
          break;
        case "user":
          navigate("/user/dashboard");
          break;
        default:
          navigate("/");
      }
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">LOGIN</h2>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-[#031849] hover:bg-[#192F64] text-white font-semibold py-2 rounded-md transition"
            >
              Login
            </button>
          </div>

          <p className="text-center mt-6 text-gray-600 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-[#031849] font-medium hover:underline">
              Register
            </Link>
          </p>
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
