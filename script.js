function updateDateTime() {
  const dayElement = document.getElementById("current-day");
  const timeElement = document.getElementById("current-time");

  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day = days[now.getDay()];
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  const time = `${formattedHours}:${formattedMinutes}${ampm}`;

  dayElement.textContent = day;
  timeElement.textContent = time;
}

// Update the time immediately and then every minute
updateDateTime();
setInterval(updateDateTime, 60000);
async function getWeather() {
  const apiKey = "c5910778062e87c33e7a3be4f6f3d19c"; // Replace with your OpenWeatherMap API key
  const location = document.querySelector(".search-bar").value;
  const weatherInfoDiv = document.getElementById("weather-info");

  weatherInfoDiv.style.color = "red";

  if (!location) {
    weatherInfoDiv.textContent = "Please enter a location.";
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    if (currentData.cod !== 200) {
      weatherInfoDiv.textContent = `Error: ${currentData.message}`;
      return;
    }

    if (forecastData.cod !== "200") {
      weatherInfoDiv.textContent = `Error: ${forecastData.message}`;
      return;
    }

    weatherInfoDiv.textContent = ``;

    const { name, main, weather, wind, sys } = currentData;
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();

    document.getElementById("location").textContent = name;
    document.getElementById("weather").textContent = weather[0].main;
    document.getElementById("temp").textContent = `${Math.round(main.temp)} °C`;
    document.getElementById("description").textContent = weather[0].description;
    document.getElementById("humidity").textContent = `${main.humidity}%`;
    document.getElementById("pressure").textContent = `${main.pressure} hPa`;
    document.getElementById("wind").textContent = `${wind.speed} m/s`;
    document.getElementById("sunrise").textContent = sunrise;
    document.getElementById("sunset").textContent = sunset;

    setWeatherBackground(weather[0].main);
    displayForecast(forecastData);
  } catch (error) {
    weatherInfoDiv.textContent =
      "Error fetching weather data. Please try again later.";
  }
}

function displayForecast(forecastData) {
  const forecastContainer = document.querySelector(".forecast-container");
  forecastContainer.innerHTML = ""; // Clear any previous forecast

  const forecastList = forecastData.list;

  // Extract forecast for 12:00 PM each day
  const dailyForecast = forecastList.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  dailyForecast.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const dayLabel = date.toLocaleDateString(undefined, { weekday: "long" });
    const weatherIcon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
    const maxTemp = forecast.main.temp_max;
    const minTemp = forecast.main.temp_min;

    const forecastCard = document.createElement("div");
    forecastCard.classList.add("weather-info", "weather-card");

    forecastCard.innerHTML = `
        <div class="label">${dayLabel}</div>
        <img class="weather-icon" src="${weatherIcon}" alt="${forecast.weather[0].description}" />
        <div class="temperature-content">
          <div class="weather-label" style="padding-bottom: 8px">
            <span class="label">Max : </span>
            <span>${maxTemp}°C</span>
          </div>
          <div class="weather-label">
            <div class="label">Min :</div>
            <div>${minTemp}°C</div>
          </div>
        </div>
      `;

    forecastContainer.appendChild(forecastCard);
  });
}

function setWeatherBackground(weather) {
  const weatherBg = document.getElementById("weather_bg");
  let imagePath = "";

  switch (weather) {
    case "Rainy":
      imagePath = "src/rainy.jpg";
      break;
    case "Clouds":
      imagePath = "src/cloudy.jpg";
      break;
    case "Snowy":
      imagePath = "src/snowy.jpg";
      break;
    case "Sunny":
      imagePath = "src/sunny.jpg";
      break;
    default:
      imagePath = "src/sunny.jpg";
  }

  if (imagePath) {
    weatherBg.style.backgroundImage = `url(${imagePath})`;
  } else {
    weatherBg.style.backgroundImage = "none";
  }
}

setWeatherBackground("Sunny");
