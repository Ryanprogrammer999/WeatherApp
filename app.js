const API_KEY = '455669c7dd92a99fc4403d08bf31ba33';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('weatherForm');
    form.addEventListener('submit' , async (event) => {
        event.preventDefault();
        const cityInput = document.getElementById('cityInput').value.trim();
        if (cityInput === '') return;
        try {
            const weatherData = await fetchWeatherData(cityInput);
            displayWeather(weatherData);
            saveToLocalStorage(cityInput, weatherData);
        } catch (error) {
            console.error(error);
            alert('Kon het weer niet ophalen.');
        }
    });

    loadFromLocalStorage();
});

const fetchWeatherData = async (city) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=455669c7dd92a99fc4403d08bf31ba33&units=metric`);
    if (!response.ok) throw new Error('Weerdata niet gevonden');
    return await response.json();
}

const displayWeather = (data) => {
    const { name, main: { temp, humidity} , weather: [details]} = data;
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = `
    <h2>Weer in ${name}</h2>
    <p>Temperatuur: ${temp}°C</p>
    <p>Luchtvochtigheid: ${humidity}%</p>
    <p>Beschrijving: ${details.description}</p>
    `;
    weatherResult.style.display = 'block';
};

const saveToLocalStorage = (city , data) => {
    const weatherData = { city , data, timestamp: Date.now()};
    localStorage.setItem('weatherData', JSON.stringify(weatherData));
};

const loadFromLocalStorage = () => {
    const weatherData = JSON.parse (localStorage.getItem('weatherData'));
    if (weatherData) {
        const { city, data, timestamp } = weatherData;
        const oneHour = 3600000;
        if (Date.now() - timestamp < oneHour) {
            displayWeather(data);
        } else {
            localStorage.removeItem('weatherData');
        }
    }
};

