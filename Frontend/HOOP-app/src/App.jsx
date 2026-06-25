import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Verify         from './components/verify/Verify';
import HomePage       from './components/Homepage/HomePage';
import Dashboard      from './components/Dashboard/Dashboard';
import SetUpEvent     from './components/EventCreation/SetUpEvent';
import VenueSelection from './components/EventCreation/VenueSelectionNew';
import TimeAndTask    from './components/EventCreation/TimeAndTask';
import EventOverview  from './components/EventOverview/EventOverview';
import PageTransition from './components/PageTransition';
import About          from './components/Homepage/About';
import Contact        from './components/Homepage/Contact';
import { EventProvider } from './components/EventCreation/EventContext';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <EventProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        {/* Auth */}
        <Route path="/" element={<PageTransition><Verify /></PageTransition>} />

        {/* Landing / Marketing Home */}
        <Route path="/home" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

        {/* Dashboard / Event Inventory */}
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/inventory" element={<PageTransition><Dashboard /></PageTransition>} />

        {/* Event Creation Flow */}
        <Route path="/event-creation/setup"     element={<PageTransition><SetUpEvent /></PageTransition>} />
        <Route path="/event-creation/venue"     element={<PageTransition><VenueSelection /></PageTransition>} />
        <Route path="/event-creation/time-task" element={<PageTransition><TimeAndTask /></PageTransition>} />

        {/* Event Overview */}
        <Route path="/event/:id" element={<PageTransition><EventOverview /></PageTransition>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </EventProvider>
  );
}

export default App;