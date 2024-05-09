let todayData = document.getElementById("today-data")
let todayName = document.getElementById("today-date-day-name")
let todayNumber = document.getElementById("today-date-day-number")
let todayMonth = document.getElementById("today-date-month")
let todayLocation = document.getElementById("today-location")
let todayTemp = document.getElementById("today-temp")
let todayConditionImg = document.getElementById("today-condition-img")
let todayConditionText = document.getElementById("today-condition-text")
let today =document.getElementById("today")
let humidity =document.getElementById("humidity")
let wind =document.getElementById("wind")
let windDirection =document.getElementById("wind-direction")
let weatherData
// next day
let nextDay = document.getElementsByClassName("next-day-name")
let nextConditionImg = document.getElementsByClassName("next-condition-img")
let nextMaxTemp = document.getElementsByClassName("next-max-temp")
let nextMinTemp = document.getElementsByClassName("next-min-temp")
let nextConditionText = document.getElementsByClassName("next-condition-text")
// search
let searchInput = document.getElementById("search")




async function getWeatherData(cityName) {
    try {
        let weatherResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=1439b310d19042f4a2f170331242501&q=${cityName}&days=3`);
        if (!weatherResponse.ok) {
            throw new Error(`Failed to fetch weather data. Status: ${weatherResponse.status}`);
        }
        let weatherData = await weatherResponse.json();
        return weatherData;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        // Handle the error gracefully, display a message to the user, etc.
        return null;
    }
}


// Function to load image asynchronously
async function loadImageAsync(url) {
    try {
        const img = new Image();
        img.onload = () => console.log("Image loaded successfully:", url);
        img.onerror = () => console.error("Error loading image:", url);
        img.src = url;
        await img.decode(); // Optional: Wait for image decoding to complete
        return img;
    } catch (error) {
        console.error("Error loading image:", error);
        return null;
    }
}


// Function to display today's weather data
async function displayDataToday(data) {
    let todayDate = new Date();
    todayName.innerHTML = todayDate.toLocaleDateString("en-us", { weekday: "long" });
    todayNumber.innerHTML = todayDate.getDate();
    todayMonth.innerHTML = todayDate.toLocaleDateString("en-us", { month: "long" });

    todayLocation.innerHTML = data.location.name;
    todayTemp.innerHTML = data.current.temp_c;
    todayConditionText.innerHTML = data.current.condition.text;
    humidity.innerHTML = data.current.humidity + '%';
    wind.innerHTML = data.current.wind_kph + 'km/h';
    windDirection.innerHTML = data.current.wind_dir;

    try {
        const img = await loadImageAsync('https:'+data.current.condition.icon);
        todayConditionImg.src = img.src;
    } catch (error) {
        console.error("Error loading image:", error);
    }
}

// Function to display next day's weather data
async function displayNextDay(data) {
    let forecastDay = data.forecast.forecastday;
    for (let i = 0; i < 2; i++) {
        let nextDate = new Date(forecastDay[i + 1].date);
        nextDay[i].innerHTML = nextDate.toLocaleDateString("en-us", { weekday: "long" });
        nextMaxTemp[i].innerHTML = forecastDay[i + 1].day.maxtemp_c;
        nextMinTemp[i].innerHTML = forecastDay[i + 1].day.mintemp_c;
        nextConditionText[i].innerHTML = forecastDay[i + 1].day.condition.text;

        try {
            const img = await loadImageAsync('https:'+forecastDay[i + 1].day.condition.icon);
            nextConditionImg[i].src = img.src;
        } catch (error) {
            console.error("Error loading image:", error);
        }
    }
}

// Function to start the application
async function startApp(city = "cairo") {
    let weatherData = await getWeatherData(city);
    if (!weatherData.error) {
        displayDataToday(weatherData);
        displayNextDay(weatherData);
    }
}

// Event listener for search input
searchInput.addEventListener("input", function() {
    startApp(searchInput.value);
});

// Initial call to start the app
startApp();
