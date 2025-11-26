import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Info } from 'lucide-react';

/**
 * Composant StatusBadge pour afficher des statuts avec couleurs et icônes
 */
export default function StatusBadge({
  status,
  variant, // 'success', 'error', 'warning', 'info', 'default'
  size = 'md', // 'sm', 'md', 'lg'
  showIcon = true,
  className = ''
}) {
  // Déterminer la variante depuis le status si non fournie
  const getVariantFromStatus = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (['actif', 'en cours', 'gagné', 'validé', 'terminé', 'success'].includes(statusLower)) {
      return 'success';
    }
    if (['inactif', 'perdu', 'refusé', 'annulé', 'error', 'erreur'].includes(statusLower)) {
      return 'error';
    }
    if (['en attente', 'brouillon', 'pending', 'warning'].includes(statusLower)) {
      return 'warning';
    }
    if (['nouveau', 'info', 'information'].includes(statusLower)) {
      return 'info';
    }
    return variant || 'default';
  };

  const finalVariant = variant || getVariantFromStatus(status);

  const variants = {
    success: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
      icon: XCircle
    },
    warning: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: AlertCircle
    },
    info: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      icon: Info
    },
    default: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-200 dark:border-slate-700',
      icon: Clock
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  const style = variants[finalVariant] || variants.default;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      {status}
    </span>
  );
}

