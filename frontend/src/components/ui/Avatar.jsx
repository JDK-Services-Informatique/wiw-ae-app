import React from 'react';
import { User } from 'lucide-react';

/**
 * Composant Avatar pour afficher des avatars utilisateurs
 */
export default function Avatar({
  src,
  alt,
  name,
  size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl'
  status, // 'online', 'offline', 'away', 'busy'
  className = '',
  onClick
}) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-slate-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  // Générer les initiales depuis le nom
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Générer une couleur depuis le nom (pour les avatars sans image)
  const getColorFromName = (name) => {
    if (!name) return 'bg-slate-400';
    const colors = [
      'bg-purple-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700 ${
          onClick ? 'cursor-pointer hover:ring-2 hover:ring-brand transition-all' : ''
        }`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback si l'image ne charge pas
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`${src ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-white font-semibold ${getColorFromName(name)}`}
        >
          {name ? getInitials(name) : <User size={size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 32} />}
        </div>
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status] || statusColors.offline} rounded-full border-2 border-white dark:border-slate-800`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

