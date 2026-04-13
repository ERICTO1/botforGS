import React, { useState } from 'react';
import { 
  Search, 
  Compass, 
  PenTool, 
  Cloud, 
  LayoutGrid, 
  ExternalLink, 
  ChevronDown,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import Sidebar from './Sidebar';

import OrderDetailsView from './OrderDetailsView';

interface BotPageProps {
  onNavChange: (tab: string) => void;
  chatComponent: React.ReactNode;
  onNewChat: () => void;
  onSelectHistory: (id: string) => void;
}

const HISTORY_ITEMS = Array.from({ length: 12 }, (_, i) => `Order ${i + 1}`);

const MOCK_ORDERS = [
  {
    id: 'OSW698583',
    orderDate: 'April 10, 2026',
    orderFrom: 'Online',
    orderAmount: '$ 20,059.60',
    etp: 'Apr 14, 2026',
    type: 'Pick up from',
    location: 'Brisbane',
    poRef: '',
    processingDate: 'April 14, 2026',
    status: ['Processing', 'Awaiting Payment'],
    items: [
      { img: 'https://via.placeholder.com/40', qty: 4, defaultIcon: true },
      { img: 'https://via.placeholder.com/40', qty: 4, defaultIcon: true }
    ]
  },
  {
    id: 'OSW698429',
    orderDate: 'April 7, 2026',
    orderFrom: 'Online',
    orderAmount: '$ 666,886.10',
    etp: 'Apr 13, 2026',
    type: 'Ship to',
    location: 'Joe Geraghty',
    poRef: '',
    processingDate: 'April 13, 2026',
    status: ['Processing'],
    items: [
      { img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=40&h=40&fit=crop', qty: 1 },
      { img: 'https://via.placeholder.com/40', qty: 2, defaultIcon: true },
      { img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?w=40&h=40&fit=crop', qty: 8 },
      { img: 'https://via.placeholder.com/40', qty: 5, defaultIcon: true },
      { img: 'https://via.placeholder.com/40', qty: 10, defaultIcon: true },
      { img: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=40&h=40&fit=crop', qty: 1 },
      { img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?w=40&h=40&fit=crop', qty: 1 }
    ]
  },
  {
    id: 'OSW698428',
    orderDate: 'April 7, 2026',
    orderFrom: 'Online',
    orderAmount: '$ 13,186.03',
    etp: 'Apr 10, 2026',
    type: 'Pick up from',
    location: 'Brisbane',
    poRef: 'totest',
    processingDate: 'April 10, 2026',
    status: ['Processing'],
    items: [
      { img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=40&h=40&fit=crop', qty: 10 },
      { img: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b6?w=40&h=40&fit=crop', qty: 1 },
      { img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=40&h=40&fit=crop', qty: 1 },
      { img: 'https://via.placeholder.com/40', qty: 1, defaultIcon: true },
      { img: 'https://via.placeholder.com/40', qty: 1, defaultIcon: true },
      { img: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=40&h=40&fit=crop', qty: 1 }
    ]
  }
];

const BotPage: React.FC<BotPageProps> = ({ onNavChange, chatComponent, onNewChat, onSelectHistory }) => {
  const [view, setView] = useState<'orders' | 'chat' | 'order-detail'>('orders');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleOrdersClick = () => {
      setView('orders');
      setActiveId(null);
  };

  const handleNewChatClick = () => {
      setView('chat');
      setActiveId('new');
      onNewChat();
  };

  const handleHistoryClick = (item: string) => {
      setView('chat');
      setActiveId(item);
      onSelectHistory(item);
  };

  const handleOrderClick = (e: React.MouseEvent, orderId: string) => {
      e.preventDefault();
      setSelectedOrderId(orderId);
      setView('order-detail');
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      <Sidebar activeTab="Sale Bot" onTabChange={onNavChange} />

      {/* Bot Specific Inner Sidebar (Like Image 1) */}
      <div className="w-64 flex flex-col bg-[#f9f9f9] border-r border-gray-200 flex-shrink-0">
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <span className="font-bold text-xs italic tracking-tighter">OSW</span>
          </div>
          <span className="font-bold text-gray-800">Sale Bot</span>
        </div>

        <div className="px-3 space-y-1 mb-4">
          <button 
            onClick={handleOrdersClick}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-800 transition-colors ${view === 'orders' ? 'bg-[#e5e5e5]' : 'bg-[#efefef] hover:bg-[#e5e5e5]'}`}>
            <div className="flex items-center gap-3">
              <Compass size={18} className="text-gray-700" />
              <span className="text-[15px]">Orders</span>
            </div>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-6">
          <div className="space-y-0.5">
            <button 
                onClick={handleNewChatClick}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[15px] transition-colors font-bold mb-3 border ${activeId === 'new' ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'}`}
            >
                <span>+ New Chat</span>
            </button>
            {HISTORY_ITEMS.map((item, i) => (
              <button 
                key={i} 
                onClick={() => handleHistoryClick(item)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-[15px] truncate transition-colors ${activeId === item ? 'bg-[#e5e5e5] text-gray-900 font-medium' : 'text-gray-700 hover:bg-[#efefef]'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden relative">
        {view === 'order-detail' && selectedOrderId ? (
          <OrderDetailsView orderId={selectedOrderId} onBack={() => setView('orders')} />
        ) : view === 'orders' ? (
          <div className="p-6 overflow-y-auto h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search Order No. / PO Reference" 
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <select className="appearance-none pl-4 pr-8 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-500 min-w-[120px]">
                <option value="">Status</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" size={16} />
            </div>

            <div className="relative">
              <select className="appearance-none pl-4 pr-8 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-500 min-w-[140px]">
                <option value="30">Last 30 days</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" size={16} />
            </div>

            <label className="flex items-center gap-2 ml-4 cursor-pointer">
              <span className="text-sm text-gray-700 font-medium">Awaiting Payment</span>
              <input type="checkbox" className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500" />
            </label>
          </div>

          {/* Order List */}
          <div className="space-y-6">
            {MOCK_ORDERS.map((order, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                {/* Order Header */}
                <div className="flex flex-wrap items-start justify-between p-4 bg-[#fbfbfb] border-b border-gray-200 text-xs">
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <div>
                      <p className="text-gray-500 font-bold mb-1">Order Date</p>
                      <p className="font-bold text-gray-900">{order.orderDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold mb-1">Order From</p>
                      <p className="font-bold text-gray-900">{order.orderFrom}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold mb-1">Order Amount</p>
                      <p className="font-bold text-gray-900">{order.orderAmount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold mb-1">ETP</p>
                      <p className="font-bold text-gray-900">{order.etp}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold mb-1">{order.type}</p>
                      <p className="font-bold text-blue-600 flex items-center gap-1 cursor-pointer">
                        {order.location} <ChevronDown size={12} />
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold mb-1">PO Reference</p>
                      <p className="font-bold text-gray-900">{order.poRef || '-'}</p>
                    </div>
                    <div className="pt-2">
                      <button className="border border-blue-200 text-blue-600 px-3 py-1 rounded hover:bg-blue-50 font-bold transition-colors">
                        Reorder
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-gray-500 font-medium flex items-center justify-end">
                      Order #: <a href="#" onClick={(e) => handleOrderClick(e, order.id)} className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1 ml-1">{order.id} <ExternalLink size={12} /></a>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button className="text-blue-600 font-bold flex items-center gap-0.5 hover:underline text-xs">
                        Invoices <ChevronDown size={12} />
                      </button>
                      <div className="flex gap-1.5">
                        {order.status.map(s => (
                          <span 
                            key={s} 
                            className={`px-2 py-0.5 rounded text-white font-bold text-[10px] uppercase tracking-wider ${s === 'Processing' ? 'bg-blue-600' : 'bg-orange-400'}`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <p className="text-[#1a4a8d] font-bold mb-4 text-sm">Processing {order.processingDate}</p>
                  <div className="flex flex-wrap gap-6">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-12 h-12 border border-gray-200 rounded flex items-center justify-center bg-gray-50 overflow-hidden">
                          {item.defaultIcon ? (
                            <div className="text-[#e2e8f0] font-black italic text-xl tracking-tighter">OSW</div>
                          ) : (
                            <img src={item.img} alt="Product" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-sm font-bold text-gray-800">x{item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        ) : (
          <div className="absolute inset-0 w-full h-full">
            {chatComponent}
          </div>
        )}
      </div>
    </div>
  );
};

export default BotPage;