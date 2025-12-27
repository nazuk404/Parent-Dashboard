# SnapSense Parent Dashboard

A React 18 + TypeScript + Vite dashboard for **SnapSense: The Smart Learning Canvas**. Parents can manage Netflix/Hotstar-style child profiles and monitor live progress from the ESP32 RFID game board (first-aid sequencing, color mixing, story ordering). Tailwind CSS, shadcn-inspired UI primitives, Framer Motion, Zustand, React Query, Recharts, and jsPDF power the experience.

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Features
- Profile landing with card-based child selectors, streak preview, add-profile modal (age 3–8, emoji/color, favorite module).
- Dark navy parent theme with playful kid gradients and a theme toggle.
- Child dashboard: achievements grid, module progress bars, EXP radial gauge, badge gallery, streak heatmap, activity timeline, win-rate pie, and weekly focus tips.
- Live feed mock from ESP32 via `subscribeToLiveEvents`, React Query polling for `/api/child/:id` placeholders, and mock data in `src/lib/esp32-api.ts` ready for real endpoints.
- One-click weekly report export (jsPDF) plus “Send weekly report” hook for email/back-end delivery.

## Project Structure
- `src/hooks/useProfiles.ts` — Zustand store for profile selection and creation.
- `src/lib/esp32-api.ts` — mock dashboard data, live event subscription, report hook placeholders.
- `src/pages/Dashboard.tsx` — main child view assembling all widgets.
- `src/components/ui/*` — lightweight shadcn-style primitives.

## Notes for Integration
- Replace mock API functions in `src/lib/esp32-api.ts` with real REST/WebSocket calls to the Node.js/MongoDB backend or ESP32 WiFi endpoints.
- Tailwind is configured with dark mode classes; update theme tokens in `tailwind.config.js` as needed.
- Deployment ready for Vercel/GitHub Pages; ensure env vars for auth/email services if added.
