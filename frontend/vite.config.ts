import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    // https:
    // {
    //   key: fs.readFileSync(path.resolve(__dirname, 'D:/Projects/Quizzard/localhost.key')), 
    //   cert: fs.readFileSync(path.resolve(__dirname, 'D:/Projects/Quizzard/localhost.crt')),
    // },
    port: 5173,
    cors: {
      origin: 'http://localhost:5173',  
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Authorization', 'Content-Type'],
      credentials: true, 
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
});
