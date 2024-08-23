import { useEffect, useState } from 'react';

export default function Home() {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [welcomeText, setWelcomeText] = useState("Welcome to your dashboard!");

  async function getData(): Promise<void> {
    try {
      const response = await fetch('http://192.168.1.28');
      const data = await response.json();
      setTemperature(data.temperature);
      setHumidity(data.humidity);
    } catch (error: any) {
      setWelcomeText("Error fetching data: " + error.message);
      console.error(error);
    }
  }

  useEffect((): () => void => {
    getData().then();
    const intervalId = setInterval(getData, 1000);
    return (): void => clearInterval(intervalId);
  }, []);

  return (
    <>
      <main>
        <div className="wrapper">
          <h1 className="no-select">Dashboard</h1>
          <h2 className="no-select">{welcomeText}</h2>
          <p>Temperature {temperature}˚F</p>
          <p>Humidity {humidity} %</p>
        </div>
      </main>
    </>
  );
}
