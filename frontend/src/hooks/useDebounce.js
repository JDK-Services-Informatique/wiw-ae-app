import { useState, useEffect } from 'react';

/**
 * Hook useDebounce
 * Optimise les recherches en retardant l'exécution jusqu'à ce que l'utilisateur ait arrêté de taper
 * 
 * @param {any} value - La valeur à débouncer
 * @param {number} delay - Le délai en millisecondes (défaut: 500ms)
 * @returns {any} La valeur débouncée
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Effectuer la recherche
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Créer un timer qui met à jour la valeur débouncée après le délai
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyer le timer si la valeur change avant la fin du délai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook useDebounceCallback
 * Version avec callback pour exécuter une fonction après le debounce
 * 
 * @param {function} callback - La fonction à exécuter
 * @param {number} delay - Le délai en millisecondes (défaut: 500ms)
 * @param {Array} deps - Les dépendances pour le callback
 * 
 * @example
 * const debouncedSearch = useDebounceCallback((term) => {
 *   performSearch(term);
 * }, 500);
 * 
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export function useDebounceCallback(callback, delay = 500, deps = []) {
  const [debouncedCallback, setDebouncedCallback] = useState(() => callback);

  useEffect(() => {
    setDebouncedCallback(() => callback);
  }, deps);

  return useDebounce(debouncedCallback, delay);
}

export default useDebounce;

