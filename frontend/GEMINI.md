# Frontend Instructions (React/Tailwind)

Specific guidelines for the HRMS frontend.

## Tech Stack
- **Framework:** React 18 (Create React App)
- **Styling:** Tailwind CSS + Vanilla CSS (Global Design System)
- **Icons:** Lucide React
- **Animations:** Framer Motion, Three.js
- **API:** Axios (with JWT interceptor in `services/api.js`)

## Architecture & Design
- **Auth Gate:** `App.js` manages authentication state.
- **Routing:** Use `ProtectedRoute.jsx` for role-based access control.
- **Components:** 
  - `src/components/ui/`: Reusable UI primitives (shadcn-style).
  - `src/components/admin/` & `src/components/employee/`: Role-specific logic.
- **Services:** All API interaction must go through `src/services/`.
- **Hooks:** Use `src/hooks/` for shared logic (e.g., `useToast`).

## Development Commands
- **Install:** `npm install`
- **Run:** `npm start` (Proxies to `http://localhost:8081`)
- **Build:** `npm run build`

## Design System
- **Theme:** Teal primary (`#4ECDC4`), semantic colors for status (green/yellow/red).
- **Responsive:** Mobile-first for employee dashboard (bottom nav), desktop-optimized for admin (sidebar).
- **Tokens:** Use CSS variables defined in `global.css` and configured in `tailwind.config.js`.
