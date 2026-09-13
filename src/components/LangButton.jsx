import { useState } from "react";
import "../assets/scss/LangButton.scss"

// Statik data — sonra Supabase / i18n context ilə əvəz edə bilərsiniz
const LANGUAGES = [
  { code: "az", label: "AZ" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitchButton() {
  const [active, setActive] = useState("az");

  return (
    <div className="lang-switch" role="radiogroup" aria-label="Dil seçimi">
      {LANGUAGES.map((lang) => {
        const isActive = lang.code === active;
        return (
          <button
            key={lang.code}
            role="radio"
            aria-checked={isActive}
            className={`lang-switch__option${isActive ? " lang-switch__option--active" : ""}`}
            onClick={() => setActive(lang.code)}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}