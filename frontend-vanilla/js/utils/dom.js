/**
 * Utilitaires DOM - WiW AE+
 * Helpers pour manipulation du DOM
 */

/**
 * Sélectionne un élément
 * @param {string} selector
 * @param {HTMLElement} parent
 * @returns {HTMLElement|null}
 */
export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Sélectionne tous les éléments
 * @param {string} selector
 * @param {HTMLElement} parent
 * @returns {NodeListOf<HTMLElement>}
 */
export function $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * Crée un élément avec des attributs et du contenu
 * @param {string} tag
 * @param {Object} options
 * @returns {HTMLElement}
 */
export function createElement(tag, options = {}) {
    const element = document.createElement(tag);

    if (options.className) {
        element.className = options.className;
    }

    if (options.id) {
        element.id = options.id;
    }

    if (options.text) {
        element.textContent = options.text;
    }

    if (options.html) {
        element.innerHTML = options.html;
    }

    if (options.attrs) {
        Object.entries(options.attrs).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    if (options.data) {
        Object.entries(options.data).forEach(([key, value]) => {
            element.dataset[key] = value;
        });
    }

    if (options.style) {
        Object.assign(element.style, options.style);
    }

    if (options.events) {
        Object.entries(options.events).forEach(([event, handler]) => {
            element.addEventListener(event, handler);
        });
    }

    if (options.children) {
        options.children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
    }

    return element;
}

/**
 * Crée un fragment à partir de HTML
 * @param {string} html
 * @returns {DocumentFragment}
 */
export function htmlToFragment(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content;
}

/**
 * Crée un élément à partir de HTML
 * @param {string} html
 * @returns {HTMLElement}
 */
export function htmlToElement(html) {
    const fragment = htmlToFragment(html);
    return fragment.firstElementChild;
}

/**
 * Vide un élément
 * @param {HTMLElement} element
 */
export function empty(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Ajoute une classe
 * @param {HTMLElement} element
 * @param {...string} classes
 */
export function addClass(element, ...classes) {
    element.classList.add(...classes);
}

/**
 * Supprime une classe
 * @param {HTMLElement} element
 * @param {...string} classes
 */
export function removeClass(element, ...classes) {
    element.classList.remove(...classes);
}

/**
 * Toggle une classe
 * @param {HTMLElement} element
 * @param {string} className
 * @param {boolean} force
 */
export function toggleClass(element, className, force) {
    return element.classList.toggle(className, force);
}

/**
 * Vérifie si un élément a une classe
 * @param {HTMLElement} element
 * @param {string} className
 * @returns {boolean}
 */
export function hasClass(element, className) {
    return element.classList.contains(className);
}

/**
 * Anime un élément puis le supprime
 * @param {HTMLElement} element
 * @param {string} animationClass
 */
export function animateOut(element, animationClass = 'removing') {
    addClass(element, animationClass);
    element.addEventListener('animationend', () => {
        element.remove();
    }, { once: true });
}

/**
 * Attend que le DOM soit prêt
 * @param {Function} callback
 */
export function ready(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

/**
 * Debounce une fonction
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

/**
 * Throttle une fonction
 * @param {Function} fn
 * @param {number} limit
 * @returns {Function}
 */
export function throttle(fn, limit = 100) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Délègue un événement
 * @param {HTMLElement} parent
 * @param {string} eventType
 * @param {string} selector
 * @param {Function} handler
 */
export function delegate(parent, eventType, selector, handler) {
    parent.addEventListener(eventType, (e) => {
        const target = e.target.closest(selector);
        if (target && parent.contains(target)) {
            handler.call(target, e, target);
        }
    });
}

/**
 * Fait défiler vers un élément
 * @param {HTMLElement|string} target
 * @param {Object} options
 */
export function scrollTo(target, options = {}) {
    const element = typeof target === 'string' ? $(target) : target;
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            ...options
        });
    }
}

/**
 * Copie du texte dans le presse-papier
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback pour les anciens navigateurs
        const textarea = createElement('textarea', {
            style: { position: 'fixed', opacity: 0 }
        });
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        textarea.remove();
        return success;
    }
}

/**
 * Vérifie si un élément est visible dans le viewport
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Gère le focus trap dans un élément (utile pour les modals)
 * @param {HTMLElement} element
 * @returns {Function} Fonction pour retirer le trap
 */
export function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeydown = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    };

    element.addEventListener('keydown', handleKeydown);
    firstFocusable?.focus();

    return () => element.removeEventListener('keydown', handleKeydown);
}
