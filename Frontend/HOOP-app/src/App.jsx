
import {Routes, Route} from 'react-router-dom';
import HomePage from './components/Homepage/HomePage';
import Verify from './components/verify/Verify';
import './App.css' ;
<<<<<<< HEAD
=======
import { Home } from 'lucide-react';
import VenueSelection from './components/EventCreation/VenueSelection';
>>>>>>> b88bf30171b998f2b1ed1a9147e8b11ae784186c

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Verify />} />
<<<<<<< HEAD
        <Route path="/home" element={<HomePage />} />
=======
        <Route path="/home" element={<Home />} />
        <Route path="/event-creation/venue" element={
          <VenueSelection 
            onNext={(venue) => { /* navigate to next step */ }}
            onBack={() => { /* go back */ }}
          />
        } />
>>>>>>> b88bf30171b998f2b1ed1a9147e8b11ae784186c
      </Routes>

      
    </>
  )
}

export default App