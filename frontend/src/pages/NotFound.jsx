import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-bg text-center p-4">
      <h1 className="text-9xl font-extrabold text-brand opacity-20">404</h1>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 mb-2">Page introuvable</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        Oups ! La page que vous cherchez semble avoir été démolie ou n'a jamais été construite.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand-hover transition-all shadow-lg shadow-brand/20"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
