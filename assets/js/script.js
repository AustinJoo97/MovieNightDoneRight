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
        console.log(data);
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

    if(!searchQuery){
        return;
    }

    // This returns for the selected value of the searchOptions' dropdown menu
    console.log(this.childNodes[1].value);
    // console.log(typeof searchCriteriaChosen);
    if(searchCriteriaChosen === 'none'){

    } else if(searchCriteriaChosen === 'actor'){

    } else if(searchCriteriaChosen === 'yearReleased'){

    } else if(searchCriteriaChosen === 'title'){

    } else if(searchCriteriaChosen === 'rating'){

    }

    // This returns the value within the input box
    console.log(this.childNodes[3].value)
}


initializer();
searchForMovies.addEventListener("submit", retrieveMovies)