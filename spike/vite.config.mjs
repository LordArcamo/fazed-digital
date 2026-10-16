import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { threeSlim } from '../src/field/three-plugin.mjs';
const here = fileURLToPath(new URL('.', import.meta.url));
const stock = !!process.env.STOCK_THREE;
export default defineConfig({
  root: here,
  plugins: stock ? [] : [threeSlim()],
  publicDir: fileURLToPath(new URL('../public', import.meta.url)),
  build: { outDir: fileURLToPath(new URL('./dist', import.meta.url)), emptyOutDir: true, target: 'es2022', modulePreload: false, sourcemap: !!process.env.MAP },
  server: { port: 4351, strictPort: true, fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] } },
  preview: { port: 4352, strictPort: true },
});
