const { dabComPlugin } = require("dabcom/vite-plugin/plugin.js");

require('esbuild').serve({
    servedir: 'dist',
    port: 8000
  },{
    entryPoints: ['main.js'],
    bundle: true,
    outdir:"dist",
    plugins: [dabComPlugin],
    platform: "browser",
    loader: {
        ".js": "js",
        ".css": "css"
    },
    entryNames: '[name]-bundle',
  }).catch(() => process.exit(1))