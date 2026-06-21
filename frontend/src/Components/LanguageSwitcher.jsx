import { useTranslation } from "react-i18next";
import { useState } from "react";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        // localStorage.setItem("language", lang);
    };


    const [language, setLanguage] = useState('en')

    const langChangeHandler = () => {
        if (language === "en") {
            setLanguage('hi')
            changeLanguage("hi")
        }
        else {
            setLanguage('en')
            changeLanguage("en")
        }
    }

    return (
        <div>
<button
  onClick={langChangeHandler}
  className="relative flex items-center w-28 h-11 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-lg overflow-hidden cursor-pointer"
>
  <div
    className={`absolute top-1 h-9 w-12 rounded-full bg-gradient-to-r from-red-600 to-orange-500 shadow-lg transition-all duration-300 ${
      language === "en" ? "left-1" : "left-[60px]"
    }`}
  />

  <div className="relative flex w-full justify-between px-4 text-sm font-semibold">
    <span
      className={`z-10 transition ${
        language === "en" ? "text-white" : "text-gray-600"
      }`}
    >
      EN
    </span>

    <span
      className={`z-10 transition ${
        language === "hi" ? "text-white" : "text-gray-600"
      }`}
    >
      हिं
    </span>
  </div>
</button>
        </div>
    );
};

export default LanguageSwitcher;