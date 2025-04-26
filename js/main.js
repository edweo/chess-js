import GameMenu from "./visual/game_configure_menu.js";

const navBar = document.querySelector('#navigation-bar');
const header = document.querySelector("#header");
const hamburger_btn = document.getElementById('hamburger-button');
const main_section = document.querySelector('#main-section');
let navBarOpened = false;

let scrollBefore = 0;

hamburger_btn.onclick = function() {

    if (getComputedStyle(navBar).display == 'none')
    {
        openNavBar();
    }
    else
    {
        closeNavBar();
    }
}

function enableNavBar()
{
    if (document.documentElement.clientWidth > 468)
    {
        navBar.style.display = 'flex';
    }
    else if (document.documentElement.clientWidth <= 468) 
    {
        navBar.style.display = 'none';
    }
}

function closeNavBar() 
{   
    navBarOpened = false;
    navBar.style.display = 'none';
    hamburger_btn.blur();
}

function openNavBar() 
{
    navBarOpened = true;
    navBar.style.display = 'flex';
}

function scrollHeaderStick() {
    const scrolled = window.scrollY;
    
    // Scroll up
    if (scrolled < scrollBefore) {
        scrollBefore = scrolled;
        stickHeaderBarToTop();
    } 
    // Scroll down
    else if (scrolled > 150+scrollBefore && !navBarOpened) {
        scrollBefore = scrolled;
        unstickHeaderBarToTop();
        closeNavBar();
    }
}

function stickHeaderBarToTop() {
    header.removeAttribute('class');
    if (window.screen.width > 468) {
        openNavBar();
        navBarOpened = false;
    }
}

function unstickHeaderBarToTop() {
    header.className = "header-hidden";
}

window.addEventListener('resize', enableNavBar);
window.addEventListener('scroll', scrollHeaderStick);
// hamburger_btn.addEventListener('focusout', closeNavBar);

const game_configute_menu = new GameMenu()
