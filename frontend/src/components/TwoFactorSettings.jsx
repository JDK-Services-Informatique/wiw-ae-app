import React, { useState } from 'react';
import { Shield, QrCode, CheckCircle, XCircle, Key, Smartphone } from 'lucide-react';

/**
 * Composant de gestion de l'authentification à deux facteurs (2FA)
 * Intégration dans Settings.jsx
 */
export default function TwoFactorSettings({ enabled = false, onToggle, onSetup }) {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);

  const handleEnable2FA = async () => {
    try {
      setIsSettingUp(true);
      
      // Simuler la génération du QR code (à remplacer par un appel API réel)
      // En production, cela devrait venir du backend
      const mockQRCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setQrCode(mockQRCode);
      
      if (window.showToast) {
        window.showToast('📱 Scannez le QR code avec votre application d\'authentification', 'info');
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation 2FA:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors de l\'activation 2FA', 'error');
      }
      setIsSettingUp(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      if (!verificationCode || verificationCode.length !== 6) {
        if (window.showToast) {
          window.showToast('⚠️ Veuillez entrer un code à 6 chiffres', 'warning');
        }
        return;
      }

      // Simuler la vérification (à remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Générer des codes de secours (à remplacer par des codes réels du backend)
      const mockBackupCodes = Array.from({ length: 10 }, (_, i) => 
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );
      setBackupCodes(mockBackupCodes);

      setIsSettingUp(false);
      setQrCode(null);
      setVerificationCode('');

      if (onToggle) {
        onToggle(true);
      }

      if (window.showToast) {
        window.showToast('✅ Authentification à deux facteurs activée avec succès', 'success');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      if (window.showToast) {
        window.showToast('❌ Code invalide. Veuillez réessayer', 'error');
      }
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir désactiver l\'authentification à deux facteurs ? Votre compte sera moins sécurisé.')) {
      return;
    }

    try {
      // Simuler la désactivation (à remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 500));

      setBackupCodes([]);
      if (onToggle) {
        onToggle(false);
      }

      if (window.showToast) {
        window.showToast('🔓 Authentification à deux facteurs désactivée', 'info');
      }
    } catch (error) {
      console.error('Erreur lors de la désactivation 2FA:', error);
      if (window.showToast) {
        window.showToast('❌ Erreur lors de la désactivation 2FA', 'error');
      }
    }
  };

  const copyBackupCode = (code) => {
    navigator.clipboard.writeText(code);
    if (window.showToast) {
      window.showToast(`✅ Code copié: ${code}`, 'success');
    }
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wiw-backup-codes-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    if (window.showToast) {
      window.showToast('✅ Codes de secours téléchargés', 'success');
    }
  };

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield size={20} className="text-brand" />
            Authentification à deux facteurs (2FA)
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sécurisez votre compte avec une authentification renforcée
          </p>
        </div>
        <div className="flex items-center gap-2">
          {enabled ? (
            <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle size={20} />
              <span className="font-medium">Activé</span>
            </span>
          ) : (
            <span className="flex items-center gap-2 text-slate-400">
              <XCircle size={20} />
              <span className="font-medium">Désactivé</span>
            </span>
          )}
        </div>
      </div>

      {/* Statut actuel */}
      <div className={`p-4 rounded-lg border ${
        enabled 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
      }`}>
        <div className="flex items-start gap-3">
          <Shield size={24} className={enabled ? 'text-green-600 dark:text-green-400' : 'text-slate-400'} />
          <div className="flex-1">
            <div className="font-medium text-slate-900 dark:text-white mb-1">
              {enabled ? '2FA activé' : '2FA désactivé'}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {enabled 
                ? 'Votre compte est protégé par l\'authentification à deux facteurs. Vous devrez entrer un code de votre application d\'authentification à chaque connexion.'
                : 'Activez l\'authentification à deux facteurs pour renforcer la sécurité de votre compte. Vous devrez utiliser une application d\'authentification (Google Authenticator, Authy, etc.) pour générer des codes de vérification.'}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      {!enabled && !isSettingUp && !qrCode && (
        <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                Comment fonctionne l'authentification à deux facteurs ?
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                <li>Téléchargez une application d'authentification (Google Authenticator, Authy, Microsoft Authenticator)</li>
                <li>Scannez le QR code qui sera généré</li>
                <li>Entrez le code de vérification à 6 chiffres</li>
                <li>Conservez les codes de secours en lieu sûr</li>
              </ul>
            </div>
            <button
              onClick={handleEnable2FA}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors font-medium"
            >
              <QrCode size={20} />
              <span>Activer l'authentification à deux facteurs</span>
            </button>
          </div>
        </div>
      )}

      {/* Configuration en cours - QR Code */}
      {isSettingUp && qrCode && (
        <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <QrCode size={20} className="text-brand" />
                Étape 1 : Scannez le QR code
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Ouvrez votre application d'authentification et scannez ce QR code :
              </p>
              <div className="flex justify-center p-4 bg-white rounded-lg border border-slate-200 dark:border-slate-700">
                <img src={qrCode} alt="QR Code 2FA" className="w-48 h-48" />
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Key size={20} className="text-brand" />
                Étape 2 : Entrez le code de vérification
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Entrez le code à 6 chiffres généré par votre application :
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center text-2xl tracking-widest font-mono"
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6}
                  className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Vérifier
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSettingUp(false);
                setQrCode(null);
                setVerificationCode('');
              }}
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Codes de secours */}
      {enabled && backupCodes.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-6">
          <div className="flex items-start gap-3 mb-4">
            <Key size={24} className="text-yellow-600 dark:text-yellow-400" />
            <div className="flex-1">
              <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                Codes de secours
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Conservez ces codes en lieu sûr. Ils vous permettront de récupérer l'accès à votre compte si vous perdez votre appareil.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {backupCodes.map((code, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
              >
                <code className="font-mono text-sm text-slate-900 dark:text-white">{code}</code>
                <button
                  onClick={() => copyBackupCode(code)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  title="Copier"
                >
                  📋
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={downloadBackupCodes}
            className="w-full px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors font-medium"
          >
            Télécharger les codes de secours
          </button>
        </div>
      )}

      {/* Désactiver 2FA */}
      {enabled && (
        <div className="bg-white dark:bg-dark-panel rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                Désactiver l'authentification à deux facteurs
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Votre compte sera moins sécurisé après la désactivation.
              </p>
            </div>
            <button
              onClick={handleDisable2FA}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors font-medium"
            >
              Désactiver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

