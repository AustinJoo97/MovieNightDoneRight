let tmdbAPI = 'https://api.themoviedb.org/3/search/movie?api_key='
let apiKey = 'f11af3c11ab7492603919de407bd7900';
let movieImgURL = 'https://image.tmdb.org/t/p/original/';
let searchQueries = '';
// User poster path as endpoint for the above URL
let genresDropdown = document.getElementById('genresDropdown');
let searchForMovies = document.getElementById('searchOptions')


function initializer(){
    categoriesPopulation();
}

function categoriesPopulation(){
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        for(let i = 0; i < data.genres.length; i++){
            let newGenre = document.createElement('option');
            newGenre.setAttribute("value", data.genres[i].id);
            newGenre.textContent = data.genres[i].name;
            genresDropdown.appendChild(newGenre);
        }
    })
}

function retrieveMovies(event){
    event.preventDefault();
    let searchCriteriaChosen = this.childNodes[1].value;
    let searchQuery = this.childNodes[3].value;
    let searchQueryArray;
    let urlQuery = '';

    if(!searchQuery){
        urlQuery= 'all';
        getMoviesByTitle(urlQuery);
        return;
    }

    if(searchCriteriaChosen === 'allMovies' || searchCriteriaChosen === 'title'){
        searchQueryArray = searchQuery.split(" ");
        for(let i = 0; i < searchQueryArray.length; i++){
            if(i === searchQueryArray.length-1){
                urlQuery += `${searchQueryArray[i]}`
            } else {
                urlQuery += `${searchQueryArray[i]}+`
            }
        }
        getMoviesByTitle(urlQuery);
    } else if(searchCriteriaChosen === 'actor'){



    } else if(searchCriteriaChosen === 'yearReleased'){



    } else if(searchCriteriaChosen === 'rating'){

    }
}

function getMoviesByTitle(queryString){
    console.log(`THIS IS QUERY STRING: ${queryString}`)
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${queryString}&language=en-US&include_adult=true`)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log(data);
    })
}

initializer();
searchForMovies.addEventListener("submit", retrieveMovies)