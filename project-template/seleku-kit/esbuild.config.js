const { dabComPlugin } = require("dabcom/vite-plugin/plugin.js");

const consoleArgument = process.argv.slice(2)[0];

const config = {
    entryPoints: ['main.js'],
    bundle: true,
    outdir: "dist",
    plugins: [dabComPlugin],
    platform: "browser",
    loader: {
        ".js": "js",
        ".css": "css",
        '.svg': 'text'
    },
    entryNames: '[name]-bundle',
}

const configServer= {
    servedir: 'dist',
    port: 8000
}

if (consoleArgument === "--development") {

    require('esbuild').serve(configServer, config).catch(() => process.exit(1))

    console.log("server running on port "+configServer.port);

}

if(consoleArgument === "--production"){

    require('esbuild').build(config).catch(() => process.exit(1))

}
