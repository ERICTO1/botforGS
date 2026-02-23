
import React, { useState } from 'react';
import { CustomerInfo, LineItem, OrderEntry, MatchOption, ProjectData } from './types';
import ChatInterface from './components/ChatInterface';
import { recalculateItemStatus, createAccessoryLineItem, getInventoryItem } from './services/inventoryService';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import { X } from 'lucide-react';

// Mock projects data needs to be accessible here to find selected projects
// In a real app this would be in a store or context. For now I'll duplicate the mock data source 
// or just accept that Dashboard passes IDs and I need to find them.
// Actually Dashboard passes IDs to onOrder, but I need the full objects for ChatInterface.
// Let's move mockProjects to a shared constant or just define it here to lookup.
const MOCK_PROJECTS: ProjectData[] = [
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

const App: React.FC = () => {
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [botSelectedProjects, setBotSelectedProjects] = useState<ProjectData[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const handleOrder = (selectedIds: string[]) => {
      const projects = MOCK_PROJECTS.filter(p => selectedIds.includes(p.id));
      setBotSelectedProjects(projects);
      setIsBotOpen(true);
  };

  // Handlers for data updates
  const handleInfoSubmit = (data: CustomerInfo) => {
    setCustomerInfo(data);
  };

  const handleItemsExtracted = (newItems: LineItem[]) => {
    const itemsWithAccessories = addAccessoriesToItems(newItems);
    setLineItems(prev => [...prev, ...itemsWithAccessories]);
  };

  const addAccessoriesToItems = (items: LineItem[]): LineItem[] => {
      const result = [...items];
      items.forEach(item => {
          if (item.itemCode && !item.isAccessory) {
              const invItem = getInventoryItem(item.itemCode);
              if (invItem && invItem.accessories) {
                  invItem.accessories.forEach(accKey => {
                      const accItem = createAccessoryLineItem(accKey, item);
                      if (accItem) result.push(accItem);
                  });
              }
          }
      });
      return result;
  };

  const handleRemoveItem = (id: string) => {
    setLineItems(prev => prev.filter(i => i.id !== id && i.parentId !== id));
  };

  const handleUpdateItem = (id: string, qty: number) => {
    setLineItems(prev => prev.map(i => i.id === id ? recalculateItemStatus(i, qty) : i));
  };

  const handleUpdateOrderEntry = (entryId: string, updates: Partial<OrderEntry>) => {
      setCustomerInfo(prev => {
          if (!prev) return null;
          return {
              ...prev,
              orderEntries: prev.orderEntries.map(e => e.id === entryId ? { ...e, ...updates } : e)
          };
      });
  };

  const handleSwapItem = (itemId: string, candidate: MatchOption) => {
    setLineItems(prev => {
      // 1. Find parent
      const parent = prev.find(i => i.id === itemId);
      if (!parent) return prev;

      // 2. Remove old auto-added accessories
      const filtered = prev.filter(i => {
          if (i.id === itemId) return true;
          if (i.parentId === itemId && i.isAutoAdded) return false;
          return true;
      });

      // 3. Update parent
      const updated = filtered.map(i => {
          if (i.id === itemId) {
              return {
                  ...i,
                  itemCode: candidate.code,
                  displayName: candidate.name,
                  imageUrl: candidate.image,
                  stockAvailable: candidate.stock,
                  itemStatus: (i.purchasedQty || 0) > candidate.stock ? 'CHECK_REQUIRED' : 'AVAILABLE'
              } as LineItem;
          }
          return i;
      });

      // 4. Add new accessories
      const updatedParent = updated.find(i => i.id === itemId)!;
      let newAccessories: LineItem[] = [];
      if (candidate.accessories) {
          candidate.accessories.forEach(accKey => {
              const accItem = createAccessoryLineItem(accKey, updatedParent);
              if (accItem) newAccessories.push(accItem);
          });
      }

      return [...updated, ...newAccessories];
    });
  };

  const handleResetAll = () => {
    setCustomerInfo(null);
    setLineItems([]);
  };

  return (
    <div className="h-screen w-full relative">
      {/* Main Content */}
      {selectedProject ? (
        <ProjectDetail 
          project={selectedProject} 
          onBack={() => setSelectedProject(null)} 
          onOrder={(id) => handleOrder([id])}
        />
      ) : (
        <Dashboard 
          onOpenBot={() => {
              setBotSelectedProjects([]);
              setIsBotOpen(true);
          }} 
          onProjectClick={(project) => setSelectedProject(project)}
          onOrder={handleOrder}
        />
      )}

      {/* Bot Overlay */}
      {isBotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsBotOpen(false)} />
          
          <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            {/* Header for Bot View */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-600">Sale Admin Bot</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Active Session</span>
              </div>
              <button 
                onClick={() => setIsBotOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                title="Close Bot"
              >
                <X size={20} />
              </button>
            </div>

            {/* Existing Chat Interface */}
            <div className="flex-1 overflow-hidden relative">
              <ChatInterface 
                key={botSelectedProjects.map(p => p.id).join(',')} // Force re-mount if selection changes
                defaultInfo={{}}
                customerInfo={customerInfo}
                lineItems={lineItems}
                selectedProjects={botSelectedProjects}
                onInfoSubmit={handleInfoSubmit}
                onItemsExtracted={handleItemsExtracted}
                onRemoveItem={handleRemoveItem}
                onUpdateItem={handleUpdateItem}
                onDownloadPdf={(meta) => console.log('Download', meta)}
                onResetAll={handleResetAll}
                onUpdateOrderEntry={handleUpdateOrderEntry}
                onSwapItem={handleSwapItem}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

