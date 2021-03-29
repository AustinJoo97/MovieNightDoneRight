let tmdbAPI = 'https://api.themoviedb.org/3/search/movie?api_key='
let apiKey = 'f11af3c11ab7492603919de407bd7900';
let movieImgURL = 'https://image.tmdb.org/t/p/original/';
let searchQueries = '';
// User poster path as endpoint for the above URL
let genresDropdown = document.getElementById('genresDropdown');
let searchForMovies = document.getElementById('searchOptions');
let renderedMovies = document.getElementById('renderedMovies');
let genres = {};


function initializer(){
    categoriesPopulation();
    getTopRatedMovies();
}

function categoriesPopulation(){
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        for(let i = 0; i < data.genres.length; i++){
            genres[data.genres[i].id] = data.genres[i].name;
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
        removeRenderMovies();
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
        removeRenderMovies();
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
        removeRenderMovies();
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
        removeRenderMovies();
        data.cast.forEach(getFullMovieDetails)
    })
}

// This function will get the full details of all the movies that are returned in the above functions including title, year released, genres, overview/synopsis, 
    // It will get the full details of all movies retrieved based on a the IDs returned by searching via name/keyword, release year, and actor/actress searched
function getFullMovieDetails(movie){
    let noRating = ['Unrated', 'unrated', 'ur', 'UR', 'nr', 'NR', '']
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=credits,release_dates`)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        let newMovieCard = document.createElement('div');
        let newMovieImg = document.createElement('img');
        newMovieImg.src = `${movieImgURL}${data.poster_path}`;
        let newMovieTitle = document.createElement('h3');
        newMovieTitle.textContent = data.original_title;
        let newMovieYear = document.createElement('h4');
        newMovieYear.textContent = `Released: ${data.release_date.substr(0,4)}`;
        let newMovieRating = document.createElement('h4');

        for(let i = 0; i < data.release_dates.results.length; i++){
            if(data.release_dates.results[i].iso_3166_1 === 'US'){
                console.log(data.original_title, data.release_dates.results);
                if(noRating.includes(data.release_dates.results[i].release_dates[0].certification)){
                    newMovieRating.textContent = `Unrated`
                    continue;
                } else {
                    newMovieRating.textContent = `Rated ${data.release_dates.results[i].release_dates[0].certification}`;
                }
            } 
        }
        if(newMovieRating.textContent === '' || newMovieRating.textContent === undefined){
            newMovieRating.textContent = `Unrated`;
        }
        let newMovieGenres = document.createElement('h5');
        for(let i = 0; i < data.genres.length; i++){
            if(i === data.genres.length-1){
                newMovieGenres.textContent += `${data.genres[i].name}`
            } else {
                newMovieGenres.textContent += `${data.genres[i].name}, `
            }
        }
        newMovieCard.appendChild(newMovieImg);
        newMovieCard.appendChild(newMovieTitle);
        newMovieCard.appendChild(newMovieYear);
        newMovieCard.appendChild(newMovieRating);
        newMovieCard.appendChild(newMovieGenres);
        newMovieCard.setAttribute('class', 'movieCard');
        renderedMovies.appendChild(newMovieCard);
    })
};

// This is a function that will clear all movie cards before rendering the next set to the DOM
function removeRenderMovies(){
    while(renderedMovies.firstChild){
        renderedMovies.removeChild(renderedMovies.firstChild)
    }
    return;
}

initializer();
searchForMovies.addEventListener("submit", retrieveMovies)