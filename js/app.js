import {fetchNews, fetchWeather, getCoordinates, getWeather,setLocation} from './api.js'
import {displayCurrentWeather, displayWeatherForecast,displayNews} from "./ui.js";
const XRapidApi ='450d707a33mshf44e2991c0b385ep137638jsnd32e248eb31b';


const cityInput = document.getElementById('search-input');
const suggestionsDiv = document.getElementById('suggestions');
//const weatherDiv = document.getElementById('weather-container');

cityInput.addEventListener('input', function () {
    const query = cityInput.value;
    if (query.length >= 3) {
        fetchCities(query);
    } else {
        suggestionsDiv.innerHTML = '';  // Clear suggestions if input is too short
    }
});

// Fetch cities from GeoDB Cities API
async function fetchCities(query) {
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': XRapidApi,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        showSuggestions(data.data);
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
}

// Display city suggestions and fetch weather based on lat/lon
function showSuggestions(cities) {
    suggestionsDiv.innerHTML = '';  // Clear previous suggestions
    cities.forEach(city => {
        const suggestion = document.createElement('div');
        suggestion.textContent = `${city.city}, ${city.country}`;
        suggestion.addEventListener('click', () => {
            cityInput.value = `${city.city}, ${city.country}`;
            suggestionsDiv.innerHTML = '';  // Clear suggestions

            // Fetch weather using latitude and longitude
            fetchWeather(city.latitude, city.longitude)
                .then(data => {
                    displayCurrentWeather(data);
                })
            getWeather(city.latitude,city.longitude)
                .then(data => {
                    displayWeatherForecast(data)
                })
        });
        suggestionsDiv.appendChild(suggestion);
    });
}

fetchNews().then(news => {
    displayNews(news);
});
document.getElementById('search-button').addEventListener('click',handleSearch);


function handleSearch() {
    const city = document.getElementById('search-input').value;
    if (city) {
        getCoordinates(city)
            .then(({lat,lon}) => {
                fetchWeather(lat,lon)
                    .then(data => {
                        displayCurrentWeather(data);
                    })
                getWeather(lat,lon)
                    .then(data => {
                        displayWeatherForecast(data)
                    })
            })
    }
    document.getElementById('search-input').value = '';
}

function loadWeather() {
    setLocation()
        .then(({place,latitude,longitude}) =>  {
            fetchWeather(latitude,longitude)
                .then(weatherText => {
                    displayCurrentWeather(weatherText)
                })
            getWeather(latitude,longitude)
                .then(data => {
                    displayWeatherForecast(data);
                });
        })
        .catch(error => {
            console.error("Error: ",error);
        });

}
const current = document.getElementById('current');
//current.addEventListener('click',loadWeather);
window.onload = loadWeather();
