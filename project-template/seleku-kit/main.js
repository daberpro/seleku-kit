import { Render,dabMain } from "dabcom/res/dabMain.js";
import "./style.css";

function Welcome(){

    return  <div class="box" on:click="{()=>{
                console.log('i am clicked')
            }}">
                <h1>hello world</h1>
            </div>

}

Render(<Welcome></Welcome>,document.body);