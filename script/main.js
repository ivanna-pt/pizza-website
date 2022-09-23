//Navbar shrink
let prevScrollpos = window.scrollY;
window.onscroll = function() {
    const currentScrollPos = window.scrollY;
    const navbarCollapsible = document.querySelector("#navBar")
    if (prevScrollpos > currentScrollPos) {
        navbarCollapsible.style.top = "0";
        navbarCollapsible.classList.add('shrink');
    } else {
        navbarCollapsible.style.top = "-100px";
    }
    if(currentScrollPos < 1){
        navbarCollapsible.classList.remove('shrink');
    }
    prevScrollpos = currentScrollPos;
}

//Navbar toggle
const menuLinks = document.querySelectorAll('.nav-link');
menuLinks.forEach(element => element.addEventListener('click', toggleMenu));



function toggleMenu(e){
    menuLinks.forEach(element => element.classList.remove('active'));
    e.target.classList.add('active');
    showBurgerMenu();
}

const menuBtn = document.querySelector('.menu-btn');
const hamburger = document.querySelector('.menu-btn__burger');
const nav = document.querySelector('.navbar-collapse');
const menuNav = document.querySelector('.navbar-nav');
const menuItems = document.querySelectorAll('.nav-item')

menuBtn.addEventListener('click', showBurgerMenu);

let showMenu = false;
function showBurgerMenu(){
    if(!showMenu){
        hamburger.classList.add('open');
        nav.classList.add('open');
        menuNav.classList.add('open');
        menuItems.forEach(item => item.classList.add('open'));

        showMenu = true;
    } else{
        hamburger.classList.remove('open');
        nav.classList.remove('open');
        menuNav.classList.remove('open');
        menuItems.forEach(item => item.classList.remove('open'));

        showMenu = false;
    }
}