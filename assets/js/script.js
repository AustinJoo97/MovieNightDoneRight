let tmdbAPI = 'https://api.themoviedb.org/3/search/movie?api_key='
let apiKey = 'f11af3c11ab7492603919de407bd7900';
let movieImgURL = 'https://image.tmdb.org/t/p/original/';
let searchQueries = '';
let foodAPI = 'https://api.documenu.com/v2/restaurants/zip_code/'
let foodAPIkey = '?key=c5752c8e949ff34a04ffeb67f70d2988&size=5';
// User poster path as endpoint for the above URL
let genresDropdown = document.getElementById('genresDropdown');
let searchForMovies = document.getElementById('searchOptions');
let renderedMovies = document.getElementById('renderedMovies');
let genres = {};
let genreID;
let fetchAPI;
let restaurantContainer = document.getElementById('restaurants')
let userZip = document.getElementById('userZip')
let getRestBtn = document.getElementById('getRestBtn')
let modalMovieTitle = document.getElementById('modalMovieTitle')


function initializer(){
    genresPopulation();
    getMoviesNowPlaying();
}

function genresPopulation(){
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

    this.childNodes[1].childNodes[3].value = '';
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

// This function will render the currently playing/newly released movies on tmdb as a default list of movies
function getMoviesNowPlaying(){
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&region=US`)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        removeRenderMovies();
        data.results.forEach(getFullMovieDetails)
    })
}

// This function will render the top movies on tmdb
    // They will be rendered if the user searches without a query or upon initial page loads
function getTopRatedMovies(){
    if(genreID){
        fetchAPI = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1&region=US&with_genres=${genreID}`
    } else {
        fetchAPI = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1&region=US`
    }
    fetch(fetchAPI)
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
    for(let i = 1; i < 20; i++){
        if(genreID){
            fetchAPI = `${tmdbAPI}${apiKey}&language=en-US&sort_by=popularity.desc&query=${movieTitleString}&include_adult=true&region=US&with_genres=${genreID}&page=${i}`;
        } else {
            fetchAPI = `${tmdbAPI}${apiKey}&language=en-US&sort_by=popularity.desc&query=${movieTitleString}&include_adult=true&region=US&page=${i}`
        }
        fetch(fetchAPI)
        // SORT_BY=POPULARITY.DESC IS NOT WORKING AS INTENDED. LOOK INTO THIS LATER
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            removeRenderMovies();
            data.results.forEach(getFullMovieDetails)
        })
    }
}
    // This function will search and retrieve all movies based on the year released then get each movie's full details
function getMoviesByYear(movieReleaseYearString){
    // console.log('this is movie release year: ' + movieReleaseYearString);
    for(let i = 1; i < 20; i++){
        if(genreID){
            fetchAPI = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=true&region=US&primary_release_year=${movieReleaseYearString}&with_genres=${genreID}&region=US&page=${i}`;
        } else {
            fetchAPI = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=true&region=US&primary_release_year=${movieReleaseYearString}&region=US&page=${i}`
        }
        fetch(fetchAPI)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            console.log(data);
            removeRenderMovies();
            data.results.forEach(getFullMovieDetails)
        })
        .catch(function(error){
            console.log(error)
        })
    }
}

    // This function will search all movies based on the genre selected
function getMoviesByGenre(event){
    genreID = event.target.value;
    for(let i = 1; i < 20; i++){
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=true&region=US&with_genres=${genreID}&region=US&page=${i}`)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            removeRenderMovies();
            data.results.forEach(getFullMovieDetails)
        })
        .catch(function(error){
            console.log(error);
        })
    }
}

// These functions pertain to searches made regarding a movie's cast and his/her name
    // This function will take the name of an actor/actress searched, retrieve their ID, then pass it to the getActorsFilmography function
function getMoviesByActors(actorNameString){
    fetchAPI = `http://api.tmdb.org/3/search/person?api_key=${apiKey}&query=${actorNameString}&region=US`
    fetch(fetchAPI)
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
    // console.log(movie);
    let noRating = ['Unrated', 'unrated', 'ur', 'UR', 'nr', 'NR', '']
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=credits,release_dates`)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        if(genreID){
            if(data.genres){
                if(data.genres.length === 0){
                    return;
                } else {
                    for(let i = 0; i < data.genres.length; i++){
                        if(data.genres[i].name === genres[genreID]){
                            break;
                        } else if(i === data.genres.length-1){
                            return;
                        }
                    }
                }
            } else if(data.genre_ids){
                if(!data.genre_ids.includes(genreID)){
                    return;
                } 
            }
        } 
        let newMovieCell = document.createElement('div');
        let newMovieCard = document.createElement('div');
        let newMovieImg = document.createElement('img');
        let newMovieCardSection = document.createElement('div');
        newMovieImg.src = `${movieImgURL}${data.poster_path}`;
        let newMovieTitle = document.createElement('h5');
        newMovieTitle.textContent = data.original_title;
        let newMovieYear = document.createElement('h6');
        newMovieYear.textContent = `Released: ${data.release_date.substr(0,4)}`;
        let newMovieRating = document.createElement('h6');

        for(let i = 0; i < data.release_dates.results.length; i++){
            if(data.release_dates.results[i].iso_3166_1 === 'US'){
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
        let newMovieGenres = document.createElement('h6');
        for(let i = 0; i < data.genres.length; i++){
            if(i === data.genres.length-1){
                newMovieGenres.textContent += `${data.genres[i].name}`
            } else {
                newMovieGenres.textContent += `${data.genres[i].name}, `
            }
        }
        newMovieCard.appendChild(newMovieImg);
        newMovieCard.appendChild(newMovieCardSection);
        newMovieCard.setAttribute('class', 'movieCard');
        newMovieCard.setAttribute('data-open', 'exampleModal1')
        newMovieCardSection.appendChild(newMovieTitle);
        newMovieCardSection.appendChild(newMovieYear);
        newMovieCardSection.appendChild(newMovieRating);
        newMovieCardSection.appendChild(newMovieGenres);
        newMovieCardSection.setAttribute('class', 'card-section')
        newMovieCell.appendChild(newMovieCard);
        newMovieCell.setAttribute('class','column');
        renderedMovies.appendChild(newMovieCell);
        newMovieCard.addEventListener("click", upDateModal)
        //if img throws an error the src will change to the new placeholder 
        newMovieImg.setAttribute('onerror',"this.onerror=null;this.src='https://placehold.it/300x450'")

        function upDateModal() {
            modalMovieTitle.textContent += newMovieTitle.textContent
            
        }
    })
    .catch(function(error){
        console.log(error);
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
genresDropdown.addEventListener("change", getMoviesByGenre);

// This function will take the users zipcode and return 5 restaurants located within that zipcode. 
function getRestaurantByZipcode(){
    let zipcode = userZip.value

    fetch(`https://api.documenu.com/v2/restaurants/zip_code/${zipcode}${foodAPIkey}`)
    .then(function(response){
        return response.json()
    })
    .then(function (data) {
        let restInfo = data.data
        for (let i = 0; i < restInfo.length; i++){
            let restaurantName = document.createElement('h6')
            let restaurantPhone = document.createElement('p')
            let restaurantAddress = document.createElement('p')
            restaurantName.textContent = restInfo[i].restaurant_name;
            restaurantPhone.textContent = restInfo[i].restaurant_phone;
            restaurantAddress.textContent = restInfo[i].address.formatted;
            restaurantContainer.appendChild(restaurantName)
            restaurantContainer.appendChild(restaurantPhone)
            restaurantContainer.appendChild(restaurantAddress)
        }

    })
}

getRestBtn.addEventListener("click", getRestaurantByZipcode)

