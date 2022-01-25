import { dabMain } from "dabcom/res/dabMain.js";
import logo from "../logo.png";
import { Navbar } from "./navbar.js";
import { MainContent } from "./content.js";
import { Info } from "./info.js";

export function Welcome({nama}) {

    return <div class="'hero'" component:id="a">
        
        <Navbar></Navbar>
        <MainContent></MainContent>
        <Info></Info>

    </div>

}
