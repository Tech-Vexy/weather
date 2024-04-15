function getWeather() {
  getNews();
  const location = document.getElementById('location').value;
  const apiKey = '51af0907a4a8742dc7ce9271bfdbeafb'; // Get your API key from OpenWeatherMap

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      const weatherInfo = document.getElementById('weather-info');
      const iconCode = data.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

      weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img class="weather-icon" src="${iconUrl}" alt="${data.weather[0].description}">
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Pressure: ${data.main.pressure} hPa</p>
      `;
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      const weatherInfo = document.getElementById('weather-info');
      weatherInfo.innerHTML = '<p class="error-message">City not found. Please enter a valid city name.</p>';
    });
}
function getNews() {
  const apiKey = 'e99bec0cdfbf476eb6c0f6edeafeae35'; // Get your news API key
  const country = 'ke'; // Change country code if needed
  const category = 'weather'; // You can change the category based on your preference

  fetch(`https://newsapi.org/v2/top-headlines/sources?country=${country}&category=${category}&apiKey=${apiKey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      return response.json();
    })
    .then(data => {
      const newsContainer = document.getElementById('news');
      newsContainer.innerHTML = '<h2>Latest Weather News</h2>';
      const articles = data.articles.slice(0, 5); // Limit to 5 articles
      articles.forEach(article => {
        const { title, description, url } = article;
        const articleElement = document.createElement('div');
        articleElement.classList.add('article');
        articleElement.innerHTML = `
          <h3><a href="${url}" target="_blank">${title}</a></h3>
          <p>${description}</p>
        `;
        newsContainer.appendChild(articleElement);
      });
    })
    .catch(error => {
      console.error('Error fetching news:', error);
      const newsContainer = document.getElementById('news');
      newsContainer.innerHTML = '<p class="error-message">Failed to fetch news. Please try again later.</p>';
    });
}
