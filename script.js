const apiKey = "6dcdd6a97e114c88ab090208250409";

const cityInput = document.getElementById("cityInput");
const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const weatherIconEl = document.getElementById("weatherIcon");
const weatherCard = document.getElementById("weatherCard");
const errorEl = document.getElementById("error");
const forecastSection = document.getElementById("forecastSection");
const forecastContainer = document.getElementById("forecastContainer");
const spinner = document.getElementById("spinner");

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    errorEl.textContent = "⚠️ Please enter a city name!";
    errorEl.classList.remove("hidden");
    return;
  }

  try {
    // Show spinner
    spinner.classList.remove("hidden");
    weatherCard.classList.add("hidden");
    forecastSection.classList.add("hidden");
    errorEl.classList.add("hidden");

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=yes&alerts=no`;
    const response = await fetch(url);
    const data = await response.json();

    // Hide spinner
    spinner.classList.add("hidden");

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Current Weather
    cityNameEl.textContent = `${data.location.name}, ${data.location.country}`;
    tempEl.textContent = `🌡️ ${data.current.temp_c}°C`;
    descEl.textContent = `🌤️ ${data.current.condition.text}`;
    humidityEl.textContent = data.current.humidity + "%";
    windEl.textContent = data.current.wind_kph + " kph";
    weatherIconEl.src = "https:" + data.current.condition.icon;

    weatherCard.classList.remove("hidden");

    // Forecast
    forecastSection.classList.remove("hidden");
    forecastContainer.innerHTML = "";

    data.forecast.forecastday.forEach(day => {
      const card = document.createElement("div");
      card.classList.add("forecast-card");

      const date = document.createElement("h3");
      date.textContent = new Date(day.date).toDateString();

      const icon = document.createElement("img");
      icon.src = "https:" + day.day.condition.icon;

      const temp = document.createElement("p");
      temp.textContent = `🌡️ ${day.day.avgtemp_c}°C`;

      const condition = document.createElement("p");
      condition.textContent = day.day.condition.text;

      card.appendChild(date);
      card.appendChild(icon);
      card.appendChild(temp);
      card.appendChild(condition);

      forecastContainer.appendChild(card);
    });

  } catch (err) {
    spinner.classList.add("hidden");
    weatherCard.classList.add("hidden");
    forecastSection.classList.add("hidden");
    errorEl.textContent = `⚠️ ${err.message}`;
    errorEl.classList.remove("hidden");
  }
}