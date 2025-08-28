import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Top-level components folder for imports like "@/components/ui" or "@/components/ui/card"
      "@/components": path.resolve(__dirname, "./components"),
      // src-level context folder for imports like "@/context/DataContexts"
      "@/context": path.resolve(__dirname, "./src/context"),
      // Generic alias to src for other app modules
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
