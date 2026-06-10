
import {Routes, Route} from 'react-router-dom';
import HomePage from './components/Homepage/HomePage';
import Verify from './components/verify/Verify';
import './App.css' ;

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Verify />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>

      
    </>
  )
}

export default App