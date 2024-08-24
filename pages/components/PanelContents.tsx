import { useEffect, useState } from 'react';
import React from 'react';

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
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

export default function PanelContents() {
  const [greeting, setGreeting] = useState('');
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [sunsetOrRise, setSunsetOrRise] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState(formatDate(new Date()));
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');
  const [ip, setIp] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('ip') || '192.168.1.28';
    }
    return 'error';
  });

  async function search(): Promise<void> {
    const query = (document.getElementById('searchBar') as HTMLInputElement).value;
    let url;
    let searchQuery = query;

    switch (true) {
      case query.toLowerCase().startsWith('duckduckgo'):
        searchQuery = query.slice('duckduckgo'.length).trim();
        url = searchQuery ? `https://www.duckduckgo.com/search?q=${searchQuery}` : `https://www.duckduckgo.com`;
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
        url = `https://www.duckduckgo.com/search?q=${query}`;
    }
    window.open(url, '_blank');
  }

  async function getData(): Promise<void> {
    try {
      const response = await fetch(`http://${ip}`);
      const data = await response.json();
      setTemperature(data.temperature);
      setHumidity(data.humidity);
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    getData().then();

    fetchLocation().then(({ lat, lon }) => {
      fetchSunriseSunset(lat, lon).then(({ sunrise, sunset }) => {
        setSunrise(sunrise);
        setSunset(sunset);

        const intervalId = setInterval(() => {
          const now = new Date();
          setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setDate(formatDate(now));
          setGreeting(getGreeting(now.getHours()));
          setSunsetOrRise(now < new Date(sunrise) ? `sunrise at ${sunrise}` : now < new Date(sunset) ? `sunset at ${sunset}` : `sunrise at ${sunrise}`);
        }, 500);
        return () => clearInterval(intervalId);
      });
    });
  }, [ip]);

  useEffect(() => {
    const now = new Date();
    setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setGreeting(getGreeting(now.getHours()));
    setSunsetOrRise(now < new Date(sunrise) ? `sunrise at ${sunrise}` : now < new Date(sunset) ? `sunset at ${sunset}` : `sunrise at ${sunrise}`);
  }, [sunrise, sunset]);

  return (
    <main>
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

        <p style={{ fontSize: '45px', marginBottom: '0.2rem', fontWeight: 'lighter' }}>
          {greeting}!</p>

        <p style={{ fontSize: '25px', fontWeight: 'lighter', cursor: 'pointer' }}
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

        <p style={{ fontSize: '40px', marginBottom: '0.3rem', fontWeight: 'lighter' }}>The Temperature
          is {temperature}˚F</p>

        <p style={{ fontSize: '40px', marginBottom: '0.3rem', fontWeight: 'lighter' }}>while the Humidity is
          around {humidity} %</p>

        <p style={{ fontSize: '40px', marginBottom: '0.4rem', fontWeight: 'lighter' }}>and the {sunsetOrRise}</p>
      </div>
    </main>
  );
}