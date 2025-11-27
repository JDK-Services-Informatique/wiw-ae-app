import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe size={16} />
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}


