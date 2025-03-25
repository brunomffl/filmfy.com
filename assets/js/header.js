class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header id="top">
            <div class="header">
                <div class="header-content">
                    <div class="logo">
                        <a href="index.html">Filmfy<div id="dotHeader">.</div><div>com</div></a>
                    </div>
                    <div class="header-search">
                        <form>
                            <button id="header-button">
                                <img src="assets/imgs/search-icon.png" alt="Search Button">
                            </button>
                            <input type="text" id="header-input" placeholder="Busque por um filme">
                        </form>
                    </div>
                    <div class="menu">
                        <nav>
                            <div class="menu-item">
                                <a href="index.html" class="active">Home</a>
                            </div>
                            <div class="menu-item">
                                <a href="#">Profile</a>
                            </div>
                            <div class="menu-item">
                                <a href="#">Contact Us</a>
                            </div>
                            <div class="animation"></div>
                        </nav>
                        <div class="login">
                            <a href="#">Sign in</a>
                        </div>
                    </div>
                    <div class="phone-menu">
                        <div class="bar"></div>
                        <div class="bar"></div>
                        <div class="bar"></div>
                    </div>
                    <nav class="phone-links visivel">
                        <ul>
                            <li><a href="index.html"><img src="assets/imgs/home-icon.png" alt="Home"></a></li>
                            <li><a href="index.html"><img src="assets/imgs/profile-icon.png" alt="Home"></a></li>
                            <li><a href="index.html"><img src="assets/imgs/contact-icon.png" alt="Home"></a></li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div class="search-bar">
                <div class="left">
                    <form>
                        <div class="search-button">
                            <button>
                                <img src="assets/imgs/search-icon.png" alt="Search Button">
                            </button>
                        </div>
                        <div class="search-input">
                            <input type="text" id="search" placeholder="Busque por um filme">
                        </div>
                    </form>
                    <div class="search-goup">
                        <img src="assets/imgs/arrowUp-icon.png" alt="">
                    </div>
                </div>
                <div class="right">
                    <div class="search-menu">
                        <div class="home">
                            <a href="index.html" class="active">
                                <img src="assets/imgs/home-icon.png" alt="Home">
                            </a>
                        </div>
                        <div class="profile">
                            <a href="#">
                                <img src="assets/imgs/profile-icon.png" alt="Profile">
                            </a>
                        </div>
                        <div class="contact">
                            <a href="#">
                                <img src="assets/imgs/contact-icon.png" alt="Contact">
                            </a>
                        </div>
                        <div class="search-animation"></div>
                    </div>
                </div>
            </div>
        </header>`;
    }
}

customElements.define('main-header', Header);

const searchBar = document.querySelector('.search-bar');
const header = document.querySelector('.header-content');


window.addEventListener("scroll", () => {
    let scroll = window.scrollY;

    if (scroll > header.offsetHeight) {
        searchBar.classList.add('fixed-search');
        searchBar.classList.remove('hidden');
    } else {
        searchBar.classList.add('hidden');

        setTimeout(() => {
            if (window.scrollY <= header.offsetHeight) { 
                searchBar.classList.remove('fixed-search'); 
            }
        }, 300);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    //pegar os link da nav
    const navLinks = document.querySelectorAll(".menu nav a");
    //pegar a div da animação
    const animation = document.querySelector(".animation");
    //pegar o botao de login
    const logIn = document.querySelector('.login');
    //pegar os links da search-bar
    const searchBarLinks = document.querySelectorAll('.search-menu a');
    //pegar a div da animação da searchbar
    const searchBarAnimation = document.querySelector('.search-menu .search-animation')
    //pegar o botaozinho de subir a pagina
    const goupButton = document.querySelector('.search-goup');

    let currentPage = window.location.pathname;
    let activeLink = null;
    let activeSearchLink = null;

    goupButton.addEventListener('click', () => {
        window.scrollTo({top: 0}); //volta ao topo da pagina
    })

    if (currentPage.includes("login")) {
        logIn.classList.add("activelogin");
    } else {
        logIn.classList.remove("activelogin");
    }

    function moveIndicator(element) {
        if(!element || !animation) return;
        animation.style.width = `${element.offsetWidth}px`;
        animation.style.left = `${element.offsetLeft}px`;
    }

    function moveIndicatorSearch(element) {
        if(!element || !searchBarAnimation) return;
        searchBarAnimation.style.width = `${element.offsetWidth}px`;
        searchBarAnimation.style.left = `${element.offsetLeft}px`
    }


    searchBarLinks.forEach((link) => {
        if(currentPage.includes(link.getAttribute("href"))){
            activeSearchLink = link;
        }
        link.addEventListener("mouseover", () => {
            moveIndicatorSearch(link)
        })
        link.addEventListener("mouseleave", () => {
            moveIndicatorSearch(activeSearchLink);
        })
    });

    navLinks.forEach(link => {
        if (currentPage.includes(link.getAttribute("href"))) {
            activeLink = link;
        }
        link.addEventListener("mouseover", function() {
            moveIndicator(link);
        });

        link.addEventListener("mouseleave", function() {
            moveIndicator(activeLink);
        });
    });

    moveIndicator(activeLink);
    moveIndicatorSearch(activeSearchLink);
});

//fazer a pesquisa

const formSearch = document.querySelector('.left form');
const headerSearch = document.querySelector('.header-search form')

formSearch.onsubmit = (e) => {
    e.preventDefault();
    
    const input = e.target.querySelector('#search')
    const pesquisa = input.value.trim();
    const searchButton = document.querySelector('.search-button');

    if (pesquisa === '') {
        alert('Preencha o campo para realizar uma pesquisa');
        return;
    }

    localStorage.setItem('pesquisa', pesquisa);

    window.location.href = `resultados.html`

    input.value = '';
    
    searchButton.addEventListener('click', () => {
        input.value = '';
    })
};

headerSearch.onsubmit = ((e) => {
    e.preventDefault();

    const input = e.target.querySelector('#header-input');
    const pesquisa = input.value.trim();
    const searchButton = document.querySelector('#header-button');

    if (pesquisa === '') {
        alert('Preencha o campo para realizar uma pesquisa');
        return;
    }

    localStorage.setItem('pesquisa', pesquisa);

    window.location.href = `resultados.html`

    input.value = '';
    
    searchButton.addEventListener('click', () => {
        input.value = '';
    })
});