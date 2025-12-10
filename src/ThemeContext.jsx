// src/ThemeContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const themes = {
  default: {
    name: "Default",
    background: "#f8f9fa",
    text: "#212529",
    accent: "#0d6efd",
    cardBg: "#ffffff",
    border: "#ced4da",
  },
  midnight: {
    name: "Midnight",
    background: "#0b0c10",
    text: "#c5c6c7",
    accent: "#66fcf1",
    cardBg: "#1f2833",
    border: "#45a29e",
  },
  nature: {
    name: "Nature",
    background: "#f3fff2",
    text: "#253d1d",
    accent: "#3c9a5f",
    cardBg: "#e6f4ea",
    border: "#81c784",
  },
  candy: {
    name: "Candy",
    background: "#fff0f6",
    text: "#5c2a59",
    accent: "#e64980",
    cardBg: "#ffe3ec",
    border: "#ff99c8",
  },
  forest: {
    name: "Forest",
    background: "#1b3d2f",
    text: "#e9f5ec",
    accent: "#2ecc71",
    border: "#27ae60",
  },
  sunset: {
    name: "Sunset",
    background: "#ffedd5",
    text: "#5a1a01",
    accent: "#f97316",
    border: "#ea580c",
  },
  ocean: {
    name: "Ocean",
    background: "#e0f7fa",
    text: "#014d63",
    accent: "#0288d1",
    border: "#03a9f4",
  },
  lavender: {
    name: "Lavender",
    background: "#f5f3ff",
    text: "#3f3cbb",
    accent: "#8b5cf6",
    border: "#7c3aed",
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("appTheme");
    return saved ? themes[saved] : themes.default;
  });

  useEffect(() => {
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
  }, [theme]);

  const changeTheme = (themeName) => {
    setTheme(themes[themeName]);
    localStorage.setItem("appTheme", themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}