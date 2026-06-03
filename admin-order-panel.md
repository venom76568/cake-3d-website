# Admin Panel & Order System — Implementation Plan

**Feature Request:** Add an admin panel for the bakery owner to manage cakes, receive orders from the landing page CTA, view daily order history & revenue, with daily revenue reset and full date-browsable history.

**Plan File:** `admin-order-panel.md`  
**Project Type:** WEB (React SPA — extending existing cakeshop)  
**Storage:** Browser `localStorage` + `IndexedDB` (via `idb` library) — no backend required

---

## ✅ Success Criteria

- [ ] Admin can log in at `/admin` with a password-protected route
- [ ] Admin can upload a cake image + name + description + price — saved to localStorage and shown on the menu
- [ ] Customers can click a CTA button on the landing page and submit an order via a modal (Name, Phone, Cake, Quantity, Notes)
- [ ] Orders are saved with a timestamp (date + time) to IndexedDB
- [ ] Admin dashboard shows: today's orders, total revenue for the day
- [ ] Revenue display resets to ₹0 at midnight each day (orders are preserved)
- [ ] Admin can browse and filter order history by any past date
- [ ] Admin can view revenue total for any selected date
- [ ] `menuData.js` static file remains intact as seed data; admin additions are layered on top from localStorage

---

## 🧠 Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Storage | localStorage (cakes, auth) + IndexedDB (orders) | localStorage for small config data, IndexedDB for potentially large order history |
| Auth | Hardcoded password hash in env var → checked client-side | Simple, no server, no user DB |
| Menu | Static `menuData.js` + dynamic localStorage additions | Keeps existing data intact, adds dynamic layer |
| Revenue Reset | Computed at read-time by filtering orders to today's date | No cron job needed — daily "reset" is just a query filter |
| Order CTA | Floating button or section CTA → Modal form → localStorage → IndexedDB | No page reload, seamless UX |
| Routing | React Router v6 with a `<ProtectedRoute>` wrapper | Standard pattern for guarded routes |

---

## 🏗️ Tech Stack Additions

| Package | Purpose |
|---|---|
| `react-router-dom` v6 | `/admin` route + protected routes |
| `idb` | Promise-based IndexedDB wrapper for order storage |
| `react-hook-form` | Order form and admin cake upload form validation |
| `date-fns` | Date formatting, grouping orders by day |

---

## 📁 New File Structure

```
src/
├── admin/
│   ├── AdminApp.jsx                  # Admin shell with sidebar nav
│   ├── AdminLogin.jsx                # Password entry screen
│   ├── AdminDashboard.jsx            # Today's orders + revenue
│   ├── AdminCakeManager.jsx          # Upload/edit/delete cakes
│   ├── AdminOrderHistory.jsx         # Date-picker → filtered orders table
│   └── ProtectedRoute.jsx            # Auth guard wrapper
├── components/
│   ├── OrderModal.jsx                # Customer order form modal (NEW)
│   └── OrderCTA.jsx                  # CTA button on landing page (NEW)
├── data/
│   ├── menuData.js                   # UNCHANGED — static seed data
│   └── dynamicMenuData.js            # NEW — read/write helpers for localStorage cakes
├── hooks/
│   ├── useAdminAuth.js               # Login state + password check hook
│   ├── useOrders.js                  # IndexedDB CRUD for orders via idb
│   └── useDynamicMenu.js             # localStorage read/write for admin-added cakes
├── db/
│   └── orderDb.js                    # idb schema + open/upgrade logic
└── App.jsx                           # MODIFIED — add Router + /admin route
```

---

## 📋 Task Breakdown

### PHASE P0: Foundation (Dependencies + DB Schema)

---

#### Task 1.1 — Install dependencies
- **Agent:** `backend-specialist`
- **Skill:** `nodejs-best-practices`
- **Priority:** P0 (BLOCKER for everything)
- **INPUT:** Empty node_modules for new packages
- **OUTPUT:** `react-router-dom`, `idb`, `react-hook-form`, `date-fns` installed
- **VERIFY:** `npm ls react-router-dom idb react-hook-form date-fns` shows all 4
- **Command:**
```powershell
npm install react-router-dom idb react-hook-form date-fns
```

---

#### Task 1.2 — IndexedDB schema (`src/db/orderDb.js`)
- **Agent:** `backend-specialist`
- **Skill:** `database-design`
- **Priority:** P0 (BLOCKER for order hooks)
- **Dependencies:** Task 1.1
- **INPUT:** None
- **OUTPUT:** `orderDb.js` that opens an IndexedDB store named `cakeshop-orders` with schema:
  ```
  orders store: { id (autoIncrement), cakeName, quantity, customerName, phone, notes, priceAtOrder, timestamp (ISO string), date (YYYY-MM-DD) }
  ```
- **VERIFY:** Importing `openOrderDb()` returns a DB object without error

---

### PHASE P1: Data & Hook Layer

---

#### Task 2.1 — `useOrders` hook (`src/hooks/useOrders.js`)
- **Agent:** `backend-specialist`
- **Skill:** `nodejs-best-practices`
- **Priority:** P1
- **Dependencies:** Task 1.2
- **INPUT:** `orderDb.js` schema
- **OUTPUT:** Hook exposing:
  - `addOrder(orderObj)` → writes to IndexedDB
  - `getOrdersByDate(dateStr)` → returns array for `YYYY-MM-DD`
  - `getAllDates()` → returns unique sorted date strings that have orders
  - `getRevenueByDate(dateStr)` → sums `priceAtOrder * quantity` for that date
- **VERIFY:** Add a test order and retrieve it by today's date

---

#### Task 2.2 — `useDynamicMenu` hook (`src/hooks/useDynamicMenu.js`)
- **Agent:** `frontend-specialist`
- **Skill:** `clean-code`
- **Priority:** P1
- **Dependencies:** Task 1.1
- **INPUT:** `menuData.js` static array
- **OUTPUT:** Hook exposing:
  - `allCakes` → merged array of static seed data + localStorage admin additions
  - `addCake(cakeObj)` → appends to localStorage
  - `deleteCake(id)` → removes from localStorage (cannot delete seed data)
  - `updateCake(id, updates)` → updates localStorage entry
- **VERIFY:** Add a cake via hook, reload page — cake persists in `allCakes`

---

#### Task 2.3 — `useAdminAuth` hook (`src/hooks/useAdminAuth.js`)
- **Agent:** `security-auditor`
- **Skill:** `vulnerability-scanner`
- **Priority:** P1
- **Dependencies:** Task 1.1
- **INPUT:** Password stored in `import.meta.env.VITE_ADMIN_PASSWORD` (`.env.local`)
- **OUTPUT:** Hook exposing:
  - `isAuthenticated` (bool, persisted in `sessionStorage`)
  - `login(password)` → compares against env var, sets session flag
  - `logout()` → clears session flag
- **SECURITY NOTE:** This is client-side auth for a single-owner personal bakery site. Password is never stored in code — only in `.env.local` which is gitignored.
- **VERIFY:** Login with correct password → `isAuthenticated = true`. Refresh → still authenticated. Close tab → re-login required.

---

### PHASE P2: Admin Panel UI

---

#### Task 3.1 — `ProtectedRoute.jsx` (`src/admin/ProtectedRoute.jsx`)
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P2
- **Dependencies:** Task 2.3
- **INPUT:** `useAdminAuth` hook
- **OUTPUT:** Component that redirects to `/admin/login` if not authenticated, else renders children
- **VERIFY:** Navigating to `/admin` while logged out → redirected to `/admin/login`

---

#### Task 3.2 — `AdminLogin.jsx` (`src/admin/AdminLogin.jsx`)
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P2
- **Dependencies:** Task 2.3, Task 3.1
- **INPUT:** `useAdminAuth.login()`
- **OUTPUT:** Minimalist centered login form — logo, password field, submit button. On success → redirect to `/admin/dashboard`.
- **DESIGN RULES:** Dark plum background, gold accent, no purple. `font-display` for heading.
- **VERIFY:** Enter wrong password → inline error shown. Enter correct password → redirected.

---

#### Task 3.3 — `AdminDashboard.jsx` — Today's Orders & Revenue
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P2
- **Dependencies:** Task 2.1, Task 3.2
- **INPUT:** `useOrders.getOrdersByDate(today)`, `useOrders.getRevenueByDate(today)`
- **OUTPUT:**
  - Header: Today's date
  - Hero stat: Total revenue for today (₹X)
  - Order count card
  - Table/list of today's orders (customer name, cake, qty, price, time)
  - "Revenue resets at midnight" note
- **VERIFY:** Submit a test order → dashboard updates with new entry and correct revenue

---

#### Task 3.4 — `AdminCakeManager.jsx` — Upload & Manage Cakes
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P2
- **Dependencies:** Task 2.2
- **INPUT:** `useDynamicMenu` hook
- **OUTPUT:**
  - Upload form: Name, Description, Price, Image (file input → converted to base64 or object URL for localStorage)
  - List of all cakes (static shown as "Seed — cannot delete", dynamic shown with Edit/Delete)
- **IMAGE NOTE:** Images stored as base64 strings in localStorage. Warn admin if image > 500KB.
- **VERIFY:** Add cake → appears in list. Reload → persists. Delete dynamic cake → removed.

---

#### Task 3.5 — `AdminOrderHistory.jsx` — Date-Browsable History
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P2
- **Dependencies:** Task 2.1
- **INPUT:** `useOrders.getAllDates()`, `useOrders.getOrdersByDate(selectedDate)`, `useOrders.getRevenueByDate(selectedDate)`
- **OUTPUT:**
  - Date picker (native `<input type="date">` or custom selector from available dates)
  - Revenue summary for selected date
  - Full order table for selected date
  - Empty state when no orders for selected date
- **VERIFY:** Select past date with orders → correct orders and revenue shown

---

#### Task 3.6 — `AdminApp.jsx` — Admin Shell with Sidebar
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P2
- **Dependencies:** Tasks 3.3, 3.4, 3.5
- **INPUT:** All admin pages
- **OUTPUT:**
  - Sidebar: Logo, nav links (Dashboard, Cakes, Order History, Logout)
  - Main content area rendering child routes
  - Mobile: Collapsible sidebar / bottom nav
- **DESIGN:** Deep plum sidebar, cream content area, gold accents. No purple. No generic dashboard clichés (no blue bento boxes).
- **VERIFY:** All nav links render correct page. Logout clears session and redirects to login.

---

### PHASE P3: Customer-Facing Order Flow

---

#### Task 4.1 — `OrderCTA.jsx` — CTA Button on Landing Page
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P3
- **Dependencies:** Task 1.1
- **INPUT:** Landing page layout (HeroSection or MenuSection)
- **OUTPUT:**
  - Sticky floating button (bottom-right) OR a prominent section CTA
  - On click → opens `<OrderModal />`
- **PLACEMENT:** Sticky bottom-right button (always visible), plus inline CTA button in MenuSection header
- **VERIFY:** Button visible on all scroll positions. Click opens modal.

---

#### Task 4.2 — `OrderModal.jsx` — Customer Order Form
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** P3
- **Dependencies:** Task 2.1, Task 2.2, Task 4.1
- **INPUT:** `allCakes` from `useDynamicMenu`, `addOrder` from `useOrders`
- **OUTPUT:**
  - Framer Motion animated modal (slide up from bottom or fade scale)
  - Fields: Customer Name, Phone, Cake (dropdown from allCakes), Quantity (number), Notes (textarea)
  - Price preview updates live based on selected cake × quantity
  - Submit → saves order to IndexedDB → shows success confirmation
  - Close button + clicking backdrop closes modal
- **VERIFY:** Submit order → appears in Admin Dashboard under today's date with correct revenue.

---

### PHASE P4: App Wiring

---

#### Task 5.1 — Update `App.jsx` with Router
- **Agent:** `frontend-specialist`
- **Skill:** `nextjs-react-expert`
- **Priority:** P4
- **Dependencies:** Tasks 3.6, 4.1
- **INPUT:** Existing `App.jsx` with LayoutGroup
- **OUTPUT:**
  ```jsx
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingLayout />} />       // existing site + OrderCTA
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <AdminApp />
        </ProtectedRoute>
      } />
    </Routes>
  </BrowserRouter>
  ```
- **VERIFY:** `/` loads existing landing page. `/admin` redirects to login. `/admin/dashboard` loads after auth.

---

#### Task 5.2 — `.env.local` setup + gitignore check
- **Agent:** `security-auditor`
- **Skill:** `vulnerability-scanner`
- **Priority:** P4 (SECURITY)
- **Dependencies:** Task 2.3
- **INPUT:** None
- **OUTPUT:**
  - `.env.local` file with `VITE_ADMIN_PASSWORD=yourpassword`
  - Verify `.gitignore` already contains `.env.local` (Vite scaffold does this by default)
- **VERIFY:** `cat .gitignore | grep env.local` returns a match. Password not in any `.js` or `.jsx` file.

---

### PHASE X: Verification

| Check | Command | Expected |
|---|---|---|
| Lint | `npx eslint src --ext .jsx,.js --max-warnings=0` | 0 errors |
| Build | `npm run build` | No warnings |
| Security | `python .agents/scripts/checklist.py .` | All green |
| Order flow | Manual: Submit order on `/` → check `/admin/dashboard` | Order appears |
| Revenue | Manual: Note order total → check revenue card | Correct sum |
| History | Manual: Pick yesterday's date in history | Orders show |
| Auth guard | Manual: Visit `/admin/dashboard` without login | Redirects to login |
| Cake add | Manual: Add cake in admin → check landing page menu | Cake appears |

---

## ⚠️ Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| localStorage limit (5MB) hit by base64 images | Medium | Warn admin if image > 500KB; suggest smaller images |
| IndexedDB not available (private mode some browsers) | Low | Graceful fallback message to admin |
| `.env.local` accidentally committed | Low | Always verify in `.gitignore`; never hardcode password in source |
| Daily reset confusion (revenue vs orders) | Low | Clear UI labeling: "Revenue resets daily, order history is permanent" |

---

## 📊 Implementation Sequence

```
Task 1.1 (deps) → Task 1.2 (DB schema)
                      ↓
         Task 2.1 (useOrders) + Task 2.2 (useDynamicMenu) + Task 2.3 (useAdminAuth)
                      ↓
    Task 3.1 (ProtectedRoute) → Task 3.2 (Login) → Tasks 3.3–3.5 (Dashboard/Cakes/History)
                      ↓
                Task 3.6 (AdminApp shell)
                      ↓
         Task 4.1 (OrderCTA) + Task 4.2 (OrderModal)
                      ↓
            Task 5.1 (App.jsx wiring) + Task 5.2 (.env.local)
                      ↓
                  PHASE X (Verification)
```

---

## 💡 Image Names Expected in `/public/images/` (admin uploads are base64 in localStorage)

The static seed cakes from `menuData.js` still reference:
- `chocolate_ganache_drip_cake.webp`
- `pastel_sprinkles_cake.webp`
- `artisanal_strawberry_shortcake.webp`
- `modern_fondant_celebration_cake.webp`
- `red_velvet_layer_cake.webp`
- `carrot_cake_with_spices.webp`
- `lemon_meringue_cake.webp`
- `coffee_walnut_cake.webp`

Admin-uploaded cakes use base64 data URIs stored in localStorage (no file system access required).
