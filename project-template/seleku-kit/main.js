import { Render, dabMain, findById } from "dabcom/res/dabMain.js";
import "./style.css";

function Welcome() {

    return <div class="hero">
        <div class="box">
            <h1>hello Seleku-kit</h1>
            <p>
                seleku-kit adalah generasi selanjutnya dari
                seleku dan ini merupakan framework yang sangat sederhana
                dan lebih cepat dari sebelumnya
            </p>
        </div>
        <hr></hr>
        <div class='container'>
            <h2 state="{{count: 17}}" component:id="counting">Count ${this.state.count}</h2>
            <button on:click="{function(){
                findById('counting').state.count++;
            }}">Add count</button>
        </div>
    </div>



}

Render(<Welcome></Welcome>, document.body);