// DataManagement Page - Import/Export et gestion des données
import { Component } from '../components/base.js';
import { storage } from '../utils/storage.js';
import { showToast } from '../components/toast.js';
import { showConfirm } from '../components/modal.js';

export class DataManagementPage extends Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            activeTab: 'donnees',
            storageInfo: this.getStorageInfo(),
            importing: false,
            exporting: false
        };
    }

    getStorageInfo() {
        let totalSize = 0;
        const items = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            const size = new Blob([value]).size;
            totalSize += size;

            if (key.startsWith('wiw-')) {
                items.push({
                    key,
                    size,
                    sizeFormatted: this.formatSize(size),
                    preview: value.substring(0, 50)
                });
            }
        }

        return {
            totalSize,
            totalSizeFormatted: this.formatSize(totalSize),
            items: items.sort((a, b) => b.size - a.size),
            quota: 5 * 1024 * 1024,
            usagePercent: Math.round((totalSize / (5 * 1024 * 1024)) * 100)
        };
    }

    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    exportData(format) {
        this.setState({ exporting: true });
        showToast(`Export ${format.toUpperCase()} en cours...`, 'info');

        setTimeout(() => {
            const date = new Date().toISOString().split('T')[0];
            let blob, fileName;

            // Récupérer toutes les données WIW
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

            if (format === 'json') {
                const exportData = {
                    application: 'WIW / AE+',
                    version: '1.0',
                    exportDate: new Date().toISOString(),
                    data: allData
                };
                blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                fileName = `wiw-backup-${date}.json`;
            } else if (format === 'csv') {
                // Export CSV simplifié
                const csvRows = ['Type,Clé,Données'];
                Object.entries(allData).forEach(([key, value]) => {
                    csvRows.push(`"${key}","${typeof value}","${JSON.stringify(value).substring(0, 100)}"`);
                });
                blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
                fileName = `wiw-data-${date}.csv`;
            }

            if (blob && fileName) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                showToast(`Export ${format.toUpperCase()} réussi`, 'success');
            }

            this.setState({ exporting: false });
        }, 1000);
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const confirmed = await showConfirm('Restaurer cette sauvegarde ? Les données actuelles seront remplacées.');
            if (!confirmed) return;

            this.setState({ importing: true });
            showToast('Import en cours...', 'info');

            try {
                const text = await file.text();
                const backupData = JSON.parse(text);

                if (backupData.data) {
                    Object.keys(backupData.data).forEach(key => {
                        if (typeof backupData.data[key] === 'string') {
                            localStorage.setItem(key, backupData.data[key]);
                        } else {
                            localStorage.setItem(key, JSON.stringify(backupData.data[key]));
                        }
                    });
                }

                this.setState({ storageInfo: this.getStorageInfo(), importing: false });
                showToast('Import réussi ! Rechargement...', 'success');
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                console.error('Erreur import:', error);
                showToast('Erreur lors de l\'import', 'error');
                this.setState({ importing: false });
            }
        };

        input.click();
    }

    async clearData(key) {
        if (key) {
            const confirmed = await showConfirm(`Supprimer "${key}" ?`);
            if (confirmed) {
                localStorage.removeItem(key);
                this.setState({ storageInfo: this.getStorageInfo() });
                showToast('Donnée supprimée', 'success');
            }
        }
    }

    async clearAllData() {
        const confirmed = await showConfirm('Supprimer TOUTES les données WIW ? Cette action est irréversible.');
        if (confirmed) {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('wiw-')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            this.setState({ storageInfo: this.getStorageInfo() });
            showToast('Toutes les données ont été supprimées', 'success');
        }
    }

    render() {
        const { activeTab, storageInfo, importing, exporting } = this.state;

        return `
            <div class="page-data-management">
                <div class="page-header">
                    <div>
                        <h2 style="font-size: 24px; margin-bottom: 5px;">💾 Gestion des Données</h2>
                        <p style="font-size: 14px; opacity: 0.7;">Importez, exportez et sauvegardez vos données</p>
                    </div>
                </div>

                ${this.renderStorageInfo(storageInfo)}

                <div class="card" style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 15px;">📤 Exporter les données</h3>
                    <p style="margin-bottom: 20px; opacity: 0.8;">Exportez toutes vos données dans le format de votre choix</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div class="card export-card" data-export="json" style="text-align: center; cursor: pointer; padding: 20px; background: var(--panel);">
                            <div style="font-size: 48px; margin-bottom: 10px;">📋</div>
                            <h4>JSON</h4>
                            <p style="font-size: 12px; opacity: 0.7;">Format complet pour restauration</p>
                        </div>
                        <div class="card export-card" data-export="csv" style="text-align: center; cursor: pointer; padding: 20px; background: var(--panel);">
                            <div style="font-size: 48px; margin-bottom: 10px;">📊</div>
                            <h4>CSV</h4>
                            <p style="font-size: 12px; opacity: 0.7;">Compatible Excel</p>
                        </div>
                    </div>
                </div>

                <div class="card" style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 15px;">📥 Importer des données</h3>
                    <p style="margin-bottom: 20px; opacity: 0.8;">Restaurez une sauvegarde précédente (format JSON)</p>
                    <button class="btn btn-primary" data-action="import" ${importing ? 'disabled' : ''}>
                        ${importing ? '⏳ Import en cours...' : '📥 Importer une sauvegarde'}
                    </button>
                </div>

                ${this.renderDataList(storageInfo)}

                <div class="card" style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2);">
                    <h3 style="margin-bottom: 15px; color: #ef4444;">⚠️ Zone de danger</h3>
                    <p style="margin-bottom: 20px; opacity: 0.8;">Supprimez définitivement toutes vos données locales</p>
                    <button class="btn" data-action="clear-all" style="background: #ef4444; color: white;">
                        🗑️ Supprimer toutes les données
                    </button>
                </div>
            </div>
        `;
    }

    renderStorageInfo(info) {
        return `
            <div class="card" style="margin-bottom: 20px;">
                <h3 style="margin-bottom: 15px;">📊 Utilisation du stockage</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 15px;">
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: var(--brand);">${info.totalSizeFormatted}</div>
                        <div style="font-size: 12px; opacity: 0.7;">Utilisé</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #10b981;">${info.items.length}</div>
                        <div style="font-size: 12px; opacity: 0.7;">Éléments WIW</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: ${info.usagePercent > 80 ? '#ef4444' : '#3b82f6'};">${info.usagePercent}%</div>
                        <div style="font-size: 12px; opacity: 0.7;">Quota utilisé</div>
                    </div>
                </div>
                <div style="height: 8px; background: var(--panel); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${info.usagePercent}%; height: 100%; background: ${info.usagePercent > 80 ? '#ef4444' : '#3b82f6'}; transition: width 0.3s;"></div>
                </div>
            </div>
        `;
    }

    renderDataList(info) {
        if (info.items.length === 0) return '';

        return `
            <div class="card" style="margin-bottom: 20px;">
                <h3 style="margin-bottom: 15px;">📁 Données stockées</h3>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Clé</th>
                                <th style="text-align: right;">Taille</th>
                                <th style="width: 80px; text-align: center;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${info.items.map(item => `
                                <tr>
                                    <td style="font-family: monospace; font-size: 13px;">${item.key}</td>
                                    <td style="text-align: right; font-size: 13px;">${item.sizeFormatted}</td>
                                    <td style="text-align: center;">
                                        <button class="btn btn-secondary" data-clear-key="${item.key}" style="padding: 4px 8px; font-size: 11px; background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Export cards
        document.querySelectorAll('.export-card').forEach(card => {
            card.addEventListener('click', () => this.exportData(card.dataset.export));
        });

        // Import button
        document.querySelector('[data-action="import"]')?.addEventListener('click', () => this.importData());

        // Clear all
        document.querySelector('[data-action="clear-all"]')?.addEventListener('click', () => this.clearAllData());

        // Clear individual keys
        document.querySelectorAll('[data-clear-key]').forEach(btn => {
            btn.addEventListener('click', () => this.clearData(btn.dataset.clearKey));
        });
    }
}
