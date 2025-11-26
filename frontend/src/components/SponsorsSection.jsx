import React from 'react';
import { motion } from 'framer-motion';

/**
 * Composant pour afficher une section de logos de sponsors
 * @param {Array} sponsors - Liste des sponsors avec { id, nom, logo, url, description }
 * @param {String} title - Titre de la section (optionnel)
 * @param {String} className - Classes CSS supplémentaires (optionnel)
 */
export default function SponsorsSection({ 
  sponsors = [], 
  title = "Nos Partenaires",
  className = "",
  showTitle = true 
}) {
  // Filtrer uniquement les sponsors actifs
  const activeSponsors = sponsors.filter(s => s.actif !== false);

  if (activeSponsors.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas de sponsors
  }

  return (
    <section className={`py-12 bg-slate-50 dark:bg-dark-bg border-t border-slate-200 dark:border-slate-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Partenaires qui nous font confiance
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 items-center">
          {activeSponsors
            .sort((a, b) => (a.ordre || 0) - (b.ordre || 0))
            .map((sponsor, index) => (
            <motion.a
              key={sponsor.id}
              href={sponsor.url || '#'}
              target={sponsor.url ? "_blank" : undefined}
              rel={sponsor.url ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`
                flex items-center justify-center
                p-4 md:p-6
                bg-white dark:bg-dark-panel
                rounded-xl border border-slate-200 dark:border-slate-800
                hover:border-brand hover:shadow-lg hover:shadow-brand/10
                transition-all duration-300
                ${sponsor.url ? 'cursor-pointer' : 'cursor-default'}
              `}
              title={sponsor.nom || sponsor.description}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.nom || 'Logo partenaire'}
                className="max-w-full max-h-16 md:max-h-20 object-contain dark:brightness-0 dark:invert dark:opacity-90"
                onError={(e) => {
                  // En cas d'erreur de chargement, masquer l'image
                  e.target.style.display = 'none';
                }}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

