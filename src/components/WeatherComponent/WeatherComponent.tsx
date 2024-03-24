import React, { useEffect, useState } from 'react';
import CLOUD from '../../icons/cloudy.svg';
import CLEAR from '../../icons/clear-day.svg';
import RAIN from '../../icons/rain.svg';
import './styles.css';

const ICONS = {
  Cloudy: CLOUD,
  Sunny: CLEAR,
  Rain: RAIN,
  Clear: CLEAR
}

interface IconInterface {
  Cloudy: string,
  Sunny: string,
  Rain: string,
  Clear: string
}

interface WeatherComponentProps {
  lat: string;
  lon: string;
}

interface DayWeather {
  condition: string
  conditionName: string
  day: string
}

const WeatherComponent: React.FC<WeatherComponentProps> = ({ lat, lon }) => {
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<Boolean>(true);

  useEffect(() => {
    setWeatherLoading(true);
    const fetchWeatherData = async () => {
      fetch(`http://localhost:3030/integration/weather?lat=${lat}&lon=${lon}`)
        .then(res => {
          return res.json()
        })
        .then(data => {
          setWeatherData(data.data);
          setTimeout(() => {
            setWeatherLoading(false)
          }, 500)
        })
        .catch(err => {
          console.error(err);
          setWeatherLoading(false);
        })
    };

    fetchWeatherData();
  }, []);

  return weatherLoading ? <h3 style={{textAlign: 'center'}}>Loading Weather...</h3> :  (
    <div className="WeatherComponent">
      <p className="Location">{weatherData.location}</p>
      <div className="Degree_Condition">
      <img src={ICONS[weatherData.conditionName as keyof IconInterface]} alt={weatherData.conditionName} />
        <div>
          <p>{weatherData.temperature}&deg;{weatherData.unit.toUpperCase()}</p>
          <span>{weatherData.conditionName}</span>
        </div>
      </div>
      <div>
        <div className="Upcomming_Weather">
          {weatherData.upcomming.map((dayWeather: DayWeather, index: number) => (
            <div key={index}>
              <img src={ICONS[dayWeather.conditionName as keyof IconInterface]} alt={dayWeather.conditionName} />
              <p>{dayWeather.day}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(WeatherComponent);