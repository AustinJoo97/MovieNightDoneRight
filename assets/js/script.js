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
    let searchCriteriaChosen = this.childNodes[1].childNodes[1].value;
    let searchQuery = this.childNodes[1].childNodes[3].value;
    let searchQueryArray;
    let urlQuery = '';

    
    if(!searchQuery){
        getTopRatedMovies();
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
        return;
    } else if(searchCriteriaChosen === 'actor'){
        searchQueryArray = searchQuery.split(" ");
        for(let i = 0; i < searchQueryArray.length; i++){
            if(i === searchQueryArray.length-1){
                urlQuery += `${searchQueryArray[i]}`
            } else {
                urlQuery += `${searchQueryArray[i]}%20`
            }
        }
        getMoviesByActors(urlQuery);
        return;
    } else if(searchCriteriaChosen === 'yearReleased'){
        if(Number(searchQuery)){
            urlQuery = `${searchQuery}`;
            getMoviesByYear(urlQuery);
        } else {
            alert('Not a valid year! Please try again!')
        }
        return;
    } 
}

// This function will render the top rated movies on tmdb as a default list of movies
    // They will be rendered if the user searches without a query or upon initial page loads
function getTopRatedMovies(){
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&sort_by=popularity.desc`)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        data.results.forEach(getFullMovieDetails)
    })
}

// These functions pertain to searches made regarding a movie's information (title, year released)
    // This function will perform a search for all movies based on title/keyword then get each movie's full details
function getMoviesByTitle(movieTitleString){
    // console.log(`THIS IS QUERY STRING: ${movieTitleString}`)
    fetch(`${tmdbAPI}${apiKey}&language=en-US&sort_by=popularity.desc&query=${movieTitleString}&include_adult=true`)
    // Sort_by=popularity.desc is not working. Look into this later
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        data.results.forEach(getFullMovieDetails)
    })
}
    // This function will search and retrieve all movies based on the year released then get each movie's full details
function getMoviesByYear(movieReleaseYearString){
    fetch(`${tmdbAPI}${apiKey}&language=en-US&sort_by=popularity.desc&query=allS&include_adult=true&primary_release_year=${movieReleaseYearString}`)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        data.results.forEach(getFullMovieDetails)
    })
}


// These functions pertain to searches made regarding a movie's cast and his/her name
    // This function will take the name of an actor/actress searched, retrieve their ID, then pass it to the getActorsFilmography function
function getMoviesByActors(actorNameString){
    fetch(`http://api.tmdb.org/3/search/person?api_key=${apiKey}&query=${actorNameString}`)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        getActorsFilmography(data.results[0].id)
    })
}
// This function will take the actor's ID passed from the above function and return his/her full filmography
    // It will then take the ID of each film and pass it into the getFullMovieDetailsFunction
function getActorsFilmography(actorID){
    fetch(`https://api.themoviedb.org/3/person/${actorID}/movie_credits?api_key=${apiKey}`)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        data.cast.forEach(getFullMovieDetails)
    })
}

// This function will get the full details of all the movies that are returned in the above functions including title, year released, genres, overview/synopsis, 
    // It will get the full details of all movies retrieved based on a the IDs returned by searching via name/keyword, release year, and actor/actress searched
function getFullMovieDetails(movie){
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=credits,release_dates`)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log(data);
    })
};

initializer();
searchForMovies.addEventListener("submit", retrieveMovies)