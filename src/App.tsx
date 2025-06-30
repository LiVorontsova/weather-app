import React, { useEffect, useState } from 'react'
import './App.scss';
import { API_KEY } from './API_KEY'
import WindIcon from './icons/wind'
import HumidityIcon from './icons/humidity'

function App() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [forecast, setForecast] = useState<any>([]);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false)

  const fetchWeatherData = (cityName: string) => {
    setLoading(true)
    setSearchInput('')
    fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=3`
    )
      .then((data) => data.json())
      .then((data) => {
        setWeatherData(data?.current || [])
        setLocation(data?.location || null)
        setForecast(data?.forecast?.forecastday || [])
      })
      .catch((error) => {
        setError(true)
        console.log(error)
      })
      .finally(() => setLoading(false)
      )
  }

  useEffect(() => {
    fetchWeatherData('Belgrade')
  }, [])

  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    fetchWeatherData(searchInput)
  }

  return (
    <div className="App">
      <header className="header">Weather App</header>
      <div className="wrapper">
        <form onSubmit={handleSearch} className="searchForm">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter city name"
            className="searchInput"
          />
          <button type="submit" className="button">
            Search
          </button>
        </form>

        {loading &&
          <div className='msg'>Loading...</div>
        }

        {!loading && error &&
          <div className='msg'>Something went wrong</div>
        }

        {!loading && !error && weatherData && location &&
          <>
            <h1 className="location">{location.name}</h1>
            <div className="condition">{weatherData.condition.text}</div>

            <div className='locationInfo'>
              <div className="temperature">{weatherData.temp_c}°</div>
              <img src={weatherData.condition.icon} alt={weatherData.condition.text} />
            </div>

            <div className="details">
              <div>
                <HumidityIcon width={'2rem'} height={'2rem'} color={'white'} />
                <div>{weatherData.humidity}%</div>
              </div>
              <div>
                <WindIcon width={'2rem'} height={'2rem'} color={'white'} />
                <div>{weatherData.wind_kph} kph</div>
              </div>
            </div>

            <div className="forecast">
              <div className="forecastWrapper">
                {forecast.map((item: any, ind: number) => {
                  return (
                    <div className="forecastDay" key={`${item.date}-${ind}`}>
                      <div>{new Date(item.date || new Date()).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}</div>
                      <img src={item.day.condition.icon} alt={item.day.condition.text} />
                      <div>{item.day.maxtemp_c}°</div>
                    </div>
                  )
                })}
              </div>
            </div>

          </>
        } </div>
    </div>
  );
}

export default App;
