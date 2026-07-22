import { useState } from "react";
import Hero from "./components/Landing/Hero.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";

export default function App() {
  const [page, setPage] = useState("landing"); // "landing" | "dashboard"

  return page === "landing" ? (
    <Hero onStartScanning={() => setPage("dashboard")} />
  ) : (
    <Dashboard onBackHome={() => setPage("landing")} />
  );
}
