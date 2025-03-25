import { cardEffect } from './util.js'
import { mobileMenu } from './util.js';

const apiKey = 'c6f8e6b1';
const pesquisa = localStorage.getItem('pesquisa');

if (pesquisa) {
    buscarFilmes(pesquisa);
    localStorage.removeItem('pesquisa');
} else {
    document.body.innerHTML = "<h2>No search was made</h2>";
}

async function buscarFilmes(pesquisa, page = 1) {
    let response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${pesquisa}&page=${page}`);
    let json = await response.json();

    const h1 = document.querySelector('#search-response');
    if (json.Search) {
        loadMovies(json);
        h1.innerHTML = `<h1>Here’s what we found for your search: <span>${pesquisa[0].toUpperCase() + pesquisa.slice(1)}</span></h1>`;
    } else {
        h1.innerHTML = `<h1>Couldn't find anything for your search 😔</h1>`;
    }

    selectedPage(page);
}

function selectedPage(currentPage) {
    const allPages = document.querySelectorAll('.pageNumbers button');
    const allYs = document.querySelectorAll('.pageIndicator span');

    for (let i = 0; i < currentPage; i++) {
        allPages[i].classList.remove('selected');
        allYs[i].classList.remove('selected');
    }

    allPages[currentPage - 1].classList.add('selected');
    allYs[currentPage - 1].classList.add('selected');
}

const lazyLoading = () => {
    const listaElementos = document.querySelectorAll('[data-src]');
    listaElementos.forEach((elemento) => {
        if (elemento.getBoundingClientRect().top < window.innerHeight) {
            // Registra o onload antes de definir o src
            elemento.onload = () => {
                elemento.classList.add('loaded');
            }
            elemento.src = elemento.getAttribute('data-src');
            elemento.removeAttribute('data-src');
        }
    });
}

function loadMovies(json) {
    try {
        const moviesList = document.querySelector('.movie-grid');
        moviesList.innerHTML = '';
        const documentFragment = document.createDocumentFragment();

        json.Search.forEach((movie) => {
            let movieEl = document.createElement('div');
            movieEl.classList.add('movie-card');

            let movieLink = document.createElement('a');
            movieLink.href = `movie.html?id=${movie.imdbID}`;

            let moviePoster = document.createElement('img');
            moviePoster.setAttribute('data-src', movie.Poster);
            moviePoster.alt = movie.Title;

            let hover = document.createElement('div');
            hover.classList.add('hover');

            let hoverInfo = document.createElement('div');
            hoverInfo.classList.add('hover-info');

            let infoText = document.createElement('div');
            infoText.classList.add('title');
            infoText.innerHTML = `<h2>${movie.Title}</h2>`;

            let subInfo = document.createElement('div');
            subInfo.classList.add('sub-info');

            let releaseYear = document.createElement('div');
            releaseYear.innerHTML = `${movie.Year}`;
            releaseYear.classList.add('release-year');

            let rating = document.createElement('div');
            rating.innerHTML = `Loading...`;
            rating.classList.add('rating');

            subInfo.append(releaseYear, rating);
            hoverInfo.append(infoText, subInfo);
            hover.append(hoverInfo);
            movieLink.append(hover, moviePoster);
            movieEl.append(movieLink);

            documentFragment.append(movieEl);
            cardEffect(movieEl, hover);
            getIMDBrating(movie.imdbID, rating);
        });

        paginate(json);
        moviesList.append(documentFragment);

        lazyLoading();

        window.onscroll = () => {
            lazyLoading();
        }
    } catch (error) {
        console.log(`Error: ${error}`);
    } finally {
        let loading = document.querySelector('#loading');
        loading.classList.add('hidden');
    }
}

export async function getIMDBrating(imdbID, ratingEl) {
    try {
        let response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
        let json = await response.json();

        let imdbRating = json.Ratings.find(r => r.Source === "Internet Movie Database");

        ratingEl.innerHTML = imdbRating ? `${imdbRating.Value} ⭐` : "N/A ⭐";
    } catch (error) {
        console.error("Erro ao buscar rating:", error);
        ratingEl.innerHTML = "Erro ao carregar";
    }
}

//paginação
// exemplo de uso
//https://www.omdbapi.com/?s=batman&page=1&apikey=c6f8e6b1
function paginate(json){
    const totalResults = json.totalResults;
    
    let totalPages = Math.ceil(totalResults/10);

    if(totalPages > 10){
        totalPages = 10;
    }else{
        totalPages = totalPages;
    }

    const pageNumbers = document.querySelector('.pageNumbers');
    const pageIndicator = document.querySelector('.pageIndicator a');
    pageNumbers.innerHTML = ''; //limpar para que quando fizer a nova busca ele nao fique com o antigo
    pageIndicator.innerHTML = 'filmf';
    
    const allPages = document.createDocumentFragment();
    const allYs = document.createDocumentFragment();

    for(let i = 1; i <= totalPages; i++){
        const page = document.createElement('button');
        page.textContent = i;
        page.addEventListener('click', () => {
            buscarFilmes(pesquisa, i);
        });
        

        const ys = document.createElement('span');
        ys.textContent = 'y';

        allPages.append(page);
        allYs.append(ys);
    };

    pageNumbers.append(allPages);
    pageIndicator.append(allYs);

    const dotcom = document.querySelector('span');
    dotcom.classList.add('selected')
    dotcom.innerHTML = '.'

    pageIndicator.append(dotcom, 'com');

}

mobileMenu();