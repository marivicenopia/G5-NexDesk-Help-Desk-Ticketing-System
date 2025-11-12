import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // C# API URL (updated to correct port)
        changeOrigin: true,
        secure: false, // Set to false since using HTTP not HTTPS
      },
    },
  },
  define: {
    // Define environment variables for the frontend
    __API_BASE_URL__: JSON.stringify("http://localhost:5000"),
  },
});