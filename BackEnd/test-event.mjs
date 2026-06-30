/**
 * Integration Smoke Test: Auth + Create Event
 * Tests: Register → Login → Create Event → Get Event → Delete Event → Cleanup
 *
 * Run from BackEnd/ with:
 *   node test-event.mjs
 *
 * Access token is ACCESS_OPTION=30s so the whole test finishes in under that window.
 */

import http from "http";

const BASE = "http://localhost:3000/api";

// ─── Tiny HTTP client (no external deps) ──────────────────────────────────────
let cookieJar = "";

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const url = new URL(BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(cookieJar ? { Cookie: cookieJar } : {}),
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      // Save cookies from Set-Cookie headers
      const setCookies = res.headers["set-cookie"];
      if (setCookies) {
        cookieJar = setCookies
          .map((c) => c.split(";")[0])
          .join("; ");
      }

      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data || "{}") });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pass = (msg) => console.log(`  ✅ ${msg}`);
const fail = (msg, detail) => {
  console.error(`  ❌ FAIL: ${msg}`);
  if (detail) console.error("     →", JSON.stringify(detail, null, 2));
  process.exit(1);
};
const section = (title) => console.log(`\n── ${title} ─────────────────────────`);

// ─── Test data ────────────────────────────────────────────────────────────────
const TEST_USER = {
  username: "TestBot",
  email: `testbot_${Date.now()}@hoop.test`,
  password: "Test@1234!",
};

// Tomorrow at 10:00–12:00 — avoids the "cannot be in the past" validation
const tomorrow = new Date(Date.now() + 86_400_000);
const eventDate = tomorrow.toISOString().split("T")[0]; // "YYYY-MM-DD"

const TEST_EVENT = {
  eventTitle: "API Smoke Test Gathering",
  eventTypeId: 1,           // must exist in event_types table
  eventDate,
  eventTime: "10:00",
  eventEndTime: "12:00",
  eventSize: "small",
  locationLat: 13.7563,    // Bangkok
  locationLng: 100.5018,
  locationAddress: "Bangkok, Thailand",
  locationLabel: "Test Location",
  budget: 5000,
  expectedGuests: 10,
  description: "Automated integration smoke test — safe to delete.",
};

// ─── Test Runner ──────────────────────────────────────────────────────────────
let createdEventId = null;

async function run() {
  console.log("🚀 Hoop API Integration Smoke Test");
  console.log(`   Server : ${BASE}`);
  console.log(`   User   : ${TEST_USER.email}`);

  // ── 1. Register ─────────────────────────────────────────────────────────────
  section("1. Register");
  const reg = await request("POST", "/auth/register", TEST_USER);
  if (reg.status !== 201) fail(`Register returned ${reg.status}`, reg.body);
  pass(`Registered user — userId: ${reg.body.userId}`);

  // ── 2. Login ─────────────────────────────────────────────────────────────────
  section("2. Login");
  const login = await request("POST", "/auth/login", {
    email: TEST_USER.email,
    password: TEST_USER.password,
  });
  if (login.status !== 200) fail(`Login returned ${login.status}`, login.body);
  pass(`Logged in as: ${login.body.user?.username} (roles: ${login.body.user?.roles?.join(", ")})`);
  pass(`Cookie jar set (${cookieJar.length} chars)`);

  // ── 3. Get Profile ────────────────────────────────────────────────────────────
  section("3. GET /auth/profile");
  const profile = await request("GET", "/auth/profile");
  if (profile.status !== 200) fail(`Profile returned ${profile.status}`, profile.body);
  pass(`Profile verified — userId: ${profile.body.user?.userId}`);

  // ── 4. Create Event ───────────────────────────────────────────────────────────
  section("4. POST /events — Create Event");
  const create = await request("POST", "/events", TEST_EVENT);
  if (create.status !== 201) fail(`Create event returned ${create.status}`, create.body);
  createdEventId = create.body.eventId;
  pass(`Event created — eventId: ${createdEventId}, title: "${create.body.eventTitle}"`);

  // ── 5. Get All Events ─────────────────────────────────────────────────────────
  section("5. GET /events — List Events");
  const list = await request("GET", "/events");
  if (list.status !== 200) fail(`Get events returned ${list.status}`, list.body);
  const found = list.body.find((e) => e.eventId === createdEventId);
  if (!found) fail("Created event not found in user's event list", list.body);
  pass(`Event appears in list (${list.body.length} total event(s))`);

  // ── 6. Get Event By ID ────────────────────────────────────────────────────────
  section("6. GET /events/:id — Fetch Single Event");
  const get = await request("GET", `/events/${createdEventId}`);
  if (get.status !== 200) fail(`Get event returned ${get.status}`, get.body);
  if (get.body.eventId !== createdEventId) fail("Event ID mismatch", get.body);
  pass(`Event details fetched — budget: ${get.body.budget}, size: ${get.body.eventSize}`);

  // ── 7. Update Event ───────────────────────────────────────────────────────────
  section("7. PUT /events/:id — Update Event");
  const update = await request("PUT", `/events/${createdEventId}`, {
    eventTitle: "API Smoke Test Gathering (UPDATED)",
    budget: 9999,
  });
  if (update.status !== 200) fail(`Update event returned ${update.status}`, update.body);
  if (update.body.eventTitle !== "API Smoke Test Gathering (UPDATED)") fail("Title not updated", update.body);
  pass(`Event updated — new title: "${update.body.eventTitle}", budget: ${update.body.budget}`);

  // ── 8. Delete Event ───────────────────────────────────────────────────────────
  section("8. DELETE /events/:id — Cleanup");
  const del = await request("DELETE", `/events/${createdEventId}`);
  if (del.status !== 204) fail(`Delete event returned ${del.status}`, del.body);
  pass(`Event ${createdEventId} deleted (204 No Content)`);

  // ── 9. Verify Deleted ─────────────────────────────────────────────────────────
  section("9. GET /events/:id — Confirm Deletion");
  const gone = await request("GET", `/events/${createdEventId}`);
  if (gone.status !== 404) fail(`Expected 404 after delete, got ${gone.status}`, gone.body);
  pass(`Event correctly returns 404 after deletion`);

  // ── Done ──────────────────────────────────────────────────────────────────────
  console.log("\n══════════════════════════════════════════════");
  console.log("✅ ALL TESTS PASSED — Database + API are working correctly");
  console.log("══════════════════════════════════════════════\n");
}

run().catch((err) => {
  console.error("\n💥 Unexpected error:", err.message);
  process.exit(1);
});
