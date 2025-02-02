const apiKey = "b1f5230b991fd6526220537cf9986d1a";
const weatherInfo = document.getElementById("weather-info");
const forecastInfo = document.getElementById("forecast");
const searchBtn = document.getElementById("search-btn");
const resetBtn = document.getElementById("reset-btn");
const cityInput = document.getElementById("city-input");
const body = document.body;
const dark = document.getElementById("dark-mode-toggle");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        getForecast(city);
    } else {
        alert("Please enter a city!");
    }
});

resetBtn.addEventListener("click", () => {
    cityInput.value = "";
    weatherInfo.innerHTML = "";
    forecastInfo.innerHTML = "";
    body.className = "";
});

dark.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
                changeBackground(data.weather[0].main);
            } else {
                weatherInfo.innerHTML = "City not found!";
            }
        })
        .catch(error => console.error("Error fetching weather:", error));
}

function displayWeather(data) {
    const { name, main, weather } = data;
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherInfo.innerHTML = `
        <h2>${name}</h2>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>Temperature: ${main.temp}°C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Condition: ${weather[0].description}</p>
    `;
}

function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                displayForecast(data.list);
            } else {
                forecastInfo.innerHTML = "Forecast data unavailable.";
            }
        })
        .catch(error => console.error("Error fetching forecast:", error));
}

function displayForecast(forecastList) {
    let forecastHTML = "<h3>5-Day Forecast</h3>";
    const dailyForecasts = forecastList.filter(day => day.dt_txt.includes("12:00:00"));
    
    dailyForecasts.forEach(day => {
        const iconCode = day.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        forecastHTML += `
            <p>${new Date(day.dt_txt).toDateString()}: ${day.main.temp}°C, ${day.weather[0].description}</p>
            <img src="${iconUrl}" alt="Weather Icon">
        `;
    });
    forecastInfo.innerHTML = forecastHTML;
}