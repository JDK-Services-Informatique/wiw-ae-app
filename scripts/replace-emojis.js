#!/usr/bin/env node
/**
 * Script de remplacement des émojis dans WIW-AE+
 * Remplace les émojis par des icônes Lucide React ou des labels texte
 * 
 * Usage: node scripts/replace-emojis.js
 */

const fs = require('fs');
const path = require('path');

// Mapping des émojis vers les composants Lucide ou labels
const emojiReplacements = {
  // Icônes de statistiques / données
  '📊': { icon: 'BarChart3', label: 'Stats' },
  '📈': { icon: 'TrendingUp', label: 'Progression' },
  '📉': { icon: 'TrendingDown', label: 'Baisse' },
  
  // Bâtiments / Entreprises
  '🏢': { icon: 'Building2', label: 'Entreprise' },
  '🏆': { icon: 'Trophy', label: 'Certifications' },
  
  // Documents / Missions
  '📋': { icon: 'ClipboardList', label: 'Missions' },
  '📝': { icon: 'FileText', label: 'Document' },
  '📁': { icon: 'FolderOpen', label: 'Dossier' },
  '📦': { icon: 'Package', label: 'Catalogue' },
  '📐': { icon: 'Ruler', label: 'Plans' },
  
  // Argent / Honoraires
  '💰': { icon: 'Euro', label: 'Montant' },
  '💡': { icon: 'Lightbulb', label: 'Info' },
  
  // Personnes / Équipes
  '👥': { icon: 'Users', label: 'Equipe' },
  '👑': { icon: 'Crown', label: 'Enterprise' },
  '⭐': { icon: 'Star', label: 'Premium' },
  
  // Actions / Navigation
  '🔍': { icon: 'Search', label: 'Rechercher' },
  '🎯': { icon: 'Target', label: 'Objectif' },
  '⚙️': { icon: 'Settings', label: 'Parametres' },
  '⚙': { icon: 'Settings', label: 'Parametres' },
  
  // Autres
  '✨': { icon: 'Sparkles', label: 'Nouveau' },
  '⚡': { icon: 'Zap', label: 'Rapide' },
  '🔧': { icon: 'Wrench', label: 'Outils' },
  '🗓': { icon: 'Calendar', label: 'Calendrier' },
  '🎨': { icon: 'Palette', label: 'Design' },
};

// Fichiers à traiter
const targetExtensions = ['.jsx', '.js', '.tsx', '.ts'];
const excludeDirs = ['node_modules', 'dist', 'build', '.git'];

// Fonction pour trouver tous les fichiers récursivement
function findFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(item)) {
        findFiles(fullPath, files);
      }
    } else if (targetExtensions.includes(path.extname(item))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fonction pour remplacer les émojis dans un fichier
function replaceEmojisInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let replacements = [];
  
  for (const [emoji, replacement] of Object.entries(emojiReplacements)) {
    if (content.includes(emoji)) {
      // Déterminer le contexte pour choisir le bon remplacement
      const regex = new RegExp(emoji, 'g');
      
      // Remplacer par le label texte (plus sûr pour une première passe)
      const newContent = content.replace(regex, `[${replacement.label}]`);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
        replacements.push({ emoji, label: replacement.label, icon: replacement.icon });
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return { filePath, replacements };
  }
  
  return null;
}

// Fonction principale
function main() {
  const frontendSrc = path.join(__dirname, '..', 'frontend', 'src');
  
  if (!fs.existsSync(frontendSrc)) {
    console.error('Erreur: Dossier frontend/src non trouve');
    console.log('Assurez-vous d\'executer ce script depuis la racine du projet');
    process.exit(1);
  }
  
  console.log('='.repeat(60));
  console.log('WIW-AE+ - Script de remplacement des emojis');
  console.log('='.repeat(60));
  console.log('');
  
  const files = findFiles(frontendSrc);
  console.log(`Fichiers a analyser: ${files.length}`);
  console.log('');
  
  const results = [];
  
  for (const file of files) {
    const result = replaceEmojisInFile(file);
    if (result) {
      results.push(result);
    }
  }
  
  if (results.length === 0) {
    console.log('Aucun emoji trouve dans les fichiers.');
  } else {
    console.log(`Fichiers modifies: ${results.length}`);
    console.log('');
    
    for (const result of results) {
      const relativePath = path.relative(frontendSrc, result.filePath);
      console.log(`[MODIFIE] ${relativePath}`);
      for (const r of result.replacements) {
        console.log(`  ${r.emoji} -> [${r.label}] (icone recommandee: ${r.icon})`);
      }
      console.log('');
    }
    
    console.log('='.repeat(60));
    console.log('ETAPE SUIVANTE:');
    console.log('Pour une meilleure integration, remplacez les [LABEL]');
    console.log('par des composants Lucide React dans les fichiers modifies.');
    console.log('');
    console.log('Exemple:');
    console.log('  import { BarChart3 } from "lucide-react";');
    console.log('  // Puis utiliser: <BarChart3 size={16} />');
    console.log('='.repeat(60));
  }
}

// Exécution
main();
