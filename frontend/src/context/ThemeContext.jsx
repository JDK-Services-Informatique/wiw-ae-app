import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

/**
 * Provider de thème global
 * Gère le thème dark/light/auto avec persistance dans localStorage
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'auto';
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    // Auto mode
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Appliquer le thème au chargement et aux changements
  useEffect(() => {
    const applyTheme = () => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      } else {
        // Auto mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
          setIsDark(true);
        } else {
          document.documentElement.classList.remove('dark');
          setIsDark(false);
        }
      }
    };

    applyTheme();
    localStorage.setItem('theme', theme);

    // Écouter les changements de préférences système si en mode auto
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (theme === 'auto') {
          if (e.matches) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
          } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
          }
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const setThemeMode = (mode) => {
    setTheme(mode);
    if (window.showToast) {
      const messages = {
        dark: '🌙 Mode sombre activé',
        light: '☀️ Mode clair activé',
        auto: '🔄 Mode automatique activé'
      };
      window.showToast(messages[mode] || 'Thème mis à jour', 'success');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setTheme: setThemeMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;

