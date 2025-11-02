
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import Navbar from './Components/Navbar.jsx'
import StockPage from './Components/Description_card/description.jsx'
import HomePage from './Pages/HomePage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path = "/" element = {<HomePage/>} />
        <Route path = "/:symbol" element = {<StockPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;