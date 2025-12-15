# WIW - version HTML5/CSS/JS

Cette version du projet WIW est entièrement servie en HTML5, CSS et JavaScript vanilla. Un petit serveur Node.js (sans dépendances externes) diffuse les pages statiques et expose un point d'entrée pour stocker les messages de contact dans un fichier JSON.

## 📦 Structure
- `static/` : pages autonomes (`index.html`, `pricing.html`, `contact.html`), mode hors ligne (`offline.html`), service worker (`sw.js`), styles (`styles.css`) et interactions (`app.js`).
- `server.js` : serveur HTTP Node.js qui sert le répertoire `static/` et gère `/api/contact`.
- `data/messages.json` : stockage plat des soumissions de formulaire.
- `package.json` : scripts NPM minimalistes pour lancer le serveur.

## 🚀 Démarrage
1. Installez Node.js (>= 18).
2. Depuis la racine du projet, lancez :
   ```bash
   npm start
   ```
3. Ouvrez http://localhost:3000 pour naviguer sur les pages HTML5/CSS/JS (un service worker met en cache les pages principales pour le mode hors ligne).

### Mode hors ligne
- Les pages clés sont pré-cachées (`index.html`, `pricing.html`, `contact.html`, `offline.html`, CSS/JS) via `static/sw.js`.
- Les formulaires de contact sont validés côté client et mis en attente dans `localStorage` si le réseau est indisponible ; la synchronisation est relancée automatiquement dès le retour en ligne.

## 🔌 API de contact
- **POST `/api/contact`** : envoie un JSON `{ email, subject, message }` et enregistre la demande dans `data/messages.json`.
- **GET `/api/contact`** : retourne les messages reçus (pratique pour vérifier localement).

Cette base peut être étendue ou déployée telle quelle pour une stack 100% HTML5/CSS/JS.
