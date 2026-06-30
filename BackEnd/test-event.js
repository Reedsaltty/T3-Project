import axios from 'axios';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log("1. Authenticating as admin...");
  try {
    const login = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@hoop.local',
      password: 'admin1234'
    });
    const token = login.data.accessToken;
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
    
    console.log("2. Creating a small event...");
    const eventPayload = {
      eventTitle: "API Test Small Event",
      eventTypeId: 1, // Birthday
      eventDate: "2026-07-20",
      eventTime: "18:00",
      eventEndTime: "22:00",
      eventSize: "small",
      locationLat: 11.5564,
      locationLng: 104.9282,
      locationAddress: "Phnom Penh, Cambodia",
      locationLabel: "Riverside Park",
      expectedGuests: 10,
      description: "Testing end-to-end flow."
    };
    
    const eventRes = await axios.post('http://localhost:5000/api/events', eventPayload, authHeaders);
    const eventId = eventRes.data.eventId;
    console.log("✅ Event created successfully. ID:", eventId);
    
    console.log("3. Adding an activity...");
    await axios.post(`http://localhost:5000/api/events/${eventId}/activities`, {
      title: "Cake Cutting",
      startTime: "2026-07-20T20:00:00.000Z",
      endTime: "2026-07-20T20:30:00.000Z"
    }, authHeaders);
    console.log("✅ Activity added.");
    
    console.log("4. Fetching the created event from DB...");
    const dbEvent = await prisma.event.findUnique({
      where: { eventId },
      include: { activities: true, attendees: true }
    });
    
    console.log("✅ DB Check Pass! Event Title:", dbEvent.eventTitle);
    console.log("✅ Activities count:", dbEvent.activities.length);
    console.log("All systems go! Database and APIs are fully operational.");
  } catch (err) {
    console.error("Test failed:", err.response ? err.response.data : err.message);
  }
}
run();
