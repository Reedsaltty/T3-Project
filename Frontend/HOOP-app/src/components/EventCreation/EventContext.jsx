import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext();

const LOCAL_STORAGE_KEY = "hoop_event_data";

export function EventProvider({ children }) {
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

  // Core event fields — maps 1:1 to the createEvent API payload
  const [form, setForm] = useState(savedState?.form || {
    title: "",
    eventTypeId: "",   // int — maps to event_types table
    startTime: "",
    endTime: "",
    attendance: "",
    budget: "",
    description: "",
    dressCode: "",
    specialNotes: "",
    eventSize: "small", // "small" | "big"
  });

  const [eventDate, setEventDate] = useState(savedState?.eventDate || "");

  // Location — only used for small events (map pin)
  const [location, setLocation] = useState(savedState?.location || {
    lat: null,
    lng: null,
    address: "",
    label: "",
  });

  // Venue — only for big events (venue booking, set in VenueSelection step)
  const [selectedVenueId, setSelectedVenueId] = useState(savedState?.selectedVenueId || null);

  // Guest list collected in SetUpEvent (submitted after event is created)
  const [guests, setGuests] = useState(savedState?.guests || []);

  // Agenda items (renamed from activities to match DB schema)
  const [agenda, setAgenda] = useState(savedState?.agenda || []);

  React.useEffect(() => {
    const stateToSave = { form, guests, eventDate, location, selectedVenueId, agenda };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [form, guests, eventDate, location, selectedVenueId, agenda]);

  const resetEventData = () => {
    setForm({
      title: "", eventTypeId: "", startTime: "", endTime: "",
      attendance: "", budget: "", description: "", dressCode: "",
      specialNotes: "", eventSize: "small",
    });
    setGuests([]);
    setSelectedVenueId(null);
    setEventDate("");
    setLocation({ lat: null, lng: null, address: "", label: "" });
    setAgenda([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const value = {
    form, setForm,
    guests, setGuests,
    eventDate, setEventDate,
    location, setLocation,
    selectedVenueId, setSelectedVenueId,
    agenda, setAgenda,
    resetEventData,
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
