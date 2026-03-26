import { build } from 'esbuild';
import path from 'path';

async function buildServer() {
  await build({
    entryPoints: ['server.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: 'dist/server.js',
    format: 'esm',
    external: ['vite', 'fsevents'],
    banner: {
      js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
    },
  });
}

buildServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
