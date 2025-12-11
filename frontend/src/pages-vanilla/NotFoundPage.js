/**
 * Page 404 vanilla JS
 */

import { Component } from '../core/component';

export class NotFoundPage extends Component {
  render() {
    return `
      <div class="not-found-page">
        <div class="not-found-content">
          <h1>404</h1>
          <h2>Page non trouvée</h2>
          <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
          <a href="/" class="btn" data-link>
            Retour à l'accueil
          </a>
        </div>
      </div>
    `;
  }
}

export default NotFoundPage;
