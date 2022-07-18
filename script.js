"use strict";

const searchTextEl = document.querySelector(".search-box input");
const searchIcon = document.querySelector(".search-icon");
const btnModal = document.querySelector(".modal button");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const message = document.querySelector(".modal p");
const spinner = document.querySelector(".spinner");
const weatherDataWrapper = document.querySelector(".section-weather-data");

// Data
const cityName = document.querySelector(".section-weather-data .city-name");
const condition = document.querySelector(".section-weather-data .condition");
const celcius = document.querySelector(".weather-data .cel");
const Img = document.querySelector(".weather-data .img-box img");
const humid = document.querySelector(".weather-data .humid");
const wind = document.querySelector(".weather-data .wind");
const country = document.querySelector(".section-weather-data .country");

const openWeatherKey = "1bc4821c828fbe336477348d8bd7271c";
const openCageKey = "c31178b1eb38434b8832a79d04fee5ff";

// Get Weather data from api
const weatherData = async function (city = "") {
  displayLoading();
  const openWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchTextEl.value.trim()}${city}&APPID=${openWeatherKey}`;
  const fetchPromise = await fetch(openWeatherApi);
  const res = await fetchPromise.json();
  weatherResponse(res);
};

// When input text is empty
function EmptyField() {
  modal.classList.add("active");
  overlay.classList.add("active");
  message.textContent = "Enter The city";
}

// Show loading Spinner
function displayLoading() {
  spinner.classList.add("active");
}

// Hide loading Spinner
function hideLoading() {
  spinner.classList.remove("active");
}

// When click on search Icon
searchIcon.addEventListener("click", function () {
  weatherDataWrapper.style.display = "none";
  searchTextEl.value.length !== 0 ? weatherData() : EmptyField();
  searchTextEl.value = "";
});

// On Enter Key
searchTextEl.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    weatherDataWrapper.style.display = "none";
    searchTextEl.value.length !== 0 ? weatherData() : EmptyField();
    searchTextEl.value = "";
  }
});

// Remove modal and overlay classes
function removeModal() {
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

// When click on  modal btn (modal and overlay will be close)
btnModal.addEventListener("click", function () {
  removeModal();
});

// When click on overlay (modal and overlay will be close)
overlay.addEventListener("click", function () {
  removeModal();
});

// Get Geolocation
function getLocation() {
  console.log("it work");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
  console.log("it work");
}

function showPosition(position) {
  console.log(position.coords.latitude, position.coords.longitude);
  currentPosition(position.coords.latitude, position.coords.longitude);
}

// Get city name from latitude and longitude api
const currentPosition = async function (lat, log) {
  weatherDataWrapper.style.display = "none";
  const openCageDataApi = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${log}&key=${openCageKey}`;
  const response = await fetch(openCageDataApi);
  const res = await response.json();
  const [
    {
      components: { city },
    },
  ] = res.results;
  weatherData(city);
};

function weatherResponse(res) {
  if (res.cod === 200) {
    hideLoading();
    weatherDataWrapper.style.display = "block";

    const {
      name,
      main: { humidity, temp },
      wind: { speed },
      sys: { country: currentLocation },
      weather: [{ description, icon }],
    } = res;

    cityName.textContent = name;
    condition.textContent = description;
    country.textContent = currentLocation;
    celcius.textContent = `${Math.ceil(temp - 273.15)}°C`;
    Img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    humid.textContent = `Humid: ${humidity}%`;
    wind.textContent = `Wind: ${speed.toFixed(1)}km/h`;
  } else {
    hideLoading();
    EmptyField();
    if (message.textContent.length !== 0) {
      message.textContent = res?.message;
    } else {
      message.textContent = "Enter The city";
    }
  }
}
