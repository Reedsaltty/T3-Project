
import {Routes, Route} from 'react-router-dom';
import Verify from './components/Verify';
import './App.css' ;
import { Home } from 'lucide-react';

function App() {


  return (
    <>
    
      <Routes>
        <Route path="/" element={<Verify />} />
        <Route path="/" element={<Home />}>
      </Routes>

      
    </>
  )
}

export default App
