console.clear();

import { default as express } from "express";
const App = express();
import { default as nodemon } from "nodemon";
import { fileURLToPath } from 'url';
import { default as chalk } from "chalk";
import * as fs from "fs";
import { default as ip } from "ip";
import path from "path";
import { build } from "esbuild";
import { config } from "./esbuild.config.js";
const PORT = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

App.use("/", express.static(__dirname + "/dist/"))

App.get("/*", (req, res) => {

    res.sendFile(__dirname + "/source/index.html");

});

App.listen(PORT, "0.0.0.0", () => {

    console.log(chalk.green("\n\t Seleku kit version " + JSON.parse(fs.readFileSync(__dirname + "/node_modules/dabcom/package.json")).version));
    console.log(`\t server run at ${chalk.blue(`127.0.0.1:${PORT}`)} or ${chalk.blue(`localhost:${PORT}`)}`);
    console.log(`\t in local network ${chalk.blue(`${ip.address()}:${PORT}`)}\n`);

})

nodemon('--ignore node_modules --ignore dist --watch source/ -e "js css scss json png jpg svg"');
nodemon.on("start", () => {

    console.log(chalk.yellow("\ncompiling..."));

});

