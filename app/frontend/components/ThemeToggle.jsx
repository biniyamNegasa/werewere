import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button"; // shadcn Button

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    // Cycles through 'light', 'dark', 'system' or just 'light'/'dark'
    setTheme((prevTheme) => {
      if (prevTheme === "light") return "dark";
      if (prevTheme === "dark") return "system";
      return "light"; // If system, go to light
    });
  };

  const displayTheme = theme.charAt(0).toUpperCase() + theme.slice(1); // Capitalize first letter

  return (
    <Button onClick={toggleTheme} variant="outline" size="sm">
      Theme: {displayTheme}
    </Button>
  );
}
