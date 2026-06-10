
import {Routes, Route} from 'react-router-dom';
import Verify from './components/Verify/Verify';
import './App.css' ;
import { Home } from 'lucide-react';
import VenueSelection from './components/EventCreation/VenueSelection';

function App() {

  return (
    <>
    
      <Routes>
        <Route path="/" element={<Verify />} />
        <Route path="/home" element={<Home />} />
        <Route path="/event-creation/venue" element={
          <VenueSelection 
            onNext={(venue) => { /* navigate to next step */ }}
            onBack={() => { /* go back */ }}
          />
        } />
      </Routes>

      
    </>
  )
}

export default App
