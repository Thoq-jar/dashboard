import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import Image from 'next/image';

const errorMessages = [
  'Oh 💩! Connection to Server failed: Change IP address?',
];

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

function toggleAPI() {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (localStorage.getItem('api') === 'true') {
      localStorage.setItem('api', 'false');
    } else if (localStorage.getItem('api') === 'false') {
      localStorage.setItem('api', 'true');
    } else {
      localStorage.setItem('api', 'false');
    }
    window.location.reload();
  }
}

function getGreeting(hour: number): string {
  switch (true) {
    case hour >= 5 && hour < 12:
      return 'Good morning';
    case hour >= 12 && hour < 18:
      return 'Good afternoon';
    case hour >= 18 && hour < 22:
      return 'Good evening';
    default:
      return 'Good night';
  }
}

async function fetchLocation(): Promise<{ lat: number, lon: number }> {
  const response = await fetch('http://ip-api.com/json');
  const data = await response.json();
  return {
    lat: data.lat,
    lon: data.lon,
  };
}

async function fetchSunriseSunset(lat: number, lon: number): Promise<{ sunrise: string, sunset: string }> {
  const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`);
  const data = await response.json();
  return {
    sunrise: new Date(data.results.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sunset: new Date(data.results.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

function mapWeatherCodeToDescription(code: number): string {
  const weatherDescriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Drizzle: Light',
    53: 'Drizzle: Moderate',
    55: 'Drizzle: Dense intensity',
    56: 'Freezing Drizzle: Light',
    57: 'Freezing Drizzle: Dense intensity',
    61: 'Rain: Slight',
    63: 'Rain: Moderate',
    65: 'Rain: Heavy intensity',
    66: 'Freezing Rain: Light',
    67: 'Freezing Rain: Heavy intensity',
    71: 'Snow fall: Slight',
    73: 'Snow fall: Moderate',
    75: 'Snow fall: Heavy intensity',
    77: 'Snow grains',
    80: 'Rain showers: Slight',
    81: 'Rain showers: Moderate',
    82: 'Rain showers: Violent',
    85: 'Snow showers slight',
    86: 'Snow showers heavy',
    95: 'Thunderstorm: Slight or moderate',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return weatherDescriptions[code] || 'Unknown weather condition';
}

function mapWeatherCodeToIcon(code: number): string {
  const weatherIcons: { [key: number]: string } = {
    0: '01d',
    1: '01d',
    2: '02d',
    3: '04d',
    45: '50d',
    48: '50d',
    51: '09d',
    53: '09d',
    55: '09d',
    56: '13d',
    57: '13d',
    61: '10d',
    63: '10d',
    65: '10d',
    66: '13d',
    67: '13d',
    71: '13d',
    73: '13d',
    75: '13d',
    77: '13d',
    80: '09d',
    81: '09d',
    82: '09d',
    85: '13d',
    86: '13d',
    95: '11d',
    96: '11d',
    99: '11d',
  };
  return `http://openweathermap.org/img/wn/${weatherIcons[code]}@2x.png`;
}

async function fetchWeatherCondition(lat: number, lon: number): Promise<{ description: string, icon: string }> {
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
  const data = await response.json();
  const weatherCode = data.current_weather.weathercode;
  return {
    description: mapWeatherCodeToDescription(weatherCode),
    icon: mapWeatherCodeToIcon(weatherCode),
  };
}

function convertCelsiusToFahrenheit(celsius: number): number {
  return celsius * 9 / 5 + 32;
}

function formatTemperature(temp: any): any {
  return temp.toFixed(2);
}

interface PanelContentsProps {
  onImageUpload: (base64Image: string) => void;
  onRevertToDefault: () => void;
}

export default function PanelContents({ onImageUpload, onRevertToDefault }: PanelContentsProps) {
  const [greeting, setGreeting] = useState('');
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [sunsetOrRise, setSunsetOrRise] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState(formatDate(new Date()));
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [weatherIcon, setWeatherIcon] = useState('');
  const [ip, setIp] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('ip') || 'error';
    }
    return 'error';
  });
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          onImageUpload(e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  async function search(): Promise<void> {
    const query = (document.getElementById('searchBar') as HTMLInputElement).value;
    let url;
    let searchQuery = query;

    switch (true) {
      case query.toLowerCase().startsWith('duckduckgo'):
        searchQuery = query.slice('duckduckgo'.length).trim();
        url = searchQuery ? `https://www.duckduckgo.com/?q=${searchQuery}` : `https://www.duckduckgo.com`;
        break;

      case query.toLowerCase().startsWith('bing'):
        searchQuery = query.slice('bing'.length).trim();
        url = searchQuery ? `https://www.bing.com/search?q=${searchQuery}` : `https://www.bing.com`;
        break;

      case query.toLowerCase().startsWith('google'):
        searchQuery = query.slice('google'.length).trim();
        url = searchQuery ? `https://www.google.com/search?q=${searchQuery}` : `https://www.google.com`;
        break;

      default:
        url = `https://www.duckduckgo.com/?q=${query}`;
    }
    window.open(url, '_blank');
  }

  const getData = useCallback(async (): Promise<void> => {
    try {
      if (localStorage.getItem('api') === 'true') {
        const response = await fetch(`http://${ip}`);
        const data = await response.json();
        setHumidity(data.humidity);
        setTemperature(formatTemperature(data.temperature));
      } else {
        const { lat, lon } = await fetchLocation();
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=relative_humidity_2m`);
        if (!response.ok) {
          console.error('Failed to fetch weather data from Open-Meteo');
        }
        const data = await response.json();

        const hourlyData = data.hourly.relative_humidity_2m[data.hourly.time.length - 1];

         const currentWeatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const currentWeatherData = await currentWeatherResponse.json();

        setHumidity(hourlyData);
        const temperatureInFahrenheit = convertCelsiusToFahrenheit(currentWeatherData.current_weather.temperature);
        const formattedTemperature = formatTemperature(temperatureInFahrenheit);
        setTemperature(formattedTemperature);
      }

    } catch (error: any) {
      if (localStorage.getItem('api') === 'true') {
        const ipElement = document.getElementById('ip') as HTMLParagraphElement;
        ipElement.innerText = errorMessages[0];
      } else {
        console.error('Error fetching weather data:', error);
      }
    }
  }, [ip]);

  useEffect(() => {
    getData().then();
  }, [getData]);


  useEffect(() => {
    getData().then();

    fetchLocation().then(({ lat, lon }) => {
      fetchSunriseSunset(lat, lon).then(({ sunrise, sunset }) => {
        setSunrise(sunrise);
        setSunset(sunset);
        fetchWeatherCondition(lat, lon).then(({ description, icon }) => {
          setWeatherCondition(description);
          setWeatherIcon(icon);
        });

        const intervalId = setInterval(() => {
          if (ip === 'error') {
            const ip = document.getElementById('ip') as HTMLParagraphElement;
            ip.innerText = 'Connection to Server failed! Change IP address?';
          }
          const now = new Date();
          setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setDate(formatDate(now));
          setGreeting(getGreeting(now.getHours()));
          setSunsetOrRise(`sunrise is at ${sunrise}\nand sunset is at ${sunset}`);
        }, 1000);
        return () => clearInterval(intervalId);
      });
    });
  }, [getData, ip]);

  useEffect(() => {
    const now = new Date();
    setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setGreeting(getGreeting(now.getHours()));
    setSunsetOrRise(`sunrise is at ${sunrise}\nand sunset is at ${sunset}`);
  }, [sunrise, sunset]);

  return (
    <main style={{ display: 'flex' }}>
      <div className="wrapper" style={{
        display: 'flex',
        textAlign: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: '10px', left: '10px', textAlign: 'left' }}>
          <h2 className="no-select" style={{
            fontSize: '50px',
            fontWeight: 'lighter',
            cursor: 'default',
            paddingLeft: '10%',
            whiteSpace: 'nowrap',
          }}>
            {time}
          </h2>

          <h3 className="no-select"
              style={{
                marginTop: '-10%',
                fontSize: '25px',
                fontWeight: 'lighter',
                cursor: 'default',
                paddingLeft: '10%',
                whiteSpace: 'nowrap',
              }}>
            {date}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '-0.6rem' }}>
              <p style={{ fontSize: '25px', fontWeight: 'lighter', marginRight: '10px' }}>{weatherCondition}</p>
              <Image src={weatherIcon} width={50} height={50} alt="Failed to load :("
                     style={{ width: '50px', height: '50px', marginTop: '5px' }} className={'weather-icon'} />
            </div>
          </h3>
        </div>

        <h1 className={'no-select'}
            style={{ fontSize: '70px', marginBottom: '3rem', fontWeight: 'lighter' }}>
          Dashboard
        </h1>

        <form onSubmit={(event) => {
          event.preventDefault();
          search().then();
        }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.5rem' }}>
          <input placeholder={'Search the Internet'} name="searchBar" id="searchBar" className={'searchBar'} />
        </form>

        <p className={'no-select'}
           style={{ fontSize: '45px', marginBottom: '0.2rem', fontWeight: 'lighter' }}>{greeting}!</p>

        <p style={{ fontSize: '25px', fontWeight: 'lighter', cursor: 'pointer' }} id={'ip'}
           onClick={() => {
             const newIp = prompt('Enter new IP address:');
             if (newIp) {
               setIp(newIp);
               if (typeof window !== 'undefined' && window.localStorage) {
                 localStorage.setItem('ip', newIp);
               }
             }
           }}>
        </p>

        <p style={{ fontSize: '40px', marginBottom: '-2rem', fontWeight: 'lighter' }}>The Temperature
          is {temperature ? `${temperature} ˚F` : 'N/A'}</p>

        <p style={{ fontSize: '40px', marginBottom: '-0.1rem', fontWeight: 'lighter' }}>
          while the Humidity is around {humidity ? `${humidity} %` : 'N/A'}
        </p>

        <p style={{
          fontSize: '40px',
          marginBottom: '0.3rem',
          fontWeight: 'lighter',
          whiteSpace: 'pre-line',
        }}>The {sunsetOrRise}</p>
      </div>
      <div className="toolbar" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1' }}>
        <label style={{ cursor: 'default' }}
               className={'no-select toolbar-section-label no-select toolbar-title-label-size'}>Toolbar</label>
        <label style={{ cursor: 'default' }}
               className={'no-select no-select toolbar-section-label-size'}>Wallpaper</label>
        <label style={{ cursor: 'default' }}
               className={'no-select no-select toolbar-section-subtitle-size'}>Options:</label>
        <label htmlFor="upload-image" style={{ cursor: 'pointer' }} className={'button no-select'}>Upload</label>
        <input type="file" id="upload-image" style={{ display: 'none' }} onChange={handleImageUpload} />
        <button onClick={onRevertToDefault} className={'button no-select'}>Default</button>
        <button onClick={toggleAPI} className={'button no-select'}>API</button>
      </div>
    </main>
  );
}
