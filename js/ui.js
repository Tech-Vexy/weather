
export function displayCurrentWeather(data) {
    const countryCode = data.sys.country;
    fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`) // Fetch country name using REST Countries API
        .then(res => res.json())
        .then(countryData => {
            
            const countryName = countryData[0].name.common;
            const weatherData = {
                location: data.name,
                temp: data.main.temp,
                cloudCover: data.clouds ? data.clouds.all : 0,
                wind: data.wind.speed,
                pressure: data.main.pressure,
                humidity: data.main.humidity,
                time: convertTimestamp(data.dt),
                low: data.main.temp_min,
                high: data.main.temp_max,
                description: data.weather[0].description,
                realFeel: data.main.feels_like,
                iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
            }
            const current = document.getElementById('weather-container');
            const title = document.getElementById('title');

            title.textContent = `${weatherData.location}, ${countryName} weather forecast | AeroWeather`;

            current.innerHTML = `
        <div class="current-weather">
    <div class="location">
        <i class="fas fa-map-marker-alt"></i>
        <span class="location-name">${weatherData.location}, ${countryName}</span>
    </div>
    <p style="font-family: Lato,serif;font-size: 18px">${weatherData.time}</p>
    <div class="temperature">
       <img src="${weatherData.iconUrl}" alt="${weatherData.description}">
        <span class="temp-value">${weatherData.temp}&#xB0;c</span>
        <span class="feels-like">Feels like ${weatherData.realFeel}&#xB0;</span>
    </div>
                   
        <div class="weather-conditions">
        <div class="condition-item">
            <p>Wind</p>
            <p>${weatherData.wind} m/s</p>
        </div>
        <div class="condition-item">
            <p>Humidity</p>
            <p>${weatherData.humidity}%</p>
        </div>
        <div class="condition-item">
            <p>Pressure</p>
            <p>${weatherData.pressure} hPa</p>
        </div>
    </div>
        
            `
        });

}

export function displayWeatherForecast(data) {
    const forecastInfo = document.getElementById('forecast');
    document.getElementById('forecast-title').textContent = "Weather Forecast";
    const forecast = data.list;
    const days = {};
    forecastInfo.innerHTML = '';
    forecast.forEach(entry => {
        const date = new Date(entry.dt*1000).toLocaleDateString('en-GB',{weekday: 'short',day: 'numeric'});
        if (!days[date]) {
            days[date] = [];
        }
        days[date].push(entry);
    });
    Object.keys(days).forEach(date => {
        const dayData = days[date][0];
        //const temp = dayData.main.temp;
        const high = dayData.main.temp_max;
        const low = dayData.main.temp_min;
        const description = dayData.weather[0].description;
        const icon = dayData.weather[0].icon;
        forecastInfo.innerHTML += `
       <div class="weather-day">
        <h3>${date}</h3>
       <div class="forecast-day" style="display: flex;">
       <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}">
        <div class="forecast-temp">
        <span class="high-temp">${high}&#xB0;</span>
        <span class="low-temp">${low}&#xB0;</span>
    </div>
</div>
        </div>
        `
    })
}

export function displayNews(news) {
    const newsDiv = document.getElementById('news-list');
    for (let i = 0; i < 12; i++) {
        const title = news[i].title;
        const image = news[i].imageUrl;
        const link = news[i].link;

        newsDiv.innerHTML += `
<div class="news-item">
<figure>
 <img src="${image}" alt="${title}" >
 <figcaption>
  <a href="${link}" target="_blank">${title}</a>
</figcaption>
</figure>
</div>
               
               
            `;
    }

}
function convertTimestamp(timestamp) {
    const date = new Date(timestamp*1000);
    let hours = date.getHours().toString().padStart(2,'0');
    const minutes = date.getMinutes().toString().padStart(2,'0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes} ${ampm}`;
}

