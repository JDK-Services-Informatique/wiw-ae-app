import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { ClipboardList } from 'lucide-react';

// Composant Lettre d'Envoi pour Devis
// Génère une lettre recommandée professionnelle à joindre au devis
export default function LettreEnvoi({ 
  devis,
  onGenererPDF 
}) {
  const [formData, setFormData] = useState({
    expediteur: {
      nom: localStorage.getItem('wiw-entreprise-nom') || '',
      adresse: localStorage.getItem('wiw-entreprise-adresse') || '',
      codePostal: localStorage.getItem('wiw-entreprise-cp') || '',
      ville: localStorage.getItem('wiw-entreprise-ville') || '',
      telephone: localStorage.getItem('wiw-entreprise-tel') || '',
      email: localStorage.getItem('wiw-entreprise-email') || ''
    },
    destinataire: {
      nom: devis?.client?.nom || '',
      adresse: devis?.client?.adresse || '',
      codePostal: devis?.client?.codePostal || '',
      ville: devis?.client?.ville || ''
    },
    objet: `Transmission de notre devis n°${devis?.numero || 'XXXXX'}`,
    corps: `Madame, Monsieur,

Suite à votre demande, nous avons le plaisir de vous transmettre ci-joint notre devis n°${devis?.numero || 'XXXXX'} relatif à votre projet.

Ce devis détaille l'ensemble des prestations que nous vous proposons, conformément aux éléments que vous nous avez communiqués.

Nous restons à votre entière disposition pour tout complément d'information ou toute précision que vous jugeriez utile.

Dans l'attente de votre retour, nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.`,
    signature: localStorage.getItem('wiw-entreprise-signature') || 'Le Responsable',
    mentionsLegales: `Ce devis est valable 30 jours à compter de sa date d'émission.
Tout retard de paiement entraînera l'application de pénalités de retard.
En cas de litige, seul le tribunal de [Ville] sera compétent.`
  });

  // Mettre à jour les données
  const handleChange = (section, champ, valeur) => {
    if (section === 'root') {
      setFormData({ ...formData, [champ]: valeur });
    } else {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [champ]: valeur }
      });
    }
  };

  // Sauvegarder les infos entreprise
  const sauvegarderInfosEntreprise = () => {
    localStorage.setItem('wiw-entreprise-nom', formData.expediteur.nom);
    localStorage.setItem('wiw-entreprise-adresse', formData.expediteur.adresse);
    localStorage.setItem('wiw-entreprise-cp', formData.expediteur.codePostal);
    localStorage.setItem('wiw-entreprise-ville', formData.expediteur.ville);
    localStorage.setItem('wiw-entreprise-tel', formData.expediteur.telephone);
    localStorage.setItem('wiw-entreprise-email', formData.expediteur.email);
    localStorage.setItem('wiw-entreprise-signature', formData.signature);
    
    if (window.showToast) {
      window.showToast('✅ Informations entreprise sauvegardées', 'success');
    }
  };

  // Générer le PDF de la lettre
  const genererPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = margin;

    // En-tête expéditeur (coin supérieur gauche)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.expediteur.nom, margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(formData.expediteur.adresse, margin, y);
    y += 5;
    doc.text(`${formData.expediteur.codePostal} ${formData.expediteur.ville}`, margin, y);
    y += 5;
    doc.text(`Tél : ${formData.expediteur.telephone}`, margin, y);
    y += 5;
    doc.text(`Email : ${formData.expediteur.email}`, margin, y);

    // Destinataire (coin supérieur droit, aligné avec expéditeur)
    const destX = pageWidth / 2 + 10;
    let destY = margin;
    doc.setFont('helvetica', 'bold');
    doc.text('À l\'attention de :', destX, destY);
    destY += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(formData.destinataire.nom, destX, destY);
    destY += 5;
    doc.text(formData.destinataire.adresse, destX, destY);
    destY += 5;
    doc.text(`${formData.destinataire.codePostal} ${formData.destinataire.ville}`, destX, destY);

    // Date et lieu (aligné à droite)
    y = Math.max(y, destY) + 15;
    const dateStr = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const lieuDate = `${formData.expediteur.ville}, le ${dateStr}`;
    doc.text(lieuDate, pageWidth - margin, y, { align: 'right' });

    // Objet (en gras)
    y += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('Objet : ' + formData.objet, margin, y);

    // Corps de la lettre
    y += 15;
    doc.setFont('helvetica', 'normal');
    const lignesCorps = doc.splitTextToSize(formData.corps, pageWidth - 2 * margin);
    doc.text(lignesCorps, margin, y);
    y += lignesCorps.length * 5 + 10;

    // Signature
    if (y > pageHeight - 60) {
      doc.addPage();
      y = margin;
    }
    doc.setFont('helvetica', 'italic');
    doc.text(formData.signature, margin, y);

    // Mentions légales (bas de page, petite taille)
    y = pageHeight - 40;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    const lignesMentions = doc.splitTextToSize(formData.mentionsLegales, pageWidth - 2 * margin);
    doc.text(lignesMentions, margin, y);

    // Télécharger
    doc.save(`Lettre_Devis_${devis?.numero || 'XXXXX'}_${new Date().toISOString().slice(0, 10)}.pdf`);

    if (window.showToast) {
      window.showToast('✅ Lettre d\'envoi générée', 'success');
    }

    if (onGenererPDF) {
      onGenererPDF(doc.output('blob'));
    }
  };

  // Envoyer par email (simulation)
  const envoyerParEmail = () => {
    const subject = encodeURIComponent(formData.objet);
    const body = encodeURIComponent(formData.corps);
    const mailtoLink = `mailto:${formData.destinataire.email || devis?.client?.email}?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          ✉️ Lettre d'Envoi
        </h2>
        <div className="flex gap-2">
          <button
            onClick={sauvegarderInfosEntreprise}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            💾 Sauvegarder infos
          </button>
          <button
            onClick={genererPDF}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            📄 Générer PDF
          </button>
          <button
            onClick={envoyerParEmail}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            📧 Envoyer Email
          </button>
        </div>
      </div>

      {/* Aperçu lettre style papier */}
      <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-12 max-w-4xl mx-auto">
        {/* Expéditeur */}
        <div className="mb-8">
          <div className="font-bold text-sm mb-2">Expéditeur</div>
          <div className="space-y-2">
            <input
              type="text"
              value={formData.expediteur.nom}
              onChange={(e) => handleChange('expediteur', 'nom', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Nom de l'entreprise"
            />
            <input
              type="text"
              value={formData.expediteur.adresse}
              onChange={(e) => handleChange('expediteur', 'adresse', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Adresse"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={formData.expediteur.codePostal}
                onChange={(e) => handleChange('expediteur', 'codePostal', e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
                placeholder="CP"
              />
              <input
                type="text"
                value={formData.expediteur.ville}
                onChange={(e) => handleChange('expediteur', 'ville', e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
                placeholder="Ville"
              />
            </div>
            <input
              type="tel"
              value={formData.expediteur.telephone}
              onChange={(e) => handleChange('expediteur', 'telephone', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Téléphone"
            />
            <input
              type="email"
              value={formData.expediteur.email}
              onChange={(e) => handleChange('expediteur', 'email', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Email"
            />
          </div>
        </div>

        {/* Destinataire */}
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <div className="font-bold text-sm mb-2">À l'attention de :</div>
          <div className="space-y-2">
            <input
              type="text"
              value={formData.destinataire.nom}
              onChange={(e) => handleChange('destinataire', 'nom', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Nom du destinataire"
            />
            <input
              type="text"
              value={formData.destinataire.adresse}
              onChange={(e) => handleChange('destinataire', 'adresse', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              placeholder="Adresse"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={formData.destinataire.codePostal}
                onChange={(e) => handleChange('destinataire', 'codePostal', e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
                placeholder="CP"
              />
              <input
                type="text"
                value={formData.destinataire.ville}
                onChange={(e) => handleChange('destinataire', 'ville', e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
                placeholder="Ville"
              />
            </div>
          </div>
        </div>

        {/* Date et lieu */}
        <div className="text-right text-sm text-gray-600 mb-8">
          {formData.expediteur.ville}, le {new Date().toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>

        {/* Objet */}
        <div className="mb-6">
          <div className="font-bold text-sm mb-2">Objet :</div>
          <input
            type="text"
            value={formData.objet}
            onChange={(e) => handleChange('root', 'objet', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Objet de la lettre"
          />
        </div>

        {/* Corps */}
        <div className="mb-8">
          <div className="font-bold text-sm mb-2">Corps de la lettre :</div>
          <textarea
            value={formData.corps}
            onChange={(e) => handleChange('root', 'corps', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows="12"
            placeholder="Contenu de la lettre..."
          />
        </div>

        {/* Signature */}
        <div className="mb-8">
          <div className="font-bold text-sm mb-2">Signature :</div>
          <input
            type="text"
            value={formData.signature}
            onChange={(e) => handleChange('root', 'signature', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg italic"
            placeholder="Nom et fonction du signataire"
          />
        </div>

        {/* Mentions légales */}
        <div className="border-t pt-4">
          <div className="font-bold text-sm mb-2">Mentions légales :</div>
          <textarea
            value={formData.mentionsLegales}
            onChange={(e) => handleChange('root', 'mentionsLegales', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-xs"
            rows="3"
            placeholder="Mentions légales (bas de page)..."
          />
        </div>
      </div>

      {/* Modèles prédéfinis */}
      <div className="border rounded-lg p-4 bg-blue-50">
        <h3 className="font-semibold text-blue-900 mb-3"><ClipboardList size={16} /> Modèles de texte</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleChange('root', 'corps', `Madame, Monsieur,

Suite à notre entretien, nous avons le plaisir de vous transmettre ci-joint notre proposition commerciale n°${devis?.numero || 'XXXXX'}.

Cette offre a été élaborée en tenant compte de l'ensemble de vos besoins exprimés lors de nos échanges.

Nous restons à votre disposition pour toute information complémentaire et pour convenir d'un rendez-vous afin d'affiner notre proposition.

Dans l'attente de votre retour, nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.`)}
            className="w-full px-4 py-2 bg-white border rounded-lg text-left hover:bg-blue-100 text-sm"
          >
            <strong>Modèle 1 :</strong> Lettre après entretien
          </button>
          
          <button
            onClick={() => handleChange('root', 'corps', `Madame, Monsieur,

Nous faisons suite à votre demande de devis et avons le plaisir de vous transmettre ci-joint notre proposition n°${devis?.numero || 'XXXXX'}.

Vous trouverez dans ce document le détail des prestations proposées ainsi que les conditions tarifaires associées.

N'hésitez pas à nous contacter pour tout complément d'information. Nous serions ravis de pouvoir collaborer avec vous sur ce projet.

Cordialement,`)}
            className="w-full px-4 py-2 bg-white border rounded-lg text-left hover:bg-blue-100 text-sm"
          >
            <strong>Modèle 2 :</strong> Lettre courte
          </button>
        </div>
      </div>
    </div>
  );
}
