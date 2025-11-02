import { useLocation, useNavigate } from 'react-router-dom'
import '../../App.css'

function StockDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { stockItem } = location.state || {};
  const date = new Date();

  const goBack = () => {
    navigate(-1);
  }

  return (
    <>
     <div className = "container">
        <h2>Current Time: <br></br>{date.getHours() % 12 == 0? "12" : date.getHours() % 12} : {date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()} {date.getHours() >= 12 ? "PM" : "AM"} </h2>
        <h2>Day High: <br/> ${stockItem.high} </h2>
        <h2>Day Low: <br/> ${stockItem.low}</h2>
      </div>

      <div className = "stockDescription">
        <h1>{stockItem.symbol} on {stockItem.date.slice(0,10)}</h1>
        <h2>Asset Type: {stockItem.asset_type}</h2>
        <h2>Volume of shares traded: {stockItem.volume}</h2>
        <h2>Dividend yield: {stockItem.dividend == 0 ? "This stock does not offer dividends." : stockItem.dividend}</h2>
        <button onClick = {goBack}>Go Back</button>
      </div>
    </>
  );
}

export default StockDetailPage;