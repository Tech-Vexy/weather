const apiKey = '9ce7dd52e56fe3bc545e4638737e58e6';
const unsplashAccessKey = 'Noz7U9RAjvYVCzlzNQeqRUo906eopHuqyjT0I2umL9o';

// Fetch coordinates from city name
export function getCoordinates(city) {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    return fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                return { lat: data[0].lat, lon: data[0].lon };
            } else {
                throw new Error('City not found');
            }
        });
}

// Fetch weather forecast data
export async function getWeather(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching weather data:', error));
}

export function fetchCityImage(cityName) {

    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${unsplashAccessKey}&orientation=landscape`;

    return fetch(unsplashUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                return data.results[0].urls.full; // Return the URL of the first image
            } else {
                const search = "nature";
                return  fetch(`https://api.unsplash.com/search/photos?query=${search}&client_id=${unsplashAccessKey}&orientation=landscape`);
            }
        });
}

export function setBackgroundImage(imageUrl) {
    document.body.style.backgroundImage = `url(${imageUrl})`;
}

export function setLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

                    fetch(nominatimUrl)
                        .then(response => response.json())
                        .then(data => {
                            let place = data.display_name;
                            resolve({ place, latitude, longitude }); // Resolve with place and coordinates
                        })
                        .catch(error => reject(`Error fetching location: ${error}`));
                },
                (error) => {
                    reject(`Geolocation error: ${error.message}`);
                }
            );
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
}


export async function fetchWeather(lat,lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    return fetch(weatherUrl)
        .then(response => response.json())
        .then(weatherData => weatherData)
        .catch(error => {
            console.error('Error fetching weather data:', error);
            throw error; // Rethrow the error for handling by the caller
        });
}



export async function fetchNews() {
    const url = 'https://weather-api163.p.rapidapi.com/weather/news?page=1';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '450d707a33mshf44e2991c0b385ep137638jsnd32e248eb31b',
            'x-rapidapi-host': 'weather-api163.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: {
            key1: 'value',
            key2: 'value'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result.news;
    } catch (error) {
        console.error(error);
    }
}
