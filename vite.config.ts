import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // --- ADD THIS SERVER BLOCK TO YOUR CONFIG ---
  server: {
    proxy: {
      // This rule means:
      // If the frontend development server receives a request path that starts with /api
      '/api': {
        target: 'http://localhost:3001', // ...forward that request to your backend server running on port 3001
        changeOrigin: true, // This is often needed for the request headers to look correct to the backend
        // rewrite: (path) => path.replace(/^\/api/, '/api'), // This rewrite keeps /api in the path sent to the backend
                                                            // (Remove or change this if your backend expects a different path)
         // A common alternative rewrite if your backend endpoint was just '/'
         // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // You can add more proxy rules here if needed
    }
  }
  // --- END OF SERVER BLOCK ---
});