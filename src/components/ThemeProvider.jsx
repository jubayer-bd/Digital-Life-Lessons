import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 1. Initialize theme from LocalStorage or System Preference
  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored;

      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // 2. Apply theme to <html> tag whenever 'theme' state changes
  useEffect(() => {
    const root = document.documentElement;
    // Remove the old class and add the new one
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Set data-attribute for DaisyUI or other CSS libraries
    root.setAttribute("data-theme", theme);
    
    // Save to local storage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 3. Sync theme across different tabs
  useEffect(() => {
    const syncTheme = (e) => {
      if (e.key === "theme") setTheme(e.newValue);
    };
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);