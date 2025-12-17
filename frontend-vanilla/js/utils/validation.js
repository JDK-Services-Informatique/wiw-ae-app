/**
 * Système de validation de formulaires - WiW AE+
 */

export const rules = {
    required: (value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return true;
    },

    email: (value) => {
        if (!value) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },

    phone: (value) => {
        if (!value) return true;
        return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(value.replace(/\s/g, ''));
    },

    minLength: (min) => (value) => !value || value.length >= min,
    maxLength: (max) => (value) => !value || value.length <= max,
    min: (minValue) => (value) => (!value && value !== 0) || parseFloat(value) >= minValue,
    max: (maxValue) => (value) => (!value && value !== 0) || parseFloat(value) <= maxValue,
    pattern: (regex) => (value) => !value || regex.test(value),
    numeric: (value) => (!value && value !== 0) || !isNaN(parseFloat(value)),
    integer: (value) => (!value && value !== 0) || Number.isInteger(parseFloat(value)),
    positive: (value) => (!value && value !== 0) || parseFloat(value) > 0,

    date: (value) => {
        if (!value) return true;
        return !isNaN(new Date(value).getTime());
    },

    futureDate: (value) => {
        if (!value) return true;
        return new Date(value) >= new Date().setHours(0,0,0,0);
    },

    url: (value) => {
        if (!value) return true;
        try { new URL(value); return true; } catch { return false; }
    },

    siret: (value) => !value || /^\d{14}$/.test(value.replace(/\s/g, '')),
    siren: (value) => !value || /^\d{9}$/.test(value.replace(/\s/g, '')),
    postalCode: (value) => !value || /^\d{5}$/.test(value),

    password: (value) => {
        if (!value) return true;
        return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
    },

    passwordStrength: (value) => {
        if (!value) return { score: 0, label: 'Vide', class: '' };
        let score = 0;
        if (value.length >= 8) score++;
        if (value.length >= 12) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/\d/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        const labels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Fort', 'Très fort'];
        const classes = ['strength-very-weak', 'strength-weak', 'strength-fair', 'strength-good', 'strength-strong', 'strength-very-strong'];
        return { score, label: labels[Math.min(score, 5)], class: classes[Math.min(score, 5)], percentage: (score / 6) * 100 };
    },

    match: (fieldName) => (value, formData) => value === formData[fieldName]
};

export const messages = {
    required: 'Ce champ est requis',
    email: 'Veuillez entrer une adresse email valide',
    phone: 'Veuillez entrer un numéro de téléphone valide',
    minLength: (min) => `Minimum ${min} caractères requis`,
    maxLength: (max) => `Maximum ${max} caractères autorisés`,
    min: (minValue) => `La valeur doit être ≥ ${minValue}`,
    max: (maxValue) => `La valeur doit être ≤ ${maxValue}`,
    numeric: 'Veuillez entrer un nombre valide',
    integer: 'Veuillez entrer un nombre entier',
    positive: 'La valeur doit être positive',
    date: 'Veuillez entrer une date valide',
    futureDate: 'La date doit être dans le futur',
    url: 'Veuillez entrer une URL valide',
    siret: 'Le SIRET doit contenir 14 chiffres',
    siren: 'Le SIREN doit contenir 9 chiffres',
    postalCode: 'Le code postal doit contenir 5 chiffres',
    password: 'Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre',
    match: () => 'Les champs doivent correspondre',
    pattern: 'Format non valide'
};

export class FormValidator {
    constructor(formElement, schema, options = {}) {
        this.form = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;
        this.schema = schema;
        this.options = { validateOnBlur: true, validateOnInput: false, showErrorsInline: true, scrollToFirstError: true, errorClass: 'form-error', errorMessageClass: 'form-error-message', successClass: 'form-success', ...options };
        this.errors = {};
        this.touched = new Set();
        if (this.form) this.init();
    }

    init() {
        this.form.setAttribute('novalidate', 'true');
        this.form.querySelectorAll('[name]').forEach(field => {
            if (this.options.validateOnBlur) field.addEventListener('blur', () => this.validateField(field.name));
            if (this.options.validateOnInput) field.addEventListener('input', () => this.validateField(field.name));
            field.addEventListener('focus', () => this.touched.add(field.name));
        });
        this.form.addEventListener('submit', (e) => { if (!this.validate()) e.preventDefault(); });
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            if (data.hasOwnProperty(key)) {
                data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
            } else {
                data[key] = value;
            }
        }
        return data;
    }

    validateField(fieldName) {
        const fieldSchema = this.schema[fieldName];
        if (!fieldSchema) return true;

        const formData = this.getFormData();
        const value = formData[fieldName];
        const errors = [];

        for (const rule of fieldSchema.rules || []) {
            let validator, message;
            if (typeof rule === 'string') {
                validator = rules[rule];
                message = messages[rule];
            } else if (typeof rule === 'object') {
                const [ruleName, param] = Object.entries(rule)[0];
                if (typeof rules[ruleName] === 'function') {
                    const ruleResult = rules[ruleName](param);
                    validator = typeof ruleResult === 'function' ? ruleResult : rules[ruleName];
                }
                message = typeof messages[ruleName] === 'function' ? messages[ruleName](param) : (rule.message || messages[ruleName]);
            } else if (typeof rule === 'function') {
                validator = rule;
                message = 'Validation échouée';
            }
            if (validator && !validator(value, formData)) errors.push(rule.message || message);
        }

        if (errors.length > 0) this.errors[fieldName] = errors;
        else delete this.errors[fieldName];
        if (this.options.showErrorsInline) this.showFieldError(fieldName, errors);
        return errors.length === 0;
    }

    validate() {
        this.errors = {};
        let isValid = true;
        for (const fieldName of Object.keys(this.schema)) {
            if (!this.validateField(fieldName)) isValid = false;
        }
        if (!isValid && this.options.scrollToFirstError) {
            const firstError = this.form.querySelector(`.${this.options.errorClass}`);
            if (firstError) { firstError.scrollIntoView({ behavior: 'smooth', block: 'center' }); firstError.focus(); }
        }
        return isValid;
    }

    showFieldError(fieldName, errors) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        const container = field.closest('.form-group') || field.parentElement;
        const existingError = container.querySelector(`.${this.options.errorMessageClass}`);
        if (existingError) existingError.remove();
        field.classList.remove(this.options.errorClass, this.options.successClass);

        if (errors.length > 0) {
            field.classList.add(this.options.errorClass);
            const errorEl = document.createElement('div');
            errorEl.className = this.options.errorMessageClass;
            errorEl.innerHTML = `<span class="error-icon">⚠️</span> ${errors[0]}`;
            errorEl.setAttribute('role', 'alert');
            if (field.nextElementSibling) field.nextElementSibling.before(errorEl);
            else container.appendChild(errorEl);
        } else if (this.touched.has(fieldName)) {
            field.classList.add(this.options.successClass);
        }
    }

    reset() {
        this.errors = {};
        this.touched.clear();
        this.form.querySelectorAll(`.${this.options.errorMessageClass}`).forEach(el => el.remove());
        this.form.querySelectorAll(`.${this.options.errorClass}, .${this.options.successClass}`).forEach(el => {
            el.classList.remove(this.options.errorClass, this.options.successClass);
        });
    }

    hasErrors() { return Object.keys(this.errors).length > 0; }
    getErrors() { return { ...this.errors }; }
    setError(fieldName, message) { this.errors[fieldName] = [message]; if (this.options.showErrorsInline) this.showFieldError(fieldName, [message]); }
    clearError(fieldName) { delete this.errors[fieldName]; if (this.options.showErrorsInline) this.showFieldError(fieldName, []); }
}

export const formatters = {
    phone: (value) => {
        if (!value) return '';
        const d = value.replace(/\D/g, '');
        if (d.length <= 2) return d;
        if (d.length <= 4) return `${d.slice(0,2)} ${d.slice(2)}`;
        if (d.length <= 6) return `${d.slice(0,2)} ${d.slice(2,4)} ${d.slice(4)}`;
        if (d.length <= 8) return `${d.slice(0,2)} ${d.slice(2,4)} ${d.slice(4,6)} ${d.slice(6)}`;
        return `${d.slice(0,2)} ${d.slice(2,4)} ${d.slice(4,6)} ${d.slice(6,8)} ${d.slice(8,10)}`;
    },
    siret: (value) => {
        if (!value) return '';
        const d = value.replace(/\D/g, '');
        if (d.length <= 3) return d;
        if (d.length <= 6) return `${d.slice(0,3)} ${d.slice(3)}`;
        if (d.length <= 9) return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6)}`;
        return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6,9)} ${d.slice(9,14)}`;
    },
    postalCode: (value) => value ? value.replace(/\D/g, '').slice(0, 5) : '',
    currency: (value) => {
        if (!value) return '';
        const num = parseFloat(value.replace(/[^\d.-]/g, ''));
        return isNaN(num) ? '' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(num);
    },
    uppercase: (value) => value ? value.toUpperCase() : '',
    lowercase: (value) => value ? value.toLowerCase() : '',
    capitalize: (value) => value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ''
};

export default FormValidator;
