import { useTheme } from "../context/ThemeContext";
import { FiSun } from "react-icons/fi";
import { FaMoon } from "react-icons/fa";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="switch">
      <span className="sun"><FiSun /></span>
      <span className="moon"><FaMoon /></span>
      <input
        type="checkbox"
        className="input"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <span className="slider" />
    </label>
  );
}

export default ThemeToggle;