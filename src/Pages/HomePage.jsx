import { useState, useEffect, useMemo } from 'react'
import '../App.jsx'

import {Link} from 'react-router-dom'
import StockCharts from '../Components/Charts.jsx'

function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [symbols, setSymbols] = useState(() => localStorage.getItem('stockSymbol') || 'AAPL');
  const [date, setDate] = useState(new Date());
  const [high, setHigh] = useState(-1);
  const [low, setLow] = useState(-1);
  const [AMPM, setAMPM] = useState(null);
  const [userInput, setUserInput] = useState(() => localStorage.getItem('stockSymbol') || 'AAPL');
  const [dayCount, setDayCount] = useState(() => Number(localStorage.getItem('stockDayCount')) || 20);
  const [limit, setLimit] = useState(() => Number(localStorage.getItem('stockDayCount')) || 20);

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
        console.log(result);

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

    localStorage.setItem('stockSymbol', userInput);
    localStorage.setItem('stockDayCount', dayCount.toString());
  }

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  }

const formattedChartData = useMemo(() => {
    if(!data || !data.data) return [];

    return data.data.map(item => ({
        ...item,
        date: item.date.slice(0,10)
    }))

}, [data]);
  
  return (
    <>
      <div className = "container">
        <h2>Current Time: <br></br>{date.getHours() % 12 == 0? "12" : date.getHours() % 12} : {date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()} {AMPM} </h2>
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
  
        <div className = "outer-container">
            <div className = "analysis">
                <div className = "header">
                    <h3>Date</h3>
                    <h3>Open Price</h3>
                    <h3>Close Price</h3>
                    <h3>Description</h3>
                </div>

            {data && data.data && data.data.map((item) =>
            (
                <div className = "stock_data">
                <p>{item.date.slice(0, 10)}</p>
                <p>${item.open}</p>
                <p>${item.close}</p>
                <Link to = {`${item.date.slice(0,10)}`} state = {{ stockItem: item}}>
                <h3>🔗</h3>
                </Link>
                </div>
            )
            )}
            </div>
            <div className = "graphs">
                {formattedChartData.length > 0 && (
                    <StockCharts chartData = {formattedChartData}/>
                )}
            </div>
        </div>
      </div>
    </>
  )
}

export default HomePage;
