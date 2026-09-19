import { useLanguage } from "../context/LangContext.jsx";
import "../assets/scss/LangButton.scss"

const LANGUAGES = [
  { code: "az", label: "AZ" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitchButton() {
  const { currentLang, changeLanguage } = useLanguage();

  return (
    <div className="lang-switch" role="radiogroup" aria-label="Dil seçimi">
      {LANGUAGES.map((lang) => {
        const isActive = lang.code === currentLang;
        return (
          <button
            key={lang.code}
            role="radio"
            aria-checked={isActive}
            className={`lang-switch__option${isActive ? " lang-switch__option--active" : ""}`}
            onClick={() => changeLanguage(lang.code)}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}