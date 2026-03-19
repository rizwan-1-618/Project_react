import { useState, useEffect } from 'react';
import './index.css';

const API_KEY = '895284fb2d2c50a520ea537456963d9c';

function App() {
  const [cityInput, setCityInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!searchQuery) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${API_KEY}&units=${unit}`
        );
        
        if (!response.ok) {
          throw new Error('City not found. Please try again.');
        }

        const data = await response.json();
        setWeatherData(data);

        setHistory(prev => {
          const newHistory = prev.filter(c => c.toLowerCase() !== data.name.toLowerCase());
          return [data.name, ...newHistory].slice(0, 5);
        });

      } catch (err) {
        setError(err.message);
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [searchQuery, unit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setSearchQuery(cityInput.trim());
    }
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  const handleHistoryClick = (city) => {
    setCityInput(city);
    setSearchQuery(city);
  };

  const getTemperatureSymbol = () => unit === 'metric' ? '°C' : '°F';

  return (
    <div className="app-container">
      <div className="weather-wrapper">
        <header className="header">
          <h1>Weather Checker</h1>
          <button className="unit-toggle" onClick={toggleUnit} title="Toggle Celsius / Fahrenheit">
            {unit === 'metric' ? 'Switch to °F' : 'Switch to °C'}
          </button>
        </header>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Enter city name..."
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        <main className="main-content">
          {loading && (
            <div className="status-message loading">
              <div className="spinner"></div>
              <p>Fetching weather data...</p>
            </div>
          )}

          {error && !loading && (
            <div className="status-message error">
              <p>{error}</p>
            </div>
          )}

          {!searchQuery && !loading && !error && (
            <div className="status-message empty">
              <p>Search for a city to see its weather.</p>
            </div>
          )}

          {weatherData && !loading && !error && (
            <div className="weather-card animate-fade-in">
              <div className="card-header">
                <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                <div className="weather-icon-wrapper">
                  <img 
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} 
                    alt={weatherData.weather[0].description} 
                    className="weather-icon"
                  />
                </div>
              </div>
              <div className="card-body">
                <div className="temperature-huge">
                  {Math.round(weatherData.main.temp)}<span className="unit">{getTemperatureSymbol()}</span>
                </div>
                <div className="condition">
                  {weatherData.weather[0].main} - <span className="description">{weatherData.weather[0].description}</span>
                </div>
                <div className="weather-details">
                  <div className="detail">
                    <span className="label">Feels Like</span>
                    <span className="value">{Math.round(weatherData.main.feels_like)}{getTemperatureSymbol()}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Humidity</span>
                    <span className="value">{weatherData.main.humidity}%</span>
                  </div>
                  <div className="detail">
                    <span className="label">Wind</span>
                    <span className="value">{weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {history.length > 0 && (
          <div className="history-section animate-fade-in">
            <h3>Recent Searches</h3>
            <div className="history-list">
              {history.map((city, index) => (
                <button 
                  key={`${city}-${index}`} 
                  className="history-chip"
                  onClick={() => handleHistoryClick(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
