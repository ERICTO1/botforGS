import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  Filter, 
  LayoutGrid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import Sidebar from './Sidebar';
import ProjectCard from './ProjectCard';
import { ProjectData } from '../types';

interface DashboardProps {
  onOpenBot: () => void;
  onProjectClick: (project: ProjectData) => void;
  onOrder: (selectedIds: string[]) => void;
}

const mockProjects: ProjectData[] = [
  {
    id: '1',
    address: '123 Mock Street, Solar City, SC 12345, Australia',
    status: 'Sent',
    date: '08 Dec 2025',
    image: 'https://picsum.photos/seed/map1/400/300',
    user: '-'
  },
  {
    id: '2',
    address: '456 Example Avenue, Test Town, TT 67890, Australia',
    status: 'Signed',
    date: '10 Feb 2026',
    image: 'https://picsum.photos/seed/map2/400/300',
    user: 'John Doe'
  },
  {
    id: '3',
    address: '789 Sample Road, Demo District, DD 11223, Australia',
    status: 'In Progress',
    date: '01 Dec 2025',
    image: 'https://picsum.photos/seed/map3/400/300',
    isDemo: true,
    user: '-'
  },
  {
    id: '4',
    address: '789 Sample Road, Demo District, DD 11223, Australia',
    status: 'Sent',
    date: '01 Dec 2025',
    image: 'https://picsum.photos/seed/map4/400/300',
    isDemo: true,
    isNew: true,
    user: '-'
  }
];

const Dashboard: React.FC<DashboardProps> = ({ onOpenBot, onProjectClick, onOrder }) => {
  const [activeTab, setActiveTab] = useState('All Projects');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  const toggleProject = (id: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProjects(newSelected);
  };

  const toggleAll = () => {
    if (selectedProjects.size === mockProjects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(mockProjects.map(p => p.id)));
    }
  };

  const tabs = [
    { label: 'All Projects', count: 4 },
    { label: 'In Progress', count: 1 },
    { label: 'Sent', count: 2 },
    { label: 'Signed', count: 1 },
    { label: 'Ordered', count: 0 },
    { label: 'Closed', count: 0 },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative w-96">
              <input 
                type="text" 
                placeholder="Search Client/Address" 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <div className="absolute right-3 top-2.5 flex items-center gap-1 text-gray-400 text-xs">
                <span>Client/Address</span>
                <ChevronDown size={14} />
              </div>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <Plus size={18} />
              Project
              <div className="border-l border-blue-500 pl-2 ml-1">
                <ChevronDown size={16} />
              </div>
            </button>
          </div>
        </header>

        {/* Filters & Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between flex-shrink-0 overflow-x-auto">
          <div className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.label 
                    ? 'text-gray-900 bg-gray-100' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label === 'All Projects' && <FolderOpen size={16} />}
                {tab.label === 'In Progress' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                {tab.label === 'Sent' && <div className="w-0 h-0 border-l-[5px] border-l-transparent border-t-[6px] border-t-orange-500 border-r-[5px] border-r-transparent transform rotate-[-90deg]" />}
                {tab.label === 'Signed' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                {tab.label}
                <span className="bg-gray-200 text-gray-600 py-0.5 px-1.5 rounded text-xs">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-gray-200 ml-4">
            <button className="flex items-center gap-1 text-gray-600 text-sm font-medium hover:text-gray-900">
              <Filter size={16} />
              All Types
            </button>
            <button className="flex items-center gap-1 text-gray-600 text-sm font-medium hover:text-gray-900">
              <Filter size={16} />
              Create By
            </button>
            <button className="flex items-center gap-1 text-gray-600 text-sm font-medium hover:text-gray-900">
              <Filter size={16} />
              Sort by
            </button>
            <div className="flex bg-gray-100 rounded p-1">
              <button className="p-1 bg-white rounded shadow-sm text-gray-900"><List size={16} /></button>
              <button className="p-1 text-gray-500 hover:text-gray-900"><LayoutGrid size={16} /></button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <div className="flex items-center gap-2 mb-4">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={selectedProjects.size === mockProjects.length && mockProjects.length > 0}
              onChange={toggleAll}
            />
            <span className="text-sm text-gray-700 font-medium">Select All</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProjects.map(project => (
              <div key={project.id} onClick={() => onProjectClick(project)} className="cursor-pointer">
                <ProjectCard 
                  project={project} 
                  selected={selectedProjects.has(project.id)}
                  onSelect={toggleProject}
                  onOrder={(id) => onOrder([id])}
                />
              </div>
            ))}
          </div>
          
          {/* Floating Action Bar for Selection */}
          {selectedProjects.size > 0 && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white shadow-2xl border border-gray-100 rounded-full px-8 py-3 flex items-center gap-8 z-50 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {selectedProjects.size}
                </div>
                <span className="font-medium text-gray-900">Items Selected</span>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <button 
                onClick={() => onOrder(Array.from(selectedProjects))}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium shadow-sm transition-all hover:shadow-md flex items-center gap-2"
              >
                Order
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer / Pagination */}
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-end flex-shrink-0">
          <div className="flex items-center gap-2">
            <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronLeft size={18} /></button>
            <button className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 font-medium rounded">1</button>
            <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronRight size={18} /></button>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-gray-600">25 / page</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
      </main>

      {/* FAB - Bot Trigger */}
      <button 
        onClick={onOpenBot}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-40 group"
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Simple G logo representation */}
            <span className="font-bold text-xl italic">G</span>
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-blue-600"></div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Open Sale Admin Bot
        </div>
      </button>
    </div>
  );
};

export default Dashboard;
