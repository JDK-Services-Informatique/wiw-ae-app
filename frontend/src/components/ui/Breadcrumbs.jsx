import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Composant Breadcrumbs pour la navigation hiérarchique
 */
export default function Breadcrumbs({ 
  items = [],
  separator = <ChevronRight size={16} className="text-slate-400" />,
  className = ''
}) {
  const location = useLocation();

  // Générer automatiquement les breadcrumbs depuis l'URL si items n'est pas fourni
  const autoItems = React.useMemo(() => {
    if (items.length > 0) return items;
    
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Accueil', href: '/dashboard', icon: Home }];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({
        label,
        href: currentPath,
        isLast: index === paths.length - 1
      });
    });
    
    return breadcrumbs;
  }, [location.pathname, items]);

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {autoItems.map((item, index) => {
          const isLast = index === autoItems.length - 1 || item.isLast;
          const Icon = item.icon;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2" aria-hidden="true">
                  {separator}
                </span>
              )}
              {isLast ? (
                <span className="flex items-center text-slate-500 dark:text-slate-400 font-medium">
                  {Icon && <Icon size={16} className="mr-1" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="flex items-center text-slate-600 dark:text-slate-300 hover:text-brand transition-colors"
                >
                  {Icon && <Icon size={16} className="mr-1" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

