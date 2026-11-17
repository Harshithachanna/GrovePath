Grovepath — Navigate Your Growth

Grovepath is a calm, visual-first pixel-botanical habit tracker and daily sanctuary built with React, TypeScript, Vite, Tailwind CSS, and Firebase. Instead of dense spreadsheets or noisy feeds, daily consistency is represented through living garden plots, gentle growth stages, and focused daily reminders.

Core Features:

Flashlight-Reveal Hero Entry: Full-bleed botanical landscape masked by a dark canopy veil (#0C180E) with a smooth cursor and touch spotlight revealing the meadow and retro monitor underneath

4×4 Pixel Farming Grid (#01–#16): Starts clean with zero pre-filled sample habits.

Seed-to-Weed Growth & Gentle Decay: Watering a plot marks today complete with a pixel droplet splash and advances growth (Seeds → Sprout → Sapling → Bloom). Missing 1–2 calendar days holds progress steady; 

Visual Plant Inspector, Insights & Settings: Inspect individual plot sprites and stage strips, review compact activity and category breakdowns in Insights, and manage profile details, sound effects, reduced motion, and data exports in Settings.

Tech Stack:
Frontend: React 19, TypeScript, Tailwind CSS v4
Bundler & Dev Server: Vite 8
Server & Services: Express (server.ts), Firebase / Firestore, Google Gemini API (@google/genai)
State & Storage: Local-first persistence (localStorage)

Project Structure

grovepath/
├── src/
│   ├── components/            # Reusable UI components, sprites, and modals
│   ├── views/                 # Primary application views (Hero, Sanctuary, Insights, Settings)
│   ├── hooks/                 # Custom React hooks and state utilities
│   ├── lib/                   # Firebase helpers, storage logic, and shared utilities
│   ├── App.tsx                # Root application component
│   └── main.tsx               # Client entry point
├── server.ts                  # Express server entry point
├── index.html                 # HTML document shell and font imports
├── vite.config.ts             # Vite build and dev server configuration
├── tsconfig.json              # TypeScript compiler configuration
├── eslint.config.mjs          # ESLint configuration
├── firebase-applet-config.json # Firebase client/applet configuration
├── firebase-blueprint.json    # Firestore data model blueprint
├── firestore.rules            # Firestore security rules
├── security_spec.md           # Security and data handling notes
├── .env.example               # Environment variable template (placeholders only)
├── .gitignore                 # Ignored files, build outputs, and local secrets
└── README.md

Run Locally
Prerequisites
Node.js
npm
Environment Setup:
npm install
npm run dev
Open http://localhost:3000/ in your browser.

