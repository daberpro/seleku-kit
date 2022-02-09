import { dabComPlugin } from "dabcom/vite-plugin/plugin.js";
import { sassPlugin } from 'esbuild-sass-plugin'
import { build } from "esbuild";
import * as fs from "fs";
import * as path from "path";
import { config as Config} from "./build.config.js";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);

export const config = {
    entryPoints: ['source/app.js'],
    bundle: true,
    outdir: "dist",
    plugins: [dabComPlugin, sassPlugin()],
    platform: "browser",
    loader: {
        ".js": "js",
        ".css": "css",
        '.svg': 'dataurl',
        ".png": "dataurl"
    },
    minify: Config.minify,
    entryNames: '[name]-bundle',
}

if(args[0] === "--production"){

    if(args[1] !== void 0 || args[1] !== null){

        (!fs.existsSync(__dirname+`/${Config.outDir}`))? fs.mkdirSync(__dirname+`/${Config.outDir}`) : 0;
        fs.copyFileSync(__dirname+`/${Config.mainServerFile}`,__dirname+`/${Config.outDir}/server.js`);
    
        config.outdir = `/${Config.outDir}/${config.outdir}`;
        await build(config).catch(() => process.exit(1))
        await fs.copyFileSync(__dirname+`/${Config.html}`,__dirname+`/${config.outdir}/index.html`);

    }

}else{

    build(config).catch(() => process.exit(1))

}
