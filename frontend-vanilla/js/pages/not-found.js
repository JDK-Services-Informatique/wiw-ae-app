/**
 * Page 404 - WiW AE+
 */

import { icons } from '../components/icons.js';
import { t } from '../i18n/index.js';

export function renderNotFound() {
    return `
        <div class="error-page">
            <div>
                <div class="error-code">404</div>
                <h1 class="error-title">${t('errors.notFound')}</h1>
                <p class="error-description">
                    La page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                <div class="flex gap-md justify-center">
                    <a href="/" class="btn btn-primary">
                        ${icons.home}
                        Retour à l'accueil
                    </a>
                    <button onclick="history.back()" class="btn btn-secondary">
                        ${icons.arrowLeft}
                        Page précédente
                    </button>
                </div>
            </div>
        </div>
    `;
}

export default renderNotFound;
