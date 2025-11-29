# 💳 Guide d'intégration des paiements

## Vue d'ensemble

Actuellement, le système de paiement dans `frontend/src/pages/Plans.jsx` est **simulé**. Pour rendre l'application commercialisable, il faut intégrer un véritable processeur de paiement.

## Options recommandées

### 1. Stripe (Recommandé)

**Avantages :**
- ✅ Très populaire et fiable
- ✅ Support excellent
- ✅ Documentation complète
- ✅ Conformité PCI-DSS incluse
- ✅ Support des abonnements récurrents
- ✅ Webhooks pour les événements

**Installation :**

```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**Configuration backend :**

```bash
cd backend
npm install stripe
```

**Variables d'environnement :**

```env
# Backend
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. PayPal

**Avantages :**
- ✅ Reconnu mondialement
- ✅ Support des paiements récurrents
- ✅ API REST simple

**Installation :**

```bash
cd backend
npm install @paypal/checkout-server-sdk
```

## Architecture recommandée

### Backend : Créer les endpoints

**`backend/src/routes/payment.routes.js`**

```javascript
import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Créer une session de paiement
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { planId, userId, billingCycle } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Plan ${planId}`,
          },
          unit_amount: getPlanPrice(planId, billingCycle) * 100, // en centimes
          recurring: billingCycle === 'monthly' 
            ? { interval: 'month' }
            : { interval: 'year' }
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/pricing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      client_reference_id: userId,
      metadata: {
        planId,
        userId
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook pour les événements Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer les événements
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Activer le plan pour l'utilisateur
      await activateUserPlan(session.metadata.userId, session.metadata.planId);
      break;
    case 'customer.subscription.deleted':
      // Désactiver le plan
      break;
    // ... autres événements
  }

  res.json({ received: true });
});

export default router;
```

### Frontend : Intégrer Stripe Elements

**`frontend/src/pages/Plans.jsx`** (modifications)

```javascript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Dans le composant Plans.jsx
const handlePaymentSubmit = async (e) => {
  e.preventDefault();
  
  const stripe = await stripePromise;
  const elements = useElements();
  
  // Créer la session de paiement
  const response = await fetch(`${API_URL}/payment/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      planId: selectedPlanForPayment,
      userId: currentUser.id,
      billingCycle: 'monthly'
    })
  });
  
  const { sessionId, url } = await response.json();
  
  // Rediriger vers Stripe Checkout
  window.location.href = url;
};
```

## Étapes d'implémentation

### Phase 1 : Configuration Stripe

1. **Créer un compte Stripe**
   - Aller sur https://stripe.com
   - Créer un compte (mode test d'abord)
   - Récupérer les clés API

2. **Configurer les produits dans Stripe Dashboard**
   - Créer 3 produits : STARTER, PREMIUM, ENTERPRISE
   - Définir les prix mensuels et annuels
   - Récupérer les `price_id` pour chaque plan

### Phase 2 : Backend

1. **Installer Stripe**
   ```bash
   cd backend
   npm install stripe
   ```

2. **Créer `backend/src/routes/payment.routes.js`**
   - Endpoint pour créer une session de paiement
   - Webhook pour gérer les événements

3. **Ajouter les routes dans `backend/src/server.js`**
   ```javascript
   import paymentRoutes from './routes/payment.routes.js';
   app.use('/api/payment', paymentRoutes);
   ```

4. **Créer la table `subscriptions` dans Prisma**
   ```prisma
   model Subscription {
     id        String   @id @default(uuid())
     userId    Int
     planId    String
     status    String   // active, canceled, past_due
     stripeSubscriptionId String? @unique
     currentPeriodStart DateTime
     currentPeriodEnd   DateTime
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     user      User     @relation(fields: [userId], references: [id])
   }
   ```

### Phase 3 : Frontend

1. **Installer Stripe React**
   ```bash
   cd frontend
   npm install @stripe/stripe-js @stripe/react-stripe-js
   ```

2. **Modifier `frontend/src/pages/Plans.jsx`**
   - Remplacer le formulaire de paiement simulé par Stripe Elements
   - Utiliser `createCheckoutSession` au lieu de la simulation

3. **Créer une page de succès/échec**
   - `/pricing?success=true` : Afficher un message de succès
   - `/pricing?canceled=true` : Afficher un message d'annulation

### Phase 4 : Webhooks

1. **Configurer le webhook dans Stripe Dashboard**
   - URL : `https://votre-backend.scallingo.app/api/payment/webhook`
   - Événements à écouter :
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

2. **Tester avec Stripe CLI**
   ```bash
   stripe listen --forward-to localhost:4000/api/payment/webhook
   ```

## Sécurité

1. **Ne jamais exposer la clé secrète Stripe côté frontend**
2. **Toujours valider les webhooks avec la signature**
3. **Utiliser HTTPS en production**
4. **Valider les montants côté backend avant traitement**

## Tests

### Mode test Stripe

Utiliser les cartes de test :
- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0025 0000 3155`

Date d'expiration : n'importe quelle date future
CVV : n'importe quel 3 chiffres

## Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Stripe React](https://stripe.com/docs/stripe-js/react)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

## Alternative : PayPal

Si vous préférez PayPal, la structure est similaire mais utilise l'API PayPal :

```javascript
import paypal from '@paypal/checkout-server-sdk';

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);
```

## Prochaines étapes

1. ✅ Choisir Stripe ou PayPal
2. ✅ Créer un compte et récupérer les clés API
3. ✅ Implémenter le backend (routes + webhooks)
4. ✅ Intégrer Stripe Elements dans le frontend
5. ✅ Tester en mode sandbox
6. ✅ Passer en production avec les clés réelles

