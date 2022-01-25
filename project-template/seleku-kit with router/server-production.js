import { default as express } from "express";
const App = express();
import { fileURLToPath } from 'url';
import path from "path";
const PORT = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

App.use("/", express.static(__dirname + "/dist/"))

App.get("/*", (req, res) => {

    res.sendFile(__dirname + "/dist/index.html");

});

App.listen(PORT, "0.0.0.0", () => console.log("server running at port "+PORT));
