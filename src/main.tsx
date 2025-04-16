
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { seedCompaniesIfNeeded, seedTestReferrersIfNeeded } from './integrations/supabase/seed.ts'

// Seed initial data
async function seedData() {
  await seedCompaniesIfNeeded().catch(console.error);
  await seedTestReferrersIfNeeded().catch(console.error);
}

seedData();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
