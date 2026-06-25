import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext();

const defaultActivities = [
  { id: 1, name: "Guest Arrival",  time: "18:00", duration: 30, category: "Logistics",      desc: "Welcome guests at the entrance." },
  { id: 2, name: "Dinner Service", time: "18:30", duration: 90, category: "Catering",       desc: "Catered 3-course meal." },
  { id: 3, name: "Cake Cutting",   time: "20:00", duration: 30, category: "Ceremony",       desc: "Birthday cake and desserts." },
  { id: 4, name: "DJ & Dancing",   time: "20:30", duration: 150,category: "Entertainment", desc: "Live DJ set to close the night." },
];

const LOCAL_STORAGE_KEY = "hoop_event_data";

export function EventProvider({ children }) {
  // Try to load from localStorage first
  const loadState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load event data", e);
    }
    return null;
  };

  const savedState = loadState();

  const [form, setForm] = useState(savedState?.form || {
    title: "", 
    type: "", 
    startTime: "", 
    endTime: "", 
    attendance: "", 
    budget: ""
  });
  
  const [guests, setGuests] = useState(savedState?.guests || []);
  const [selectedVenue, setSelectedVenue] = useState(savedState?.selectedVenue || null);
  const [eventDate, setEventDate] = useState(savedState?.eventDate || "");
  const [activities, setActivities] = useState(savedState?.activities || defaultActivities);

  // Save to localStorage whenever state changes
  React.useEffect(() => {
    const stateToSave = { form, guests, selectedVenue, eventDate, activities };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [form, guests, selectedVenue, eventDate, activities]);

  const resetEventData = () => {
    setForm({ title: "", type: "", startTime: "", endTime: "", attendance: "", budget: "" });
    setGuests([]);
    setSelectedVenue(null);
    setEventDate("");
    setActivities(defaultActivities);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const value = {
    form, setForm,
    guests, setGuests,
    selectedVenue, setSelectedVenue,
    eventDate, setEventDate,
    activities, setActivities,
    resetEventData
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
}
