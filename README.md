# Movie Night, Done Right!

## Deployed Site Link
```
https://austinjoo97.github.io/MovieNightDoneRight/
```

## The Team
```
Brandon Ford [https://github.com/brandonfordd]
Ashquinn Gordon [https://github.com/Ashquinn]
Austin Joo [https://github.com/AustinJoo97]
```

## The Task
```
This project utilizes data from two third party API’s: [The Movie Database API] (https://
developers.themoviedb.org/) and [Documenu – Restaurant MenuAPI] (https://api.documenu.com.
This application is perfect for the everyday movie enthusiast. This application allows users
to search through a catalog of films based upon genre. Upon selection of a genre the user is
presented with a set number of films to choose from for their liking. Additionally, there
will be a search bar to allow users to manually select a film as well. For each movie, the
user selects they will be presented with the year released, genre, synopsis, rating, review,
and actors. Lastly, along with the selection of a film,the user will be able to enter their
zip code and a list of five restaurants will presented to them.
```
## User Story
```
As an avid movie watcher and food connoisseur.I want an application that will allow me to
search for movies and be given a possible restaurant located within my zip code.So, I can
enjoy a night of fun entertainment and good food.
```
## Acceptance Criteria
```
GIVEN a movie application 
WHEN I load the applicationThen a multicomponent nav-bar and a component with newly released moviecards will be rendered
THEN these movie cards will display the movies promo image, name, year released and genre
WHEN I click on the “categories” dropdown of the nav-bar and select a genre
THEN multiple movie cards of that genre will be displayed in place of the initial new movies
WHEN I click the search criteria button
THEN I will be able to search for specific movies by actor, name, or year
WHEN I click the search button after typing in my search query
THEN I will have all movies that fit the criteria rendered to the DOM
WHEN I click on a specific movie in the main component of the application 
THEN a modal with the movie’s full details will pop-up. This modal contains two parts. First will be the movies full details including movie poster, name, year, rating, synopsis, actors, and genre. The footer contains a input field for the users zip code
WHEN I enter in my zip code and click “Get Restaurants”
THEN I am presented with 5 restaurants within my zip code
WHEN I click on the movieThen, in addition to the modal opening
THEN the object with all the movies information will be saved to localStorage
WHEN I press a toggle button
THEN all the movies saved to localStorage will replace the movie cards on the DOM
```
## Screenshot of Site
![alt text](https://github.com/AustinJoo97/MovieNightDoneRight/blob/main/assets/images/moivenight_screenshot.png?raw=true)
