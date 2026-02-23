import React from 'react';
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
  LogOut
} from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-2">
        <span className="text-2xl font-bold text-blue-600 tracking-tight">GreenSketch</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem icon={<FolderOpen size={20} />} label="Projects" active />
        <NavItem icon={<ShoppingCart size={20} />} label="Purchase" />
        <NavItem icon={<Users size={20} />} label="Members" />
        <NavItem icon={<Settings size={20} />} label="Settings" />
        <NavItem icon={<Handshake size={20} />} label="Partners" />
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 space-y-1 border-t border-gray-100">
        <NavItem icon={<MonitorPlay size={16} />} label="Tutorials" small />
        <NavItem icon={<HelpCircle size={16} />} label="Help Center" small />
        <NavItem icon={<Newspaper size={16} />} label="News" small />
        <NavItem icon={<FileText size={16} />} label="Release Notes" small />
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <Users size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">eric to</p>
            <p className="text-xs text-gray-500 truncate">ericto1@163.com</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={16} />
          </button>
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
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, small }) => {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      } ${small ? 'text-sm' : 'text-base'}`}
    >
      <span className={active ? 'text-blue-600' : 'text-gray-400'}>{icon}</span>
      <span className="font-medium">{label}</span>
    </a>
  );
};

export default Sidebar;
