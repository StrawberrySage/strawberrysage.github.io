//import {Tween, Easing} from 'https://unpkg.com/browse/@tweenjs/tween.js@23.1.3/dist/tween.esm.js';

function setPageVisible(page){
    if (document.getElementById(page)){
        const element = document.getElementById(page)
        element.style.display = "block";
    }
    else{
        console.log(");")
        setPageVisible("home");
    }
}

function load(){
    if (location.hash){
        let hash = location.hash.substring(1);
        setPageVisible(hash);
    }
    else{
        setPageVisible("home");
    }
}

function hashchange(event){
    let hash = location.hash.substring(1);
    console.log(hash);
    for (element of document.getElementsByClassName("shadow")) {
        element.style.display = "none";
    }
    setPageVisible(hash);
}

addEventListener("hashchange", hashchange);