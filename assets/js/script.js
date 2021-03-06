let tmdbAPI = 'https://api.themoviedb.org/3/search/movie?api_key='
let apiKey = 'f11af3c11ab7492603919de407bd7900';
let movieImgURL = 'https://image.tmdb.org/t/p/original/';
let searchQueries = '';
let foodAPI = 'https://api.documenu.com/v2/restaurants/zip_code/'
let foodAPIkey = '?key=c5752c8e949ff34a04ffeb67f70d2988&size=5';
let genresDropdown = document.getElementById('genresDropdown');
let searchForMovies = document.getElementById('searchOptions');
let renderedMovies = document.getElementById('renderedMovies');
let genres = {};
let genreID;
let fetchAPI;
let toggle = document.getElementById('toggleRendered');
let toggleStatus = false;
let restaurantContainer = document.getElementById('restaurants')
let userZip = document.getElementById('userZip')
let getRestBtn = document.getElementById('getRestBtn')
let modalMovieTitle = document.getElementById('modalMovieTitle');


// This function will run when the page is initially loaded, running all vital functions for the page to run as intended
function initializer(){
    genresPopulation();
    getMoviesNowPlaying();
}

// This function will generate the dropdown menu, listing all filterable genres
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


// ===================================================================================================================================================================================
// THE FOLLOWING CODE PERTAINS TO THE SEARCH FUNCTIONALITY, FETCH ABILITY, AND RENDERING CAPABILITIES OF THE APPLICATION
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// This function will take any query entered into the search input and, depending on if and/or what search criteria was chosen to return a specific set of results
function retrieveMovies(event){
    event.preventDefault();
    toggle.textContent = this.childNodes[1].childNodes[3].value;
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
    toggle.textContent = 'Top Rated Movies';
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

// ===================================================================================================================================================================================
// THESE FUNCTIONS PERTAIN TO SEARCHES MADE REGARDING A MOVIE'S INFORMATION (TITLE/YEAR RELEASED/GENRE)
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

// ===================================================================================================================================================================================
// THESE FUNCTIONS PERTAIN TO SEARCHES MADE USEING A MOVIE'S CAST MEMBER'S NAME
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

// ===================================================================================================================================================================================
// THIS IS THE MOST VITAL AND MOST UTILIZED FUNCTION THAT WILL TAKE EVERY MOVIE RETURNED TO THE APPLICATION AND RENDER ALL OF ITS INFORMATION TO THE DOM AS WELL AS UPDATING EACH CREATED MOVIE CARD'S MODAL 
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// This function will get the full details of all the movies that are returned in the above functions including title, year released, genres, overview/synopsis, 
    // It will get the full details of all movies retrieved based on a the IDs returned by searching via name/keyword, release year, and actor/actress searched
function getFullMovieDetails(movie){
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
        let newMovieID = document.createElement('span');
        newMovieID.textContent = data.id;
        let newMovieCast = document.createElement('span');
        newMovieCast.textContent = '';
        if(data.credits.cast){
            for(let i = 0; i < data.credits.cast.length; i++){
                if(!data.credits.cast[i]){
                    break;
                } else {
                    if(Number(data.credits.cast[i].popularity) > 2){
                        if(i === data.credits.cast.length-1){
                            newMovieCast.textContent += `${data.credits.cast[i].original_name}`
                            return;
                        } else {
                            newMovieCast.textContent += `${data.credits.cast[i].original_name}, `
                        }
                    } else if(i+1 === data.credits.cast.length){
                        newMovieCast.textContent = newMovieCast.textContent.slice(0, -2);
                    }
                }
            }
            if(newMovieCast.textContent === ''){
                newMovieCast.textContent = 'No Actors/Actresses Listed';    
            }
        } else {
            newMovieCast.textContent = 'No Actors/Actresses Listed';
        }
        let newMovieSynopsis = document.createElement('span');
        newMovieSynopsis.textContent = data.overview;
        let newMovieReview = document.createElement('span');
        newMovieReview.textContent = data.vote_average;
        newMovieID.style.display = 'none';
        newMovieCast.style.display = 'none';
        newMovieSynopsis.style.display = 'none';
        newMovieReview.style.display = 'none';

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
        newMovieCardSection.appendChild(newMovieID);
        newMovieCardSection.appendChild(newMovieCast);
        newMovieCardSection.appendChild(newMovieSynopsis);
        newMovieCardSection.appendChild(newMovieReview);
        newMovieCardSection.setAttribute('class', 'card-section')
        newMovieCell.appendChild(newMovieCard);
        newMovieCell.setAttribute('class','column');
        renderedMovies.appendChild(newMovieCell);
        newMovieCard.addEventListener("click", movieCardClickFunctions)
        //if img throws an error the src will change to the new placeholder 
        newMovieImg.setAttribute('onerror',"this.onerror=null;this.src='https://placehold.it/300x450'")

    })
    .catch(function(error){
        console.log(error);
    })
};

// ===================================================================================================================================================================================
// THESE ARE THE EVENT HANDLERS OF THE APPLICATION
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// This is a function that serves the purpose of triggering multiple functions based on an eventHandler
function movieCardClickFunctions(){
    upDateModal(this);
    saveMovieToLocal(this);
    removeRestaurants();
}

// This function will update the text of the modal based on what movieCard is clicked
function upDateModal(movieCard) {
    document.getElementById('modalMovieImage').src = movieCard.childNodes[0].src;
    document.getElementById('modalMovieTitle').innerHTML = `<b>Movie Title: </b>${movieCard.childNodes[1].childNodes[0].textContent}`;
    document.getElementById('modalMovieCast').innerHTML = `<b>Actors/Actresses: </b>${movieCard.childNodes[1].childNodes[5].textContent}`;
    document.getElementById('modalMovieOverview').innerHTML = `<b>Synopsis: </b>${movieCard.childNodes[1].childNodes[6].textContent}`;
    document.getElementById('modalMovieRating').innerHTML = `<b>MPAA ${movieCard.childNodes[1].childNodes[2].textContent}</b>`;
    document.getElementById('modalMovieYear').innerHTML = `<b>${movieCard.childNodes[1].childNodes[1].textContent}</b>`;
    document.getElementById('modalMovieReview').innerHTML = `<b>Viewer Score: </b>${movieCard.childNodes[1].childNodes[7].textContent}/10`

}

// This function will save any clicked movie to localStorage for later retrieval upon triggering a toggle
function saveMovieToLocal(movieCard){
    if(!localStorage.getItem('recentMovies')){
        localStorage.setItem('recentMovies', JSON.stringify([]));
    }
    let recentMovies = JSON.parse(localStorage.getItem('recentMovies'));
    let movieToSave = {
        title: movieCard.childNodes[1].childNodes[0].textContent,
        id: Number(movieCard.childNodes[1].childNodes[4].textContent)
    }
    for(let i = 0; i < recentMovies.length; i++){
        if(movieToSave.id === recentMovies[i].id){
            recentMovies.splice(i, 1);
            break;
        }
    }
    recentMovies.unshift(movieToSave);
    localStorage.setItem('recentMovies', JSON.stringify(recentMovies));
}

//===================================================================================================================================================================================
// THIS FUNCTION IS RESPONSIBLE FOR RENDERING EITHER THE moviesNowPlaying() FUNCTION OR THE renderRecentMovies() FUNCTION THAT WILL RENDER ALL MOVIES SAVED IN LOCALSTORAGE
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function swapMoviesRendered(event){ 
    removeRenderMovies();
    if(toggleStatus === false){
        renderRecentMovies()
        toggleStatus = true;
        event.target.textContent = 'Recently Viewed'
    } else if(toggleStatus === true){
        getMoviesNowPlaying();
        toggleStatus = false;
        event.target.textContent = 'Newly Released Movies'
    }
};

function renderRecentMovies(){
    let recentMoviesArray = JSON.parse(localStorage.getItem('recentMovies'));
    for(let i = 0; i < recentMoviesArray.length; i++){
        getFullMovieDetails(recentMoviesArray[i]);
    }
    return;
}

// ===================================================================================================================================================================================
// THESE FUNCTIONS MAYBE PERTAIN TO MAINTENANCE AND CLEARING OF THE DOM TO PREVENT REPTITIVE DATA FROM BEING RENDERED AS WELL AS TO PROVIDE A BETTER UIUX
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// This is a function that will clear all movie cards before rendering the next set to the DOM
function removeRenderMovies(){
    while(renderedMovies.firstChild){
        renderedMovies.removeChild(renderedMovies.firstChild)
    }
    return;
}

// This function will clear all the resturants previously rendered to the modal
function removeRestaurants(){
    while(restaurantContainer.firstChild){
        restaurantContainer.removeChild(restaurantContainer.firstChild);
    }
}

// ===================================================================================================================================================================================
// THIS FUNCTION PERTAINS TO THE USE OF A GEOLOCATOR AND USING IT TO RENDER LOCAL RESTAURANT INFORMATION
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// This function will take the users zipcode and return 5 restaurants located within that zipcode. 
function getRestaurantByZipcode(){
    removeRestaurants();
    let zipcode = userZip.value

    fetch(`https://api.documenu.com/v2/restaurants/zip_code/${zipcode}${foodAPIkey}`)
    .then(function(response){
        return response.json()
    })
    .then(function (data) {
        let restInfo = data.data
        for (let i = 0; i < restInfo.length; i++){
            let restaurantName = document.createElement('h4')
            let restaurantPhone = document.createElement('p')
            let restaurantAddress = document.createElement('p')
            let restaurantContainerS = document.createElement('div')
            restaurantName.textContent = restInfo[i].restaurant_name;
            restaurantPhone.textContent = restInfo[i].restaurant_phone;
            restaurantAddress.textContent = restInfo[i].address.formatted;
            restaurantContainerS.appendChild(restaurantName)
            restaurantContainerS.appendChild(restaurantPhone)
            restaurantContainerS.appendChild(restaurantAddress)
            restaurantContainerS.setAttribute('class','restaurantContainer')
            restaurantContainer.appendChild(restaurantContainerS)
        }
    })
    userZip.value = '';
}

// ===================================================================================================================================================================================
// THESE ARE THE LINES OF CODE THAT WILL EITHER RUN WHEN THE APPLICATION IS LOADED INTIALLY OR WHEN CERTAIN EVENTS ARE TRIGGERED
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

initializer();
searchForMovies.addEventListener("submit", retrieveMovies)
genresDropdown.addEventListener("change", getMoviesByGenre);
getRestBtn.addEventListener("click", getRestaurantByZipcode);
toggle.addEventListener('click', swapMoviesRendered)

