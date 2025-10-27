import { useState, useEffect } from 'react'

import './App.css'

import Navbar from './Components/Navbar.jsx'

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [symbols, setSymbols] = useState(['AAPL']);
  const [date, setDate] = useState(new Date());
  const [high, setHigh] = useState(-1);
  const [low, setLow] = useState(-1);
  const [AMPM, setAMPM] = useState(null);
  const [userInput, setUserInput] = useState('AAPL');
  const [dayCount, setDayCount] = useState(20);
  const [limit, setLimit] = useState(20);

  const url = 'http://api.marketstack.com/v2/eod';
  const api_key = import.meta.env.VITE_APP_API_KEY;


  // 'MSFT', 'META', 'PLTR', 'GOOGL', 'NVDA', 'TSM', 'MSFT', 'AMZN', 'NFLX'

  useEffect(() => {
    const fetchData = async () => {

      setDate(new Date());
      setAMPM(date.getHours() >= 12 ? "PM" : "AM");

      setError(null);

      try {
        const fullURL = `${url}?access_key=${api_key}&symbols=${symbols}&limit=${limit}`;

        const response = await fetch(fullURL);

        if(!response.ok) {
          throw new Error('HTTP Error, Status: ${response.status');
        }

        const result = await response.json();

        setData(result);

      } catch (e) {
        setError(e.message);
      } 
    }
    fetchData();

  }, [url, api_key, symbols, limit]);


  useEffect(() => {
    if (data) {

      let constHigh = data.data[0].open;
      let constLow = data.data[0].open;


      for(let i = 0; i < data.data.length; i++) {
        if (data.data[i].open > constHigh) {
          constHigh = data.data[i].open;
        }
        if (data.data[i].close > constHigh) {
          constHigh = data.data[i].close;
        }
        if (data.data[i].open < constLow) {
          constLow = data.data[i].open;
        }
        if (data.data[i].close < constLow) {
          constLow = data.data[i].close;
        }
      }

      setHigh(constHigh);
      setLow(constLow);
    }

  }, [data]);

  const changeSymbol = () => {
    setSymbols(userInput);
    setLimit(dayCount);
  }

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  }
  
  return (
    <>
      <Navbar/>
      <div className = "container">
        <h2>Current Time: <br></br>{date.getHours() % 12} : {date.getMinutes()} {AMPM} </h2>
        <h2>20 Day High: <br/> ${high} </h2>
        <h2>20 Day Low: <br/> ${low}</h2>
      </div>
      <div className = "stats">
        <div className = "search">
          {data && (
            <h2>Stock: {data.data[0].name}</h2>
          )}
          <div className = "search_bar">
            <input
              type = "text"
              required
              value = {userInput}
              onChange =  {handleUserInput}
              placeHolder = "AAPL, META"
            />
            <h3>Number of Days (1-20) </h3>
            <input 
              type = "range"
              min = "1"
              max = "20"
              value = {dayCount}
              onChange = {(e) => setDayCount(Number(e.target.value))}
            />
            <button onClick = {changeSymbol}>Search</button>
          </div>
        </div>
        <div className = "header">
          <h3>Date</h3>
          <h3>Open Price</h3>
          <h3>Close Price</h3>
          <h3>Gain/Loss</h3>
        </div>
        <div className = "analysis">
          {data && data.data && data.data.map((item) =>
          ( 
            <div className = "stock_data">
              <p>{item.date.slice(0, 10)}</p>
              <p>${item.open}</p>
              <p>${item.close}</p>
              <h1>${item.close - item.open > 0 ? "📈" : "📉"}</h1>
            </div>
          )
          )}
        </div>
      </div>
    </>
  )
}

export default App
