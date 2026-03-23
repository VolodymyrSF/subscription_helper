"use client";

import { useEffect, useState } from "react";

const storageKey = "subsvault-theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const currentTheme = document.documentElement.dataset.theme;

    if (currentTheme === "dark" || currentTheme === "light") {
      setTheme(currentTheme);
      return;
    }

    const savedTheme = window.localStorage.getItem(storageKey);

    if (savedTheme === "dark" || savedTheme === "light") {
      applyTheme(savedTheme);
      setTheme(savedTheme);
    }
  }, []);

  return (
    <button
      className="button button-ghost theme-toggle"
      type="button"
      onClick={() => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        window.localStorage.setItem(storageKey, nextTheme);
        setTheme(nextTheme);
      }}
    >
      {theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    </button>
  );
}
