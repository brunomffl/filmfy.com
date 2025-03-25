import { cardEffect } from './util.js'
import { mobileMenu } from './util.js';

const url = new URLSearchParams(window.location.search);
const movieId = url.get('id');
const apiKey = 'c6f8e6b1';
const tmdbApiKey = '497e95504196cfbab77ba149718eaa94'

function loadMoviePage(){
    try{
        if (movieId){
            fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`)
            .then((response) => {
                return response.json();
            }).then((json) => {

                //movie poster
                const moviePoster = document.querySelector('.moviePoster');
                const moviePosterImg = document.createElement('img');
                moviePosterImg.src = json.Poster;
                moviePosterImg.alt = `${json.Title} poster`
                moviePoster.append(moviePosterImg);

                //movie title
                const movieTitle = document.querySelector('.movieTitle');
                const movieTitleText = document.querySelector('.movieTitle h2');
                movieTitleText.innerText = json.Title;

                //imdb meter
                const imdbscore = document.querySelector('.imdbscore');
                imdbscore.innerHTML = json.imdbRating;
                const meter = document.querySelector('.meter');
                const percentege = json.imdbRating * 10;

                //precisa do setTimeout para funcionar
                setTimeout(() => {
                    meter.style.background = `
                        conic-gradient(
                            var(--cr-green) ${percentege}%, transparent 0%
                        )
                    `;
                }, 100);

                //movie description
                const movieDesc = document.querySelector('.movieDesc');
                movieDesc.innerText = json.Plot;

                //movie categories
                const help = json.Genre;
                const movieGenre = help.split(',');
                const movieCategories = document.querySelector('.movieCategories');
                const docFrag = document.createDocumentFragment();
                movieGenre.forEach((genre) => {
                    const categorie = document.createElement('div');
                    categorie.classList.add('categorie');
                    categorie.innerText = genre;
                    docFrag.append(categorie);
                });
                movieCategories.append(docFrag);

                //movie infos
                const director = document.querySelector('.movieCastandCrew .director span');
                const realeseYear = document.querySelector('.movieCastandCrew .realeseYear span');
                const actors = document.querySelector('.movieCastandCrew .actors span');

                director.innerText = json.Director;
                realeseYear.innerText = json.Released;
                actors.innerText = json.Actors;  

                //providers
                getProvidersByImdb();
                
                
            });
        };
    }catch(error){
        console.log(`Error: ${error}`);
    }finally{
        let loading = document.querySelector('#loading');
        console.log(loading);
        loading.classList.add('hidden')
    }
};

// vai ter que ter uma requisição para pegar os provedores da api do the movie db
// para usar a imagem é o seguinte
// https://image.tmdb.org/t/p/w${logoSize}${logo_path}
// o logo_path vem da api, propriedade do retorno.

async function getProvidersByImdb() {
    // pegar id do filme

    const idresponse = await fetch (`https://api.themoviedb.org/3/find/${movieId}?api_key=${tmdbApiKey}&external_source=imdb_id`);

    const idjson = await idresponse.json();

    const tmdbMovieId = idjson.movie_results[0].id;

    const movieName = idjson.movie_results[0].title

    //pegar os providers
    const providersresponse = await fetch (`https://api.themoviedb.org/3/movie/${tmdbMovieId}/watch/providers?api_key=${tmdbApiKey}`);

    const providersjson = await providersresponse.json();

    //confirma se existe um resultado .BR, caso não existe ele devolve um array vazio
    const streaming = providersjson.results.BR?.flatrate || [];
    const rent = providersjson.results.BR?.rent || [];
    const buy = providersjson.results.BR?.buy || [];


    if(buy.length > 0){
        let buyOptions = document.querySelector('.buy-options');
        buy.forEach((item) => {

            let buyCard = document.querySelector('.buy').cloneNode(true);

            buyCard.querySelector('.provider-logo img').src = `https://image.tmdb.org/t/p/w92/${item.logo_path}`;

            buyCard.querySelector('.provider-name').innerHTML = item.provider_name;

            buyCard.style.display = 'block';

            buyOptions.append(buyCard)
        })
    }else{
        document.querySelector('.buynooptions').innerHTML = `Currently there are <span>no providers</span> </br> for this movie in <span>your region</span>`
    }

    if(rent.length > 0){
        let rentOptions = document.querySelector('.rent-options');
        rent.forEach((item) => {
            let rentTemplate = document.querySelector('.rent').cloneNode(true);

            let rentCard = rentTemplate.cloneNode(true);

            rentCard.querySelector('.provider-logo img').src = `https://image.tmdb.org/t/p/w92/${item.logo_path}`;

            rentCard.querySelector('.provider-name').innerHTML = item.provider_name;

            rentCard.style.display = 'block';

            rentOptions.append(rentCard);

        })
    }else{
        document.querySelector('.rentnooptions').innerHTML = `Currently there are <span>no providers</span> </br> for this movie in <span>your region</span>`
    }

    if(streaming.length > 0){
        let streamingOptions = document.querySelector('.streaming-options');
        streaming.forEach((item) => {  
            let providerCard = document.querySelector('.streaming').cloneNode(true);
        
            providerCard.querySelector('.provider-logo img').src = `https://image.tmdb.org/t/p/w92/${item.logo_path}`;
            providerCard.querySelector('.provider-name').innerHTML = item.provider_name;
        
            providerCard.style.display = 'block';
        
            streamingOptions.appendChild(providerCard);
        });
    }else{
        document.querySelector('.streamingnooptions').innerHTML = `Currently there are <span>no providers</span> <br> for this movie in <span>your region</span>`
    }
    
    relatedMovies(tmdbMovieId, movieName)
}

loadMoviePage();

async function relatedMovies(tmdbid, movieName){
    const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbid}/recommendations?api_key=${tmdbApiKey}`);

    const json = await response.json();


    const relatedMovies = [];

    for(let i = 0; i < 5; i++){
        relatedMovies.push(json.results[i])
    }

    const relatedPhrase = document.querySelector('#relatedMovies h2');
    relatedPhrase.innerHTML = `If you liked <span>${movieName}</span> you'll probably like these too!`;

    //cloning template
    const movieList = document.querySelector('.movieList');

    const moviesFragment = document.createDocumentFragment();

    for(const movie of relatedMovies){
        const movieCardTemplate = document.querySelector('.movieCard').cloneNode(true);

        movieCardTemplate.querySelector('.title h3').innerText = movie.title;

        const idmovie = movie.id;

        const movieLink = movieCardTemplate.querySelector('.template');

        const idIMDB = await getImdbId(idmovie);
        

        movieLink.href = `movie.html?id=${idIMDB}`

        const hover = movieCardTemplate.querySelector('.template .hover');

        movieCardTemplate.querySelector('.template img').src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

        movieCardTemplate.querySelector('.template').style.display = 'inline-block';

        movieCardTemplate.style.display = 'flex';

        cardEffect(movieCardTemplate, hover);

        moviesFragment.append(movieCardTemplate);

    }

    movieList.append(moviesFragment);

}

async function getImdbId(id){

    let response = await fetch(`https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${tmdbApiKey}`);

    let json = await response.json();

    let imdbId = json.imdb_id;

    return imdbId;

};

mobileMenu();
