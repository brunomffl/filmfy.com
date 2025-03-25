import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { cardEffect } from './util.js';

/* Requisição para as abas de filmes na página inicial */
async function getSections() {
    const apiKey = '497e95504196cfbab77ba149718eaa94';
    const endpoints = {
        nowPlaying: `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`,
        upcoming: `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`,
        popular: `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`,
        topRated: `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`,
    };

    try {
        const requests = Object.entries(endpoints).map(async ([key, url]) => {
            const response = await fetch(url);
            const data = await response.json();
            return { key, results: data.results };
        });

        const sections = await Promise.all(requests);
        return sections.reduce((acc, section) => {
            acc[section.key] = section.results;
            return acc;
        }, {});
    } catch (error) {
        console.error(`Erro ao realizar requisições: ${error}`);
        return {};
    }
}

async function createCards(cards, containerId) {
    const container = document.querySelector(`#${containerId} .swiper-wrapper`);
    let slide;

    for (const [index, card] of cards.entries()) {
        // Crie um novo slide a cada 4 cards
        if (index % 4 === 0) {
            slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            container.append(slide);
        }

        // Crie o card
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const movieLink = document.createElement('a');
        movieLink.href = '#'; // Link temporário

        const moviePoster = document.createElement('img');
        moviePoster.setAttribute('src', `https://image.tmdb.org/t/p/original${card.poster_path}`);
        moviePoster.setAttribute('alt', card.title);

        const hover = document.createElement('div');
        hover.classList.add('hover');

        const hoverInfo = document.createElement('div');
        hoverInfo.classList.add('hover-info');

        const infoText = document.createElement('div');
        infoText.classList.add('title');
        infoText.innerHTML = `<h2>${card.title}</h2>`;

        let subInfo = document.createElement('div');
        subInfo.classList.add('sub-info');

        let realeseYear = document.createElement('div');
        realeseYear.innerHTML = `${card.release_date}`;
        realeseYear.classList.add('release-year');

        let rating = document.createElement('div');
        rating.innerHTML = 'Loading...';
        rating.classList.add('rating');

        subInfo.append(realeseYear, rating);
        hoverInfo.append(infoText, subInfo);
        hover.append(hoverInfo);
        movieLink.append(hover, moviePoster);
        movieCard.append(movieLink);

        slide.appendChild(movieCard);
        cardEffect(movieCard, hover);

        // Atualize o link com o IMDb ID
        const imdbId = await getImdbId(card.id);
        if (imdbId) {
            movieLink.href = `movie.html?id=${imdbId}`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getSections().then(sections => {
        if (Object.keys(sections).length > 0) {
            Object.entries(sections).forEach(([key, cards]) => {
                createCards(cards, key);

                new Swiper(`#${key} .mySwiper`, {
                    slidesPerView: 1,
                    grabCursor: true,
                    loop: true,
                    navigation: {
                        nextEl: `#${key} .swiper-button-next`,
                        prevEl: `#${key} .swiper-button-prev`,
                    },
                });
            });
        } else {
            console.error('Nenhuma sessão foi encontrada.');
        }
    });
});

async function getImdbId(tmdbId) {
    const tmdbApiKey = '497e95504196cfbab77ba149718eaa94';
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${tmdbApiKey}`);
        const data = await response.json();
        return data.imdb_id; // Retorna o IMDb ID
    } catch (error) {
        console.error(`Erro ao buscar IMDb ID para TMDB ID ${tmdbId}:`, error);
        return null; // Retorna null em caso de erro
    }
}