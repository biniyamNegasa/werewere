import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }) {
  // Try to get theme from localStorage, default to 'system'
  const storedTheme =
    typeof window !== "undefined" ? localStorage.getItem("theme") : "system";
  const [theme, setTheme] = useState(storedTheme || "system"); // Ensure default if localStorage is empty

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove any existing theme classes
    root.classList.remove("light", "dark");

    // Determine the active theme based on user preference or system setting
    let actualTheme = theme;
    if (theme === "system") {
      actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // Apply the active theme class
    root.classList.add(actualTheme);

    // Save the user's explicit preference (not system) to localStorage
    // Only save 'light' or 'dark' if explicitly set, not 'system'
    if (theme !== "system") {
      localStorage.setItem("theme", theme);
    } else {
      localStorage.removeItem("theme"); // Remove if user prefers system theme
    }
  }, [theme]); // Re-run effect when 'theme' state changes

  const value = { theme, setTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
