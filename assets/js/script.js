const apiKey = '497e95504196cfbab77ba149718eaa94';

/*requisição para as abas de filmes na pagina inicial*/

/*
listType valores possíveis:
    now_playing
    popular
    top_rated
    upcoming
*/

async function getSections(){  
    try {
        const listTypes = ['now_playing', 'popular', 'top_rated', 'upcoming'];
        const requests = listTypes.map((type) => 
            fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=${apiKey}`).then(res => res.json())
        );

        const results = await Promise.all(requests);

        return{
            nowPlaying: results[0],
            popular: results[1],
            topRated: results[2],
            upcoming: results[3],
        };
    }catch(error){
        console.error(`Erro ao realizar requisições ${error}`);
    }
}

getSections().then(data => {
    if(data){
        //data.nowPlaying
    }
})

