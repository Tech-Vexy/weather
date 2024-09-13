const apiKey = '9ce7dd52e56fe3bc545e4638737e58e6';
const unsplashAccessKey = 'Noz7U9RAjvYVCzlzNQeqRUo906eopHuqyjT0I2umL9o';  // Replace with your Unsplash API key
const newsDataApi = 'pub_53233bc308a5bbcfbf17eab62a7b464e0422e'
const newApi = '53673e596e0aec82e3a6dbadce249c40';
const restFulApiKey =  '1429|Y9LipWe4SU5YQZEuKVo9DL7TBu3ZwkQcHAVT7hwo';
let recentlySearched = JSON.parse(localStorage.getItem('recentSearches')) || {};
function setLocation() {
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


function fetchCityImage(cityName) {

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

function setBackgroundImage(imageUrl) {
    document.body.style.backgroundImage = `url(${imageUrl})`;
}
function fetchWeather(latitude, longitude) {
    const units = document.getElementById('units').value;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

    return fetch(weatherUrl)
        .then(response => response.json())
        .then(weatherData => {
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const cityName = weatherData.name;
            const icon = weatherData.weather[0].icon;
            const realFeel = weatherData.main.feels_like;
            const countryCode = weatherData.sys.country;
            let countryName ='';
            return fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`) // Fetch country name using REST Countries API
                .then(res => res.json())
                .then(countryData => {
                    countryName = countryData[0].name.common;
                    // Return weather data as a JSON object
                    return {
                        cityName,
                        countryCode: countryName,
                        icon,
                        temperature: temp,
                        description: weatherDescription,
                        realFeel,
                    };
                })
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            throw error; // Rethrow the error for handling by the caller
        });
}


function renderWeather(element,data) {
    //const  weather = document.getElementById('weather-info');
    const iconCode = data.icon;
    const countryCode = data.countryCode;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
    element.innerHTML = `
            <h2><img width="20" height="20" src="https://img.icons8.com/color/48/marker--v1.png" alt="marker--v1"/>${data.cityName}</h2>
            <span>${countryCode}</span>
            <div class="recent-location-current-weather-wrapper">
            <img class="recent-location-icon" src="${iconUrl}" alt="${data.description}" width="32" height="32" />
            <span class="recent-location-temp">
${data.temperature}&#xB0; <span class="recent-location-temp-unit">C</span>
</span>
</div>
           <div class="recent-location-real-feel">
           <span class="recent-location-real-feel-text">RealFeel&#xAE;</span>
           <span class="recent-location-real-feel-value">${data.realFeel}&#xB0;</span>
           </div>`;

}
function loadWeather() {
    setLocation()
        .then(({latitude,longitude}) => {
            return fetchWeather(latitude, longitude);
        })
        .then(weatherText => {
            recentlySearched = { [location]: weatherText, ...recentlySearched };
            localStorage.setItem('recentSearches', JSON.stringify(recentlySearched));
            const  weather = document.getElementById('weather-info');
            //document.getElementById('current-location').textContent = `${weatherText.cityName}`;
            renderWeather(weather,weatherText);
            getCoordinates(weatherText.cityName);
            return fetchCityImage(weatherText.cityName);
        })
        .then(imageUrl => {
            setBackgroundImage(imageUrl);
            showRecentlySearched();
        })
        .catch(error => {
            document.getElementById('location').textContent = error;
            document.getElementById('weather-info').textContent = "Unable to fetch weather data.";

        });

}


function getWeather() {
  const location = document.getElementById('area').value;
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
        const countryCode = data.sys.country;
        return fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`) // Fetch country name using REST Countries API
            .then(res => res.json())
            .then(countryData => {
                const countryName = countryData[0].name.common;
                const weatherData = {
                    temperature: data.main.temp,
                    weatherDescription: data.weather[0].description,
                    cityName: data.name,
                    countryCode: countryName,
                    icon: data.weather[0].icon,
                    realFeel: data.main.feels_like,

                }
                recentlySearched = { [location]: weatherData, ...recentlySearched };
                localStorage.setItem('recentSearches', JSON.stringify(recentlySearched));
                document.getElementById('area').value = '';
                const weather = document.getElementById('weather-info');
                renderWeather(weather, weatherData);
                getCoordinates(weatherData.cityName);
                return fetchCityImage(data.name);
            });
    })
      .then(imageUrl => {
          setBackgroundImage(imageUrl);
          showRecentlySearched();
      })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      const weatherInfo = document.getElementById('weather-info');
      weatherInfo.innerHTML = '<p class="error-message">City not found. Please enter a valid city name.</p>';
    });
}

function showRecentlySearched() {
    //const currentLocation = document.getElementById('current-location-title').textContent.replace("Current Location: ", "");
    const weatherInfo = document.getElementById('recent-locations-list');
    //const locations = Object.keys(recentlySearched).filter(location);

    weatherInfo.innerHTML = '';
    // Render weather data for each recently searched location
    Object.keys(recentlySearched).forEach(location => {
        const data = recentlySearched[location];
        const cityItem = document.createElement('div');
        cityItem.classList.add('weather-item');
        renderWeather(cityItem,data);
        weatherInfo.appendChild(cityItem);
    });
}

function renderWeatherSummary(city, weatherSummary) {
    const weatherTable = document.getElementById('weather-info');

    // Create the table header for weather data
    let table = `
        <h2>Weather Summary for ${city}</h2>
        <table class="weather-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temperature (Day / Night / Morn / Eve)</th>
                    <th>Real Feel (Day / Night / Morn / Eve)</th>
                    <th>Description</th>
                    <th>Icon</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Iterate over the weather summary for each day and populate the rows
    weatherSummary.forEach(day => {
        table += `
            <tr>
                <td>${day.date}</td>
                <td>${day.temp.day}°C / ${day.temp.night}°C / ${day.temp.morn}°C / ${day.temp.eve}°C</td>
                <td>${day.realFeel.day}°C / ${day.realFeel.night}°C / ${day.realFeel.morn}°C / ${day.realFeel.eve}°C</td>
                <td>${day.weather.description}</td>
                <td><img src="http://openweathermap.org/img/wn/${day.weather.icon}@2x.png" alt="weather icon"></td>
            </tr>
        `;
    });

    // Close the table
    table += `
            </tbody>
        </table>
    `;

    // Insert the table into the weather-info div
    weatherTable.innerHTML = table;
}


function getWeatherSummary(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid=${newApi}`)
        .then(response => response.json())
        .then(data => {
            const city = data.city.name;  // Extract city name
            const dailyWeather = data.list; // Get the daily array containing the forecast for up to 16 days

            // Extract temperature, real feel, weather description, and icon for each day
            const weatherSummary = dailyWeather.map(day => ({
                temp: {
                    day: day.temp.day,
                    night: day.temp.night,
                    morn: day.temp.morn,
                    eve: day.temp.eve,
                },
                realFeel: {
                    day: day.feels_like.day,
                    night: day.feels_like.night,
                    morn: day.feels_like.morn,
                    eve: day.feels_like.eve,
                },
                weather: {
                    description: day.weather[0].description,
                    icon: day.weather[0].icon,
                },
                date: new Date(day.dt * 1000).toLocaleDateString(), // Convert Unix timestamp to readable date
            }));

            // Render the summary for up to 16 days
            renderWeatherSummary(city, weatherSummary);
        })
        .catch(error => {
            console.error('Error fetching 16-day weather data:', error);
        });
}


function getCoordinates(locationName) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                console.error('No results found for the specified location');
                return;
            }
            const locationData = data[0];
            const lat = locationData.lat;
            const lon = locationData.lon;
            console.log(`Latitude: ${lat}, Longitude: ${lon}`);

            // You can now use the lat and lon in another function, e.g., fetching weather data
            getWeatherSummary(lat, lon);
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}
