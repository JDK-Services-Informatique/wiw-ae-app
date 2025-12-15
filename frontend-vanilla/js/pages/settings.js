/**
 * Page Settings - Paramètres de l'application
 * Conversion de React vers Vanilla JS
 */

import { Component } from '../components/base.js';
import { icons } from '../components/icons.js';
import { storage } from '../utils/storage.js';
import { toast } from '../components/ui/toast.js';
import { modal } from '../components/ui/modal.js';
import { i18n, t } from '../i18n/index.js';
import { store } from '../store.js';

export class SettingsPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            viewMode: 'parametres', // 'parametres', 'donnees'
            settings: {
                notifications: {
                    email: true,
                    push: false,
                    nouveauxAppels: true,
                    rapports: true
                },
                affichage: {
                    theme: storage.get('theme', 'dark'),
                    langue: storage.get('langue', 'fr'),
                    format: 'DD/MM/YYYY'
                },
                securite: {
                    auth2fa: false,
                    sessionTimeout: 60
                }
            },
            logoCabinet: storage.get('logoCabinet', null)
        };
    }

    onMount() {
        this.bindEvents();
    }

    bindEvents() {
        const container = this.container;
        if (!container) return;

        // View mode
        container.querySelectorAll('[data-view-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setState({ viewMode: e.currentTarget.dataset.viewMode });
            });
        });

        // Save settings
        container.querySelector('#btn-save-settings')?.addEventListener('click', () => this.saveSettings());

        // Notifications toggles
        ['email', 'push', 'nouveauxAppels', 'rapports'].forEach(key => {
            container.querySelector(`#notif-${key}`)?.addEventListener('change', (e) => {
                this.updateSettings('notifications', key, e.target.checked);
            });
        });

        // Theme
        container.querySelector('#setting-theme')?.addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });

        // Language
        container.querySelectorAll('[data-lang]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeLanguage(e.currentTarget.dataset.lang);
            });
        });

        // Date format
        container.querySelector('#setting-format')?.addEventListener('change', (e) => {
            this.updateSettings('affichage', 'format', e.target.value);
        });

        // Session timeout
        container.querySelector('#setting-timeout')?.addEventListener('change', (e) => {
            this.updateSettings('securite', 'sessionTimeout', parseInt(e.target.value));
        });

        // 2FA toggle
        container.querySelector('#setting-2fa')?.addEventListener('change', (e) => {
            this.updateSettings('securite', 'auth2fa', e.target.checked);
        });

        // Logo upload
        container.querySelector('#btn-upload-logo')?.addEventListener('click', () => this.uploadLogo());
        container.querySelector('#btn-delete-logo')?.addEventListener('click', () => this.deleteLogo());

        // Export buttons
        container.querySelector('#btn-export-json')?.addEventListener('click', () => this.exportJSON());
        container.querySelector('#btn-export-csv')?.addEventListener('click', () => this.exportCSV());
        container.querySelector('#btn-export-excel')?.addEventListener('click', () => this.exportExcel());
        container.querySelector('#btn-import')?.addEventListener('click', () => this.importData());

        // Danger zone
        container.querySelector('#btn-delete-data')?.addEventListener('click', () => this.deleteAllData());
        container.querySelector('#btn-reset-app')?.addEventListener('click', () => this.resetApp());

        // Backup
        container.querySelector('#btn-create-backup')?.addEventListener('click', () => this.createBackup());
    }

    updateSettings(category, key, value) {
        this.setState({
            settings: {
                ...this.state.settings,
                [category]: {
                    ...this.state.settings[category],
                    [key]: value
                }
            }
        });
    }

    changeTheme(theme) {
        storage.set('theme', theme);
        this.updateSettings('affichage', 'theme', theme);

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
        } else if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }

        const labels = { dark: 'sombre', light: 'clair', auto: 'automatique' };
        toast.success(`Thème ${labels[theme]} appliqué`);
    }

    changeLanguage(lang) {
        storage.set('langue', lang);
        this.updateSettings('affichage', 'langue', lang);
        i18n.setLocale(lang);
        toast.success(`Langue changée: ${lang === 'fr' ? 'Français' : 'English'}`);

        // Re-render to apply translations
        this.update(this.props);
    }

    saveSettings() {
        storage.set('wiw-settings', this.state.settings);
        toast.success('Paramètres enregistrés');
    }

    uploadLogo() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    toast.error('Le fichier est trop volumineux (max 5 MB)');
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result;
                    storage.set('logoCabinet', base64);
                    this.setState({ logoCabinet: base64 });
                    toast.success('Logo téléchargé');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    deleteLogo() {
        storage.remove('logoCabinet');
        this.setState({ logoCabinet: null });
        toast.info('Logo supprimé');
    }

    exportJSON() {
        try {
            const allData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('wiw-')) {
                    try {
                        allData[key] = JSON.parse(localStorage.getItem(key));
                    } catch {
                        allData[key] = localStorage.getItem(key);
                    }
                }
            }
            const jsonString = JSON.stringify(allData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            this.downloadBlob(blob, `wiw-export-${new Date().toISOString().split('T')[0]}.json`);
            toast.success('Export JSON réussi');
        } catch (error) {
            toast.error('Erreur lors de l\'export JSON');
        }
    }

    exportCSV() {
        try {
            const projets = storage.get('wiw-projets', []);
            const csvRows = ['Nom,Type,Localisation,Année'];
            projets.forEach(p => {
                csvRows.push(`"${p.nom || ''}","${p.type || ''}","${p.localisation || ''}","${p.annee || ''}"`);
            });
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            this.downloadBlob(blob, `wiw-export-${new Date().toISOString().split('T')[0]}.csv`);
            toast.success('Export CSV réussi');
        } catch (error) {
            toast.error('Erreur lors de l\'export CSV');
        }
    }

    exportExcel() {
        try {
            const projets = storage.get('wiw-projets', []);
            const tsvRows = ['Nom\tType\tLocalisation\tAnnée'];
            projets.forEach(p => {
                tsvRows.push(`${p.nom || ''}\t${p.type || ''}\t${p.localisation || ''}\t${p.annee || ''}`);
            });
            const tsvContent = tsvRows.join('\n');
            const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel' });
            this.downloadBlob(blob, `wiw-export-${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success('Export Excel réussi');
        } catch (error) {
            toast.error('Erreur lors de l\'export Excel');
        }
    }

    downloadBlob(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                toast.info(`Import de "${file.name}" en cours...`);
                // Simulation
                setTimeout(() => toast.success('Import réussi'), 1000);
            }
        };
        input.click();
    }

    async deleteAllData() {
        const confirmed = await modal.confirm({
            title: 'Supprimer toutes les données',
            message: 'Cette action supprimera TOUTES les données de manière irréversible. Cette action ne peut pas être annulée !',
            confirmText: 'Supprimer',
            cancelText: 'Annuler',
            danger: true
        });

        if (confirmed) {
            const keysToKeep = ['wiw-user', 'theme', 'langue'];
            const allKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('wiw-') && !keysToKeep.includes(key)) {
                    allKeys.push(key);
                }
            }
            allKeys.forEach(key => localStorage.removeItem(key));
            toast.success('Toutes les données ont été supprimées');
            setTimeout(() => window.location.reload(), 1500);
        }
    }

    async resetApp() {
        const confirmed = await modal.confirm({
            title: 'Réinitialiser l\'application',
            message: 'Cette action réinitialisera complètement l\'application. Toutes les données et configurations seront perdues !',
            confirmText: 'Réinitialiser',
            cancelText: 'Annuler',
            danger: true
        });

        if (confirmed) {
            localStorage.clear();
            toast.success('Application réinitialisée');
            setTimeout(() => window.location.reload(), 1500);
        }
    }

    createBackup() {
        this.exportJSON();
        toast.success('Sauvegarde créée');
    }

    render() {
        const { viewMode, settings, logoCabinet } = this.state;

        return `
            <div class="page-settings">
                <!-- Header -->
                <div class="page-header">
                    <div class="page-header-content">
                        <h1 class="page-title">
                            ${icons.settings}
                            Paramètres & Données
                        </h1>
                    </div>
                    <div class="page-actions">
                        <button class="btn ${viewMode === 'parametres' ? 'btn-primary' : 'btn-secondary'}" data-view-mode="parametres">
                            Paramètres
                        </button>
                        <button class="btn ${viewMode === 'donnees' ? 'btn-primary' : 'btn-secondary'}" data-view-mode="donnees">
                            ${icons.save} Données
                        </button>
                        ${viewMode === 'parametres' ? `
                            <button id="btn-save-settings" class="btn btn-success">
                                ${icons.save} Enregistrer
                            </button>
                        ` : ''}
                    </div>
                </div>

                ${viewMode === 'parametres' ? this.renderParametres() : this.renderDonnees()}
            </div>
        `;
    }

    renderParametres() {
        const { settings, logoCabinet } = this.state;

        return `
            <!-- Notifications -->
            <div class="card mb-4">
                <h3 class="card-title mb-4">${icons.bell} Notifications</h3>

                <div class="settings-item">
                    <div>
                        <div class="font-semibold">Notifications par email</div>
                        <div class="text-sm text-muted">Recevoir des notifications par email</div>
                    </div>
                    <label class="toggle">
                        <input type="checkbox" id="notif-email" ${settings.notifications.email ? 'checked' : ''} />
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="settings-item">
                    <div>
                        <div class="font-semibold">Notifications push</div>
                        <div class="text-sm text-muted">Recevoir des notifications push dans le navigateur</div>
                    </div>
                    <label class="toggle">
                        <input type="checkbox" id="notif-push" ${settings.notifications.push ? 'checked' : ''} />
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="settings-item">
                    <div>
                        <div class="font-semibold">Nouveaux appels d'offres</div>
                        <div class="text-sm text-muted">Être notifié des nouveaux appels d'offres</div>
                    </div>
                    <label class="toggle">
                        <input type="checkbox" id="notif-nouveauxAppels" ${settings.notifications.nouveauxAppels ? 'checked' : ''} />
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="settings-item">
                    <div>
                        <div class="font-semibold">Rapports hebdomadaires</div>
                        <div class="text-sm text-muted">Recevoir un résumé hebdomadaire par email</div>
                    </div>
                    <label class="toggle">
                        <input type="checkbox" id="notif-rapports" ${settings.notifications.rapports ? 'checked' : ''} />
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <!-- Affichage -->
            <div class="card mb-4">
                <h3 class="card-title mb-4">${icons.monitor} Affichage</h3>

                <div class="form-group mb-4">
                    <label class="form-label">Thème</label>
                    <select id="setting-theme" class="form-input">
                        <option value="dark" ${settings.affichage.theme === 'dark' ? 'selected' : ''}>Sombre</option>
                        <option value="light" ${settings.affichage.theme === 'light' ? 'selected' : ''}>Clair</option>
                        <option value="auto" ${settings.affichage.theme === 'auto' ? 'selected' : ''}>Automatique</option>
                    </select>
                </div>

                <div class="form-group mb-4">
                    <label class="form-label">${icons.globe} Langue / Language</label>
                    <div class="flex gap-2 mt-2">
                        <button class="btn ${settings.affichage.langue === 'fr' ? 'btn-primary' : 'btn-secondary'} flex-1" data-lang="fr">
                            🇫🇷 Français
                        </button>
                        <button class="btn ${settings.affichage.langue === 'en' ? 'btn-primary' : 'btn-secondary'} flex-1" data-lang="en">
                            🇬🇧 English
                        </button>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Format de date</label>
                    <select id="setting-format" class="form-input">
                        <option value="DD/MM/YYYY" ${settings.affichage.format === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY" ${settings.affichage.format === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD" ${settings.affichage.format === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD</option>
                    </select>
                </div>
            </div>

            <!-- Logo Cabinet -->
            <div class="card mb-4">
                <h3 class="card-title mb-4">${icons.building} Logo du cabinet</h3>

                ${logoCabinet ? `
                    <div class="mb-4">
                        <div class="text-sm text-muted mb-2">Aperçu du logo</div>
                        <div class="logo-preview">
                            <img src="${logoCabinet}" alt="Logo du cabinet" />
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button id="btn-upload-logo" class="btn btn-secondary flex-1">
                            ${icons.refresh} Changer le logo
                        </button>
                        <button id="btn-delete-logo" class="btn btn-danger flex-1">
                            ${icons.trash} Supprimer
                        </button>
                    </div>
                ` : `
                    <p class="text-sm text-muted mb-4">
                        Téléchargez le logo de votre cabinet (formats acceptés: PNG, JPG, SVG - max 5 MB)
                    </p>
                    <button id="btn-upload-logo" class="btn btn-primary w-full">
                        ${icons.upload} Télécharger un logo
                    </button>
                `}
            </div>

            <!-- Sécurité -->
            <div class="card mb-4">
                <h3 class="card-title mb-4">${icons.lock} Sécurité</h3>

                <div class="settings-item">
                    <div>
                        <div class="font-semibold">Authentification à deux facteurs</div>
                        <div class="text-sm text-muted">Ajouter une couche de sécurité supplémentaire</div>
                    </div>
                    <label class="toggle">
                        <input type="checkbox" id="setting-2fa" ${settings.securite.auth2fa ? 'checked' : ''} />
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="form-group mt-4">
                    <label class="form-label">Délai d'expiration de session (minutes)</label>
                    <input
                        type="number"
                        id="setting-timeout"
                        class="form-input"
                        value="${settings.securite.sessionTimeout}"
                        min="15"
                        max="480"
                    />
                </div>
            </div>
        `;
    }

    renderDonnees() {
        return `
            <!-- Import/Export -->
            <div class="card mb-4">
                <h3 class="card-title mb-4">${icons.download} Import / Export</h3>

                <div class="mb-4">
                    <div class="font-semibold mb-2">📥 Importer des données</div>
                    <p class="text-sm text-muted mb-3">
                        Importez vos projets, références ou honoraires depuis un fichier
                    </p>
                    <button id="btn-import" class="btn btn-secondary w-full">
                        ${icons.upload} Sélectionner un fichier (JSON/CSV)
                    </button>
                </div>

                <hr class="my-4" />

                <div>
                    <div class="font-semibold mb-2">📤 Exporter les données</div>
                    <p class="text-sm text-muted mb-3">
                        Exportez toutes vos données dans différents formats
                    </p>
                    <div class="flex gap-2">
                        <button id="btn-export-json" class="btn btn-secondary flex-1">JSON</button>
                        <button id="btn-export-csv" class="btn btn-secondary flex-1">CSV</button>
                        <button id="btn-export-excel" class="btn btn-secondary flex-1">Excel</button>
                    </div>
                </div>
            </div>

            <!-- Sauvegardes -->
            <div class="card mb-4">
                <div class="card-header">
                    <h3 class="card-title">${icons.save} Sauvegardes</h3>
                    <button id="btn-create-backup" class="btn btn-primary">
                        ${icons.plus} Créer une sauvegarde
                    </button>
                </div>

                <p class="text-muted">
                    Les sauvegardes vous permettent de restaurer vos données en cas de problème.
                </p>
            </div>

            <!-- Zone de danger -->
            <div class="card mb-4 danger-zone">
                <h3 class="card-title mb-4 text-danger">${icons.alertTriangle} Zone de danger</h3>
                <p class="text-sm text-muted mb-4">
                    Ces actions sont irréversibles. Procédez avec prudence.
                </p>
                <div class="flex gap-2">
                    <button id="btn-delete-data" class="btn btn-warning flex-1">
                        ${icons.trash} Supprimer toutes les données
                    </button>
                    <button id="btn-reset-app" class="btn btn-danger flex-1">
                        ${icons.refresh} Réinitialiser l'application
                    </button>
                </div>
            </div>
        `;
    }

    onUpdate() {
        this.bindEvents();
    }
}

// Export pour utilisation dans le router
export function renderSettingsPage(container) {
    const page = new SettingsPage();
    page.mount(container);
    return page;
}
