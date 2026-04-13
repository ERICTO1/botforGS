import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  ShoppingCart, 
  Users, 
  Settings, 
  Handshake, 
  MonitorPlay, 
  HelpCircle, 
  Newspaper, 
  FileText, 
  MoreVertical,
  LogOut,
  Bot
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'Projects', onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-full bg-white border-r border-gray-200 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out`}>
      {/* Logo */}
      <div 
        className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} cursor-pointer hover:bg-gray-50 transition-colors`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        title="Toggle Sidebar"
      >
        <span className="text-2xl font-bold text-blue-600 tracking-tight">
          {isCollapsed ? 'G' : 'GreenSketch'}
        </span>
      </div>

      {/* Main Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} space-y-1`}>
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => onTabChange?.('Dashboard')} isCollapsed={isCollapsed} />
        <NavItem icon={<FolderOpen size={20} />} label="Projects" active={activeTab === 'Projects'} onClick={() => onTabChange?.('Projects')} isCollapsed={isCollapsed} />
        <NavItem icon={<Bot size={20} />} label="Sale Bot" active={activeTab === 'Sale Bot'} onClick={() => onTabChange?.('Sale Bot')} isCollapsed={isCollapsed} />
        <NavItem icon={<ShoppingCart size={20} />} label="Purchase" isCollapsed={isCollapsed} />
        <NavItem icon={<Users size={20} />} label="Members" isCollapsed={isCollapsed} />
        <NavItem icon={<Settings size={20} />} label="Settings" isCollapsed={isCollapsed} />
        <NavItem icon={<Handshake size={20} />} label="Partners" isCollapsed={isCollapsed} />
      </nav>

      {/* Bottom Navigation */}
      <div className={`${isCollapsed ? 'px-2' : 'px-4'} py-4 space-y-1 border-t border-gray-100`}>
        <NavItem icon={<MonitorPlay size={16} />} label="Tutorials" small isCollapsed={isCollapsed} />
        <NavItem icon={<HelpCircle size={16} />} label="Help Center" small isCollapsed={isCollapsed} />
        <NavItem icon={<Newspaper size={16} />} label="News" small isCollapsed={isCollapsed} />
        <NavItem icon={<FileText size={16} />} label="Release Notes" small isCollapsed={isCollapsed} />
      </div>

      {/* User Profile */}
      <div className={`p-4 border-t border-gray-200 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3 w-full'}`}>
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0 cursor-pointer" title={isCollapsed ? "eric to" : ""}>
            <Users size={20} />
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">eric to</p>
                <p className="text-xs text-gray-500 truncate">ericto1@163.com</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 shrink-0">
                <MoreVertical size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  small?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, small, onClick, isCollapsed }) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      title={isCollapsed ? label : ""}
      className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-md transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      } ${small ? 'text-sm' : 'text-base'}`}
    >
      <span className={active ? 'text-blue-600' : 'text-gray-400'}>{icon}</span>
      {!isCollapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
    </a>
  );
};

export default Sidebar;
