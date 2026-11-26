import { useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Quizzes from "./pages/Quizzes";
import Words from "./pages/Words";
import type { LevelCode } from "./data";

export type Page = "home" | "words" | "quizzes" | "profile";

function pageFromUrl(): Page {
  if (typeof window === "undefined") return "home";
  const value = new URLSearchParams(window.location.search).get("page");
  return value === "words" || value === "quizzes" || value === "profile" ? value : "home";
}

export default function App() {
  const [page, setPage] = useState<Page>(pageFromUrl);
  const [level, setLevel] = useState<LevelCode>("A1");

  const navigate = (next: Page) => {
    setPage(next);
    const url = new URL(window.location.href);
    if (next === "home") url.searchParams.delete("page");
    else url.searchParams.set("page", next);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <Layout page={page} onNavigate={navigate}>
      {page === "home" && (
        <Home level={level} onNavigate={navigate} onPickLevel={setLevel} />
      )}
      {page === "words" && (
        <Words level={level} onPickLevel={setLevel} onNavigate={navigate} />
      )}
      {page === "quizzes" && <Quizzes level={level} onPickLevel={setLevel} />}
      {page === "profile" && <Profile onNavigate={navigate} />}
    </Layout>
  );
}
