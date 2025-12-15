/**
 * Utilitaires de formatage - WiW AE+
 * Formatage des nombres, dates et textes
 */

/**
 * Formate un nombre en devise (EUR par défaut)
 * @param {number} value
 * @param {string} currency
 * @param {string} locale
 * @returns {string}
 */
export function formatCurrency(value, currency = 'EUR', locale = 'fr-FR') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Formate un nombre avec séparateurs
 * @param {number} value
 * @param {number} decimals
 * @param {string} locale
 * @returns {string}
 */
export function formatNumber(value, decimals = 0, locale = 'fr-FR') {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

/**
 * Formate un pourcentage
 * @param {number} value - Valeur entre 0 et 1
 * @param {number} decimals
 * @param {string} locale
 * @returns {string}
 */
export function formatPercent(value, decimals = 0, locale = 'fr-FR') {
    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

/**
 * Formate une date
 * @param {Date|string|number} date
 * @param {Object} options
 * @param {string} locale
 * @returns {string}
 */
export function formatDate(date, options = {}, locale = 'fr-FR') {
    const d = date instanceof Date ? date : new Date(date);

    const defaultOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...options
    };

    return new Intl.DateTimeFormat(locale, defaultOptions).format(d);
}

/**
 * Formate une date et heure
 * @param {Date|string|number} date
 * @param {string} locale
 * @returns {string}
 */
export function formatDateTime(date, locale = 'fr-FR') {
    return formatDate(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }, locale);
}

/**
 * Formate une date relative (il y a X jours, etc.)
 * @param {Date|string|number} date
 * @param {string} locale
 * @returns {string}
 */
export function formatRelativeDate(date, locale = 'fr-FR') {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffSec < 60) return rtf.format(-diffSec, 'second');
    if (diffMin < 60) return rtf.format(-diffMin, 'minute');
    if (diffHour < 24) return rtf.format(-diffHour, 'hour');
    if (diffDay < 30) return rtf.format(-diffDay, 'day');
    if (diffDay < 365) return rtf.format(-Math.floor(diffDay / 30), 'month');
    return rtf.format(-Math.floor(diffDay / 365), 'year');
}

/**
 * Formate une durée en heures:minutes
 * @param {number} minutes
 * @returns {string}
 */
export function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
}

/**
 * Formate une taille de fichier
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export function formatFileSize(bytes, decimals = 1) {
    if (bytes === 0) return '0 o';

    const k = 1024;
    const sizes = ['o', 'Ko', 'Mo', 'Go', 'To'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Tronque un texte
 * @param {string} text
 * @param {number} maxLength
 * @param {string} suffix
 * @returns {string}
 */
export function truncate(text, maxLength = 100, suffix = '...') {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength - suffix.length).trim() + suffix;
}

/**
 * Convertit en slug URL
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
        .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
        .replace(/\s+/g, '-') // Remplace les espaces par des tirets
        .replace(/-+/g, '-') // Supprime les tirets multiples
        .replace(/^-+|-+$/g, ''); // Supprime les tirets en début/fin
}

/**
 * Capitalise la première lettre
 * @param {string} text
 * @returns {string}
 */
export function capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convertit en Title Case
 * @param {string} text
 * @returns {string}
 */
export function titleCase(text) {
    if (!text) return '';
    return text.split(' ').map(capitalize).join(' ');
}

/**
 * Génère les initiales d'un nom
 * @param {string} name
 * @param {number} maxChars
 * @returns {string}
 */
export function initials(name, maxChars = 2) {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, maxChars)
        .join('');
}

/**
 * Pluralise un mot (français simple)
 * @param {number} count
 * @param {string} singular
 * @param {string} plural
 * @returns {string}
 */
export function pluralize(count, singular, plural = null) {
    if (count <= 1) return `${count} ${singular}`;
    return `${count} ${plural || singular + 's'}`;
}

/**
 * Masque partiellement un texte (email, téléphone)
 * @param {string} text
 * @param {number} visibleStart
 * @param {number} visibleEnd
 * @param {string} maskChar
 * @returns {string}
 */
export function mask(text, visibleStart = 3, visibleEnd = 2, maskChar = '*') {
    if (!text || text.length <= visibleStart + visibleEnd) return text;

    const start = text.slice(0, visibleStart);
    const end = text.slice(-visibleEnd);
    const middle = maskChar.repeat(text.length - visibleStart - visibleEnd);

    return start + middle + end;
}

/**
 * Formate un numéro de téléphone français
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }

    return phone;
}

// Export par défaut
export default {
    formatCurrency,
    formatNumber,
    formatPercent,
    formatDate,
    formatDateTime,
    formatRelativeDate,
    formatDuration,
    formatFileSize,
    truncate,
    slugify,
    capitalize,
    titleCase,
    initials,
    pluralize,
    mask,
    formatPhone
};
