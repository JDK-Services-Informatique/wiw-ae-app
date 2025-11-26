import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Settings,
  Database,
  FileText,
  Calculator,
  BarChart3,
  Calendar,
  Search,
  Image,
  Mail,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/auth.api.js';

/**
 * Menu de navigation hiérarchique selon le plan d'amélioration
 * Niveau 1 : Menus principaux
 * Niveau 2 : Sous-menus contextuels
 */
export default function NavigationMenu({ onNavigate }) {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    dashboard: false,
    missions: false,
    bet: false,
    clients: false,
    devis: false,
    analytics: false,
    prospection: false,
    medialibrary: false,
    catalogue: false,
    templates: false,
    donnees: false,
    parametres: false,
    plans: false,
    legal: false
  });

  // Récupérer les informations de l'utilisateur pour les contrôles d'accès
  const user = authService.getCurrentUser();
  const isAdmin = authService.isAdmin();
  const isAssistant = authService.isAssistant();
  const isChefProjet = authService.isChefProjet();

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  // Structure hiérarchique - 4 niveaux selon les spécifications du plan
  const menuStructure = {
    dashboard: {
      icon: LayoutDashboard,
      label: 'Tableau de Bord',
      path: '/dashboard',
      submenus: [
        { label: 'Vue globale', path: '/dashboard' },
        { label: 'Pipe AO', path: '/pipeline' },
        { label: 'CA prévisionnel', path: '/analytics?view=ca' },
        { label: 'Alertes', path: '/alertes' }
      ]
    },
    bet: {
      icon: Users,
      label: 'BET & Architectes',
      path: '/bet',
      submenus: [
        { label: 'Contacts', path: '/bet?view=contacts' },
        { label: 'Équipe interne', path: '/team' },
        { label: 'Compétences', path: '/bet?view=competences' },
        { label: 'Historique collaborations', path: '/bet?view=historique' }
      ]
    },
    clients: {
      icon: Building2,
      label: 'Clients / Maître d\'Ouvrage',
      path: '/company',
      submenus: [
        { label: 'Fiches clients', path: '/company' },
        { label: 'Projets', path: '/company?view=projets' },
        { label: 'Références', path: '/references' }
      ]
    },
    appelsOffres: {
      icon: ClipboardList,
      label: 'Appels d\'Offres',
      path: '/tenders',
      submenus: [
        { label: 'AO actifs', path: '/tenders' },
        { label: 'AO archivés', path: '/tenders?view=archives' },
        { label: 'Calendrier prospection', path: '/calendar' }
      ]
    }
  };

  // Menu secondaire (actions contextuelles) - supprimé selon le nouveau plan simplifié
  // Les actions contextuelles seront dans les pages elles-mêmes

  // Menu admin simplifié selon le nouveau plan

  const isActive = (path) => {
    if (path.includes('?')) {
      const [basePath] = path.split('?');
      return location.pathname === basePath;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSubmenuActive = (submenus) => {
    return submenus.some(sub => isActive(sub.path));
  };

  return (
    <nav className="flex-1 px-4 py-6 space-y-8">
      {/* Niveau 1 : Menus principaux (4 menus seulement selon le plan) */}
      <div className="space-y-2">
        {Object.entries(menuStructure).map(([key, menu]) => {
          const MenuIcon = menu.icon;
          const hasSubmenus = menu.submenus && menu.submenus.length > 0;
          const isExpanded = expandedMenus[key];
          const active = isActive(menu.path) || isSubmenuActive(menu.submenus);

          return (
          <div key={key} className="space-y-1">
            <Link
              to={menu.path}
              onClick={() => hasSubmenus && toggleMenu(key)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand'
              }`}
            >
              <div className="flex items-center gap-3">
                <MenuIcon 
                  size={20} 
                  className={active ? 'text-white' : 'text-slate-400 group-hover:text-brand'} 
                />
                <span className="font-medium">{menu.label}</span>
              </div>
              {hasSubmenus && (
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isExpanded ? (
                    <ChevronDown size={16} className={active ? 'text-white' : 'text-slate-400'} />
                  ) : (
                    <ChevronRight size={16} className={active ? 'text-white' : 'text-slate-400'} />
                  )}
                </motion.div>
              )}
            </Link>

            {/* Niveau 2 : Sous-menus */}
            <AnimatePresence>
              {hasSubmenus && isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1 mt-1">
                    {menu.submenus.map((submenu, index) => (
                      <Link
                        key={index}
                        to={submenu.path}
                        className={`block px-4 py-2 rounded-lg text-sm transition-all ${
                          isActive(submenu.path)
                            ? 'bg-brand/10 text-brand font-medium'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        {submenu.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Niveau 4 : Paramètres & Admin (Menu utilisateur) */}
      {isAdmin && (
        <>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="px-4 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Administration
            </div>
            <div className="space-y-1">
              <Link
                to="/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/settings')
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Settings size={20} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                <span className="font-medium">Paramètres</span>
              </Link>

              <Link
                to="/datamanagement"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive('/datamanagement')
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Database size={20} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                <span className="font-medium">Données</span>
              </Link>
            </div>
          </div>
        </>
      )}
      </div>
    </nav>
  );
};
