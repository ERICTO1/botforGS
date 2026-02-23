import React from 'react';
import { ShoppingCart, RefreshCw, Eye, Copy, MoreVertical } from 'lucide-react';

interface DesignData {
  id: string;
  title: string;
  status?: 'Signed' | 'In Progress' | 'Sent';
  image: string;
  solarSize: string;
  batterySize?: string;
  price: string;
  panelsCount?: number;
  batteryCount?: number;
  isInvisible?: boolean;
}

interface DesignCardProps {
  design: DesignData;
  isNew?: boolean;
  onOrder?: (id: string) => void;
}

const DesignCard: React.FC<DesignCardProps> = ({ design, isNew, onOrder }) => {
  if (isNew) {
    return (
      <div className="bg-white rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center h-full min-h-[320px] cursor-pointer hover:bg-gray-50 transition-colors group">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <span className="text-blue-600 font-medium">New Design</span>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Signed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Sent': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 group">
        <img src={design.image} alt={design.title} className="w-full h-full object-cover" />
        
        {/* Status Badge */}
        {design.status && (
          <div className={`absolute bottom-3 left-3 px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(design.status)}`}>
            {design.status}
          </div>
        )}

        {/* Invisible Overlay */}
        {design.isInvisible && (
          <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-3">
             <div className="bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-gray-600 flex items-center gap-1 backdrop-blur-sm">
                <Eye size={12} className="text-gray-400" />
                Invisible in Proposal
             </div>
          </div>
        )}

        {/* Top Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 bg-white/90 rounded hover:bg-white text-gray-600 shadow-sm backdrop-blur-sm">
                <Copy size={14} />
            </button>
            <button className="p-1.5 bg-white/90 rounded hover:bg-white text-gray-600 shadow-sm backdrop-blur-sm">
                <Eye size={14} />
            </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-2 mb-3">
          <div className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${design.id === '1' ? 'bg-green-500' : 'bg-gray-400'}`}>
            {design.id}
          </div>
          <h3 className="font-bold text-gray-900 text-sm leading-tight">
            {design.title}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-3 h-3 inline-block bg-gray-200 rounded-sm"></span> Design
            </p>
            <p className="font-medium text-blue-600 mt-0.5">{design.solarSize}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-3 h-3 inline-block bg-gray-200 rounded-sm"></span> Quote
            </p>
            <p className={`font-medium mt-0.5 ${design.price.startsWith('-') ? 'text-orange-500' : 'text-orange-600'}`}>
              {design.price}
            </p>
          </div>
        </div>

        {/* Icons for panels/battery */}
        <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-400 rounded-sm transform rotate-45"></div>
            </div>
            {design.batterySize && (
                <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center border border-gray-600">
                    <div className="w-2 h-3 bg-gray-400 rounded-sm"></div>
                </div>
            )}
             <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center ml-auto">
                <span className="text-xs text-gray-500">Img</span>
            </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col gap-2 w-full">
            <button 
              onClick={() => onOrder?.(design.id)}
              className="flex items-center gap-2 text-xs text-teal-600 font-medium hover:text-teal-700 w-full"
            >
              <ShoppingCart size={14} />
              Order
            </button>
            <button className="flex items-center gap-2 text-xs text-teal-600 font-medium hover:text-teal-700 w-full">
              <RefreshCw size={14} />
              Rebates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCard;
