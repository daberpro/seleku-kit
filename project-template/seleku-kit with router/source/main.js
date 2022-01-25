import { Render, dabMain, findById } from "dabcom/res/dabMain.js";
import { Router } from "dabcom/spa/route.js";
import { Welcome } from "./component/welcome.js";
import "./style.scss";

<Router.route
    path="'/'"
    component="<Welcome></Welcome>"
    target="{()=>{
        
        return document.body;
        
    }}"
></Router.route>;

window.addEventListener("scroll", function () {
    const distance = window.scrollY;
    findById(
        "mcontent"
    ).element.style.transform = `translateY(${distance * -0.01}px)`
    findById(
        "icontent"
    ).element.style.transform = `translateY(${distance * -0.3}px)`
    findById(
        "c1content"
    ).element.style.transform = `translateY(${distance * -0.5}px)`
    findById(
        "c2content"
    ).element.style.transform = `translateY(${distance * -0.4}px)`
    
})