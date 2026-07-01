import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';

import Verify         from './components/verify/Verify';
import HomePage       from './components/Homepage/HomePage';
import Dashboard      from './components/Dashboard/Dashboard';
import EventSizeSelection from './components/EventCreation/EventSizeSelection';
import SetUpEvent     from './components/EventCreation/SetUpEvent';
import VenueSelection from './components/EventCreation/VenueSelectionNew';
import TimeAndTask    from './components/EventCreation/TimeAndTask';
import EventOverview  from './components/EventOverview/EventOverview';
import PageTransition from './components/PageTransition';
import About          from './components/Homepage/About';
import Contact        from './components/Homepage/Contact';
import Profile        from './components/Profile/Profile';
import GlobalLoader   from './components/ui/GlobalLoader';
import { LoaderProvider } from './context/LoaderContext';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './components/EventCreation/EventContext';
import ProtectedRoute from './components/ProtectedRoute';

// Role Panels
import AdminPanel from './components/Admin/AdminPanel';
import VenueOwnerPanel from './components/VenueOwner/VenueOwnerPanel';

import './App.css';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <LoaderProvider>
        <EventProvider>
          <GlobalLoader />
          <MotionConfig reducedMotion="user">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* Landing / Marketing Home */}
                <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />

                {/* Auth */}
                <Route path="/login" element={<PageTransition><Verify /></PageTransition>} />
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

                {/* Dashboard / Event Inventory (Organizer) */}
                <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />

                {/* Profile */}
                <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />

                {/* Event Creation Flow */}
                <Route path="/event-creation/start"     element={<ProtectedRoute><PageTransition><EventSizeSelection /></PageTransition></ProtectedRoute>} />
                <Route path="/event-creation/setup"     element={<ProtectedRoute><PageTransition><SetUpEvent /></PageTransition></ProtectedRoute>} />
                <Route path="/event-creation/venue"     element={<ProtectedRoute><PageTransition><VenueSelection /></PageTransition></ProtectedRoute>} />
                <Route path="/event-creation/time-task" element={<ProtectedRoute><PageTransition><TimeAndTask /></PageTransition></ProtectedRoute>} />

                {/* Event Overview */}
                <Route path="/event/:id" element={<ProtectedRoute><PageTransition><EventOverview /></PageTransition></ProtectedRoute>} />

                {/* Role Panels */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><PageTransition><AdminPanel /></PageTransition></ProtectedRoute>} />
                <Route path="/venue-owner" element={<ProtectedRoute allowedRoles={["venue_owner", "admin"]}><PageTransition><VenueOwnerPanel /></PageTransition></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </MotionConfig>
        </EventProvider>
      </LoaderProvider>
    </AuthProvider>
  );
}

export default App;