import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Lightbulb } from 'lucide-react';

// Composant Photothèque et Versioning PDF pour Devis
// Gère l'upload de photos et l'historique des versions PDF
export default function DevisMedias({ 
  devisId,
  photos = [],
  versionsPDF = [],
  onPhotosChange,
  onVersionsPDFChange 
}) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoDescription, setPhotoDescription] = useState('');

  // Simuler upload photo (en production, utiliser Vercel Blob ou S3)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier type et taille
    if (!file.type.startsWith('image/')) {
      alert('⚠️ Seules les images sont autorisées');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ La taille maximale est de 5 MB');
      return;
    }

    setUploadingPhoto(true);

    // Lire le fichier en base64 (pour demo localStorage)
    const reader = new FileReader();
    reader.onload = (event) => {
      const nouvellePhoto = {
        id: Date.now(),
        nom: file.name,
        taille: file.size,
        type: file.type,
        description: photoDescription,
        dateAjout: new Date().toISOString(),
        // En production, stocker URL (Vercel Blob, S3, etc.)
        // Pour demo, on stocke base64 (attention limite localStorage)
        dataURL: event.target.result
      };

      onPhotosChange([...photos, nouvellePhoto]);
      setPhotoDescription('');
      setUploadingPhoto(false);
      
      if (window.showToast) {
        window.showToast('✅ Photo ajoutée', 'success');
      }
    };
    reader.onerror = () => {
      setUploadingPhoto(false);
      alert('⚠️ Erreur lors de la lecture du fichier');
    };
    reader.readAsDataURL(file);
  };

  // Supprimer une photo
  const supprimerPhoto = (id) => {
    if (confirm('Supprimer cette photo ?')) {
      onPhotosChange(photos.filter(p => p.id !== id));
      if (window.showToast) {
        window.showToast('🗑️ Photo supprimée', 'info');
      }
    }
  };

  // Télécharger une photo
  const telechargerPhoto = (photo) => {
    const link = document.createElement('a');
    link.href = photo.dataURL;
    link.download = photo.nom;
    link.click();
  };

  // Ajouter une version PDF
  const ajouterVersionPDF = (pdfBlob, numero) => {
    const nouvelleVersion = {
      id: Date.now(),
      numero: numero,
      dateCreation: new Date().toISOString(),
      taille: pdfBlob.size,
      // En production, upload vers serveur
      // Pour demo, on stocke juste les métadonnées
      url: URL.createObjectURL(pdfBlob)
    };

    const nouvelles = [...versionsPDF, nouvelleVersion];
    onVersionsPDFChange(nouvelles);
    
    if (window.showToast) {
      window.showToast(`✅ Version ${numero} sauvegardée`, 'success');
    }
  };

  // Télécharger une version PDF
  const telechargerVersionPDF = (version) => {
    const link = document.createElement('a');
    link.href = version.url;
    link.download = `Devis_${devisId}_v${version.numero}.pdf`;
    link.click();
  };

  // Supprimer une version PDF
  const supprimerVersionPDF = (id) => {
    if (confirm('Supprimer cette version PDF ?')) {
      onVersionsPDFChange(versionsPDF.filter(v => v.id !== id));
      if (window.showToast) {
        window.showToast('🗑️ Version supprimée', 'info');
      }
    }
  };

  // Formater taille fichier
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Formater date
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Photothèque */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            📸 Photothèque ({photos.length})
          </h3>
          <label className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={uploadingPhoto}
            />
            {uploadingPhoto ? '⏳ Upload...' : '➕ Ajouter photo'}
          </label>
        </div>

        {/* Description pour prochaine photo */}
        <div className="mb-4">
          <input
            type="text"
            value={photoDescription}
            onChange={(e) => setPhotoDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Description de la photo (optionnel)"
          />
        </div>

        {/* Grille de photos */}
        {photos.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-2">📸</div>
            <p>Aucune photo. Ajoutez des photos de chantier, plans, etc.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
                {/* Miniature */}
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={photo.dataURL}
                    alt={photo.nom}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Infos */}
                <div className="p-3 space-y-2">
                  <div className="text-sm font-semibold text-gray-800 truncate" title={photo.nom}>
                    {photo.nom}
                  </div>
                  {photo.description && (
                    <div className="text-xs text-gray-600 truncate" title={photo.description}>
                      {photo.description}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(photo.taille)}</span>
                    <span>{new Date(photo.dateAjout).toLocaleDateString('fr-FR')}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => telechargerPhoto(photo)}
                      className="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      title="Télécharger"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() => supprimerPhoto(photo.id)}
                      className="flex-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Avertissement stockage */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2 text-sm text-yellow-800">
            <span><Lightbulb size={16} /></span>
            <div>
              <strong>Note :</strong> En production, les photos seront stockées sur Vercel Blob Storage ou AWS S3. 
              Actuellement, elles sont stockées en localStorage (limite ~5MB total).
            </div>
          </div>
        </div>
      </div>

      {/* Section Versions PDF */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            📄 Historique des versions PDF ({versionsPDF.length})
          </h3>
        </div>

        {/* Liste des versions */}
        {versionsPDF.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-2">📄</div>
            <p>Aucune version PDF sauvegardée</p>
            <p className="text-sm mt-2">Les versions seront automatiquement créées lors des exports PDF</p>
          </div>
        ) : (
          <div className="space-y-2">
            {versionsPDF
              .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
              .map((version) => (
                <div 
                  key={version.id} 
                  className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">📄</div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        Version {version.numero}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(version.dateCreation)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(version.taille)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => telechargerVersionPDF(version)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      title="Télécharger"
                    >
                      ⬇️ Télécharger
                    </button>
                    <button
                      onClick={() => supprimerVersionPDF(version.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Info versioning */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2 text-sm text-blue-900">
            <span><Lightbulb size={16} /></span>
            <div>
              <strong>Stratégie de versioning :</strong>
              <ul className="mt-2 space-y-1 ml-4">
                <li>• Seuls les PDF sont versionnés (pas les données internes)</li>
                <li>• Chaque export PDF crée automatiquement une nouvelle version</li>
                <li>• Les données du devis sont toujours à jour (dernière modification)</li>
                <li>• Permet de retrouver les anciennes versions envoyées au client</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 mb-1">Photos</div>
          <div className="text-2xl font-bold text-blue-900">{photos.length}</div>
          <div className="text-xs text-blue-600 mt-1">
            {formatFileSize(photos.reduce((acc, p) => acc + p.taille, 0))} total
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-700 mb-1">Versions PDF</div>
          <div className="text-2xl font-bold text-green-900">{versionsPDF.length}</div>
          <div className="text-xs text-green-600 mt-1">
            {versionsPDF.length > 0 
              ? `Dernière : v${versionsPDF[versionsPDF.length - 1].numero}`
              : 'Aucune version'
            }
          </div>
        </div>
      </div>
    </div>
  );
}
