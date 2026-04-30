import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex w-[220px] h-full flex-col bg-surface border-r border-border shrink-0">
      <div className="p-6 border-b border-border">
        <h1 className="font-serif text-[18px]">FLOWSPACE</h1>
        <p className="text-[10px] text-text-subtle tracking-wider mt-1">by Ethara AI</p>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-6 mb-4">
          <p className="text-[10px] text-text-subtle tracking-widest uppercase">NAVIGATION</p>
        </div>
        <nav className="space-y-1">
          <NavLink 
            to="/dashboard"
            className={({ isActive }) => 
              `flex items-center w-full h-[44px] px-6 text-sm transition-colors ${
                isActive 
                  ? 'border-l-[2px] border-accent bg-accent-muted text-text-primary' 
                  : 'border-l-[2px] border-transparent text-text-muted hover:bg-raised hover:text-text-primary'
              }`
            }
          >
            <LayoutDashboard size={16} className="mr-3" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/projects"
            className={({ isActive }) => 
              `flex items-center w-full h-[44px] px-6 text-sm transition-colors ${
                isActive 
                  ? 'border-l-[2px] border-accent bg-accent-muted text-text-primary' 
                  : 'border-l-[2px] border-transparent text-text-muted hover:bg-raised hover:text-text-primary'
              }`
            }
          >
            <FolderKanban size={16} className="mr-3" />
            Projects
          </NavLink>
        </nav>
      </div>

      <div className="p-6 border-t border-border mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[11px] text-text-muted uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="text-text-muted hover:text-danger transition-colors shrink-0">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
