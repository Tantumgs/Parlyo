 import { useState } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Quizzes from "./pages/Quizzes";
import Words from "./pages/Words";
import type { LevelCode } from "./data";

export type Page = "home" | "words" | "quizzes" | "profile";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [level, setLevel] = useState<LevelCode>("A1");

  return (
    <Layout page={page} onNavigate={setPage}>
      {page === "home" && <Home onNavigate={setPage} onPickLevel={setLevel} />}
      {page === "words" && <Words level={level} onPickLevel={setLevel} onNavigate={setPage} />}
      {page === "quizzes" && <Quizzes level={level} onPickLevel={setLevel} />}
      {page === "profile" && <Profile onNavigate={setPage} />}
    </Layout>
  );
}