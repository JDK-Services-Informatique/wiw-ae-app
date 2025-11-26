import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  Settings as SettingsIcon,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationMenu from './NavigationMenu';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function DashboardLayout({ user, onLogout }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-dark-panel border-r border-slate-200 dark:border-dark-border">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-dark-border">
        <div className="w-16 h-16 bg-brand rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-brand/20 text-2xl">W</div>
        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">WiW AE+</span>
      </div>

      {/* Menu de navigation hiérarchique */}
      <NavigationMenu onNavigate={() => setSidebarOpen(false)} />

      <div className="p-4 border-t border-slate-100 dark:border-dark-border space-y-1">
        <div className="px-4 py-2">
          <LanguageSwitcher />
        </div>
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          <span className="font-medium">{isDark ? 'Mode clair' : 'Mode sombre'}</span>
        </button>
        <button 
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <SettingsIcon size={20} />
          <span className="font-medium">Paramètres</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" onClick={onLogout}>
          <LogOut size={20} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex transition-colors duration-300">
      {/* Sidebar Desktop */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-20">
        <SidebarContent />
      </aside>

      {/* Header Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-dark-panel border-b border-slate-200 dark:border-dark-border z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-xl">W</div>
           <span className="font-bold text-lg text-slate-900 dark:text-white">WiW</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-300">
          <Menu size={24} />
        </button>
      </div>

      {/* Drawer Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 z-50 md:hidden"
            >
              <div className="relative h-full">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 p-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-300"
                >
                  <X size={20} />
                </button>
                <SidebarContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contenu Principal */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}