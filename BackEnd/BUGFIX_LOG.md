# 🐛 Backend Bug Fix Log

A chronological record of all bugs encountered during backend setup and how they were resolved.

---

## Bug #1 — `Cannot find module '.prisma/client/default'`

**File:** `node_modules/@prisma/client/default.js`

### Error
```
Error: Cannot find module '.prisma/client/default'
Require stack:
- .../node_modules/@prisma/client/default.js
```

### Cause
Prisma generates a **custom client** tailored to your `schema.prisma` models. This generated
code lives in `node_modules/.prisma/client/` and is **not** created automatically on `npm install`.
If it doesn't exist (e.g. fresh clone, cleared `node_modules`), Node.js cannot find it and crashes.

### Fix
Run the Prisma generator manually, pointing it to your schema file:
```bash
npx prisma generate --schema=src/prisma/schema.prisma
```

> **Rule:** Run `prisma generate` any time you change `schema.prisma` or after a fresh `npm install`.

---

## Bug #2 — `PrismaClientInitializationError: needs to be constructed with valid PrismaClientOptions`

**File:** `src/config/prisma.config.js`

### Error
```
PrismaClientInitializationError: `PrismaClient` needs to be constructed with a non-empty, valid `PrismaClientOptions`
```

### Cause (Part 1 — Wrong Import Style)
The file used a CommonJS-style default import and destructuring pattern:
```js
// ❌ Wrong — breaks with "type": "module" in package.json
import pkg from "@prisma/client"
const { PrismaClient } = pkg
```
Because `package.json` has `"type": "module"`, this loaded the wrong export and the
`PrismaClient` constructor received an empty/invalid object.

### Fix (Part 1)
Use the correct ES Module named import:
```js
// ✅ Correct
import { PrismaClient } from "@prisma/client";
```

---

### Cause (Part 2 — Removed `datasources` Option in Prisma v7)
After fixing the import, the following constructor call still failed:
```js
// ❌ Wrong — datasources was removed in Prisma v7
const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
});
```
The `datasources` property was a valid constructor option in **Prisma v6 and earlier**.
In **Prisma v7**, it was completely removed. The new client engine requires either a
**Driver Adapter** or **Accelerate URL** instead.

### Fix (Part 2) — Use a Driver Adapter
Install the official PostgreSQL adapter:
```bash
npm install @prisma/adapter-pg pg
```

Update `src/config/prisma.config.js`:
```js
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

// Prisma v7 requires a Driver Adapter — it no longer accepts a url in schema.prisma
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
```

> **Rule:** In Prisma v7, never call `new PrismaClient()` without an adapter.
> Always import the shared singleton from `src/config/prisma.config.js`.

---

## Bug #3 — `PrismaClientInitializationError` in `auth.controller.js`

**File:** `src/controllers/auth.controller.js`

### Error
```
PrismaClientInitializationError: `PrismaClient` needs to be constructed with...
    at auth.controller.js:5:16
```

### Cause
The controller was instantiating its own bare `PrismaClient` without a driver adapter:
```js
// ❌ Wrong — creates a new client without the required adapter
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
```

### Fix
Import the pre-configured shared singleton from `prisma.config.js` instead:
```js
// ✅ Correct — reuses the adapter-configured singleton
import prisma from "../config/prisma.config.js";
```

> **Rule:** All controllers and services must import `prisma` from the shared config,
> never instantiate it themselves.

---

## Bug #4 — `TypeError: argument handler is required`

**File:** `src/routes/events.routes.js` (and other route files)

### Error
```
TypeError: argument handler is required
    at Route.<computed> [as get] (.../router/lib/route.js:221:13)
    at events.routes.js:10:8
```

### Cause
Express requires every route definition to include a handler (callback) function.
Routes were scaffolded without handlers:
```js
// ❌ Wrong — no handler provided
router.get("/");
router.post("/");
```

### Fix
Add at least a stub handler to every route. Use HTTP `501 Not Implemented` as a
placeholder until the real controller logic is written:
```js
// ✅ Correct — stub handler signals the route exists but is not yet implemented
router.get("/", (req, res) => { res.sendStatus(501); });
router.post("/", (req, res) => { res.sendStatus(501); });
```

---

## Summary Table

| # | Error | Root Cause | Fix |
|---|-------|-----------|-----|
| 1 | `Cannot find module '.prisma/client/default'` | Prisma client was never generated | Run `npx prisma generate` |
| 2a | `PrismaClientInitializationError` | Wrong import style (`import pkg from ...`) with ES Modules | Use `import { PrismaClient } from "@prisma/client"` |
| 2b | `PrismaClientInitializationError` | `datasources` option removed in Prisma v7 | Use `@prisma/adapter-pg` Driver Adapter |
| 3 | `PrismaClientInitializationError` in controller | Controller instantiated its own bare `PrismaClient` | Import shared singleton from `prisma.config.js` |
| 4 | `TypeError: argument handler is required` | Express routes missing callback functions | Add `(req, res) => { res.sendStatus(501); }` stubs |

---

## Key Takeaways for Prisma v7

1. **Always run `prisma generate`** after schema changes or fresh installs.
2. **`url` in `schema.prisma` is gone.** Connection URLs live in `prisma.config.ts` (for CLI) and the Driver Adapter (for runtime).
3. **The Driver Adapter is mandatory.** `new PrismaClient()` alone will crash — it needs `{ adapter }`.
4. **One singleton, one adapter.** Create the `PrismaClient` once in `prisma.config.js` and import it everywhere else.
5. **Express routes need handlers.** Every `router.get()`, `router.post()`, etc. must have a callback.
