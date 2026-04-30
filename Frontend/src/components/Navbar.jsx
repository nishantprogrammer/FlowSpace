import { useTheme } from '../hooks/useTheme.js';
import { useAuth } from '../hooks/useAuth.js';
import { Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  
  const getBreadcrumb = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return '';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-[52px] border-b border-border bg-surface flex items-center justify-between px-6 shrink-0">
      <div className="md:hidden font-serif tracking-widest text-[13px]">
        FLOWSPACE
      </div>
      <div className="hidden md:block text-sm text-text-muted">
        {getBreadcrumb()}
      </div>
      
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="text-text-muted hover:text-text-primary transition-colors">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-sm font-medium">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
