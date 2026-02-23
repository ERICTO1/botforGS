import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  MapPin, 
  Home, 
  User, 
  Mail, 
  Phone, 
  Pencil, 
  ChevronDown,
  FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DesignCard from './DesignCard';
import ActivityTimeline from './ActivityTimeline';
import { ProjectData } from '../types';

interface ProjectDetailProps {
  project: ProjectData;
  onBack: () => void;
  onOrder?: (id: string) => void;
}

const mockChartData = [
  { name: 'Jan', value: 200 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 250 },
  { name: 'Apr', value: 280 },
  { name: 'May', value: 220 },
  { name: 'Jun', value: 350 },
  { name: 'Jul', value: 400 },
  { name: 'Aug', value: 380 },
  { name: 'Sept', value: 320 },
  { name: 'Oct', value: 290 },
  { name: 'Nov', value: 310 },
  { name: 'Dec', value: 360 },
];

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onOrder }) => {
  const [activeTab, setActiveTab] = useState('Designs');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Left Sidebar - Project Info */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <span className="text-xl font-bold text-blue-600 tracking-tight">GreenSketch</span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Map Thumbnail */}
        <div className="relative h-48 bg-gray-200 mx-4 rounded-lg overflow-hidden mb-4">
            <img src={project.image} alt="Map" className="w-full h-full object-cover" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
                    <Home size={16} />
                </div>
            </div>
        </div>

        {/* Project Type Badge */}
        <div className="px-4 mb-2">
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                <Home size={12} />
                New System Design
            </div>
        </div>

        {/* Address */}
        <div className="px-4 mb-6">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
                {project.address.split(',')[0]}<br />
                {project.address.split(',').slice(1).join(',')}
            </h1>
        </div>

        <div className="border-t border-gray-100 my-2"></div>

        {/* Customer Info */}
        <div className="px-4 py-4 relative group">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil size={14} />
            </button>
            <h3 className="font-bold text-gray-900 mb-3">{project.user || 'John Doe'}</h3>
            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span>user@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <span>+61 400 000 000</span>
                </div>
            </div>
        </div>

        <div className="border-t border-gray-100 my-2"></div>

        {/* Energy Plan & Tariffs */}
        <div className="px-4 py-4 relative group">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Energy Plan & Tariffs</h3>
                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil size={14} />
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Annual Usage</p>
                    <p className="font-bold text-gray-900">4,600<span className="text-xs font-normal text-gray-500">kWh</span></p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Electricity Rate</p>
                    <p className="font-bold text-gray-900">$0.42<span className="text-xs font-normal text-gray-500">/kWh</span></p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Daily Supply Charge</p>
                    <p className="font-bold text-gray-900">$0<span className="text-xs font-normal text-gray-500">/Day</span></p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Feed-in Tariff</p>
                    <p className="font-bold text-gray-900">$0.08<span className="text-xs font-normal text-gray-500">/kWh</span></p>
                </div>
            </div>

            {/* Chart */}
            <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockChartData}>
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fill: '#9CA3AF'}} 
                            interval={1} // Show every 2nd label if needed, or 0 for all
                        />
                        <Tooltip 
                            contentStyle={{ fontSize: '12px', padding: '4px 8px' }}
                            cursor={{fill: 'transparent'}}
                        />
                        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                            {mockChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index >= 6 && index <= 8 ? '#2DD4BF' : '#E5E7EB'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header / Tabs */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('Designs')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'Designs' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Pencil size={16} />
                    Designs <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">2</span>
                </button>
                <button 
                    onClick={() => setActiveTab('Documents')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'Documents' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FileText size={16} />
                    Documents
                </button>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative group">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-l-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        View Proposal
                        <div className="w-px h-4 bg-green-400 mx-1"></div>
                        <ChevronDown size={16} />
                    </button>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <DesignCard 
                    design={{
                        id: '1',
                        title: '9.68kW Solar + 10kWh Battery',
                        status: 'Signed',
                        image: project.image,
                        solarSize: '9.68kW Solar',
                        price: '$18,912.21',
                        batterySize: '10kWh'
                    }} 
                    onOrder={() => onOrder?.(project.id)}
                />
                <DesignCard 
                    design={{
                        id: '2',
                        title: '21.25kW Solar + 51.2kWh Battery',
                        status: 'In Progress',
                        image: project.image,
                        solarSize: '21.25kW Solar',
                        price: '-$21,261.41',
                        batterySize: '51.2kWh',
                        isInvisible: true
                    }} 
                    onOrder={() => onOrder?.(project.id)}
                />
                <DesignCard design={{ id: 'new', title: '', image: '', solarSize: '', price: '' }} isNew />
            </div>
        </div>
      </div>

      {/* Right Sidebar - Activities */}
      <ActivityTimeline />
    </div>
  );
};

export default ProjectDetail;
