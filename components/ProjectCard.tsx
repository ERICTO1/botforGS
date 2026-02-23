import React from 'react';
import { MoreVertical, ShoppingCart, RefreshCw, MapPin, Clock, User } from 'lucide-react';
import { ProjectData } from '../types';

interface ProjectCardProps {
  project: ProjectData;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onOrder?: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, selected, onSelect, onOrder }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent': return 'bg-orange-100 text-orange-600';
      case 'Signed': return 'bg-green-100 text-green-600';
      case 'In Progress': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className={`bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow ${selected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200">
        <img src={project.image} alt={project.address} className="w-full h-full object-cover" />
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(project.status)}`}>
          {project.status}
        </div>

        {/* Icons top left */}
        <div className="absolute top-3 left-3 flex gap-1">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white">
            <MapPin size={14} />
          </div>
        </div>

        {/* Demo/New Tags */}
        <div className="absolute bottom-3 left-3 flex gap-1">
          {project.isDemo && (
            <span className="px-1.5 py-0.5 bg-white text-gray-700 text-xs font-bold rounded shadow-sm">DEMO</span>
          )}
          {project.isNew && (
            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded shadow-sm">NEW</span>
          )}
        </div>
        
        {/* Checkbox */}
        <div 
          className="absolute top-3 right-16 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(project.id);
          }}
        >
          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
            {selected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm mb-4 line-clamp-2 h-10">
          {project.address}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{project.user || '-'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{project.date}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex gap-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onOrder?.(project.id);
              }}
              className="flex items-center gap-1 text-xs text-teal-600 font-medium hover:text-teal-700"
            >
              <ShoppingCart size={14} />
              Order
            </button>
            <button className="flex items-center gap-1 text-xs text-teal-600 font-medium hover:text-teal-700">
              <RefreshCw size={14} />
              Rebates
            </button>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
