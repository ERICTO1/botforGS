
import React, { useState, useEffect } from 'react';
import { OrderEntry, ShippingMethod, LineItem, MatchOption, ItemStatus } from '../types';
import { X, Save, MapPin, Truck, Calendar, User, Phone, MapPinned, ChevronLeft, PackageCheck, Puzzle, CheckCircle2, ArrowRight, Trash2, RefreshCw, MessageSquarePlus, Plus } from 'lucide-react';

interface OrderDetailsModalProps {
  entry: OrderEntry;
  items: LineItem[];
  initialItemToSwap?: LineItem | null;
  onClose: () => void;
  onUpdateEntry: (id: string, updates: Partial<OrderEntry>) => void;
  onSwapItem: (itemId: string, candidate: MatchOption) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, qty: number) => void;
  onManualModification: (item: LineItem) => void;
  onAddProduct: () => void;
}

type ViewState = 'OVERVIEW' | 'SWAP';

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  entry, 
  items, 
  initialItemToSwap, 
  onClose, 
  onUpdateEntry, 
  onSwapItem,
  onRemoveItem,
  onUpdateItem,
  onManualModification,
  onAddProduct
}) => {
  const [view, setView] = useState<ViewState>(initialItemToSwap ? 'SWAP' : 'OVERVIEW');
  const [selectedItem, setSelectedItem] = useState<LineItem | null>(initialItemToSwap || null);
  const [formData, setFormData] = useState<OrderEntry>({ ...entry });

  // Sync internal form state if entry prop updates externally
  useEffect(() => {
    setFormData(prev => ({ ...prev, ...entry }));
  }, [entry]);

  const handleFormChange = (field: keyof OrderEntry, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    // Real-time save: immediately propagate changes
    onUpdateEntry(entry.id, updated);
  };

  const handleItemClick = (item: LineItem) => {
    if (item.candidates && item.candidates.length > 0 && !item.isAccessory) {
        setSelectedItem(item);
        setView('SWAP');
    }
  };

  const handleSwap = (candidate: MatchOption) => {
      if (selectedItem) {
          onSwapItem(selectedItem.id, candidate);
          setView('OVERVIEW');
          setSelectedItem(null);
      }
  };

  // --- SUB-COMPONENTS ---

  const renderOverview = () => (
    <div className="flex flex-col h-full animate-fadeIn">
        {/* Header Section (Editable) */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 space-y-4 shrink-0">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Logistics & Header
                </h3>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">PO Reference</label>
                    <input 
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                        value={formData.poNumber}
                        onChange={(e) => handleFormChange('poNumber', e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Req. Date</label>
                    <input 
                        type="date"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                        value={formData.requestedDate}
                        onChange={(e) => handleFormChange('requestedDate', e.target.value)}
                    />
                </div>
             </div>

             <div className="bg-white p-1 rounded-xl border border-slate-200 flex">
                <button
                    onClick={() => handleFormChange('shippingMethod', ShippingMethod.DELIVERY)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all ${
                        formData.shippingMethod === ShippingMethod.DELIVERY ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                    }`}
                >
                    Delivery
                </button>
                <button
                    onClick={() => handleFormChange('shippingMethod', ShippingMethod.PICKUP)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all ${
                        formData.shippingMethod === ShippingMethod.PICKUP ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
                    }`}
                >
                    Pickup
                </button>
             </div>

             {formData.shippingMethod === ShippingMethod.DELIVERY ? (
                 <div className="grid grid-cols-1 gap-3 animate-fadeIn">
                    <input 
                        placeholder="Recipient Name"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500"
                        value={formData.recipientName}
                        onChange={(e) => handleFormChange('recipientName', e.target.value)}
                    />
                    <input 
                        placeholder="Shipping Address"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500"
                        value={formData.shippingAddress}
                        onChange={(e) => handleFormChange('shippingAddress', e.target.value)}
                    />
                 </div>
             ) : (
                 <div className="animate-fadeIn">
                     <select 
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500"
                        value={formData.pickupWarehouse}
                        onChange={(e) => handleFormChange('pickupWarehouse', e.target.value)}
                     >
                        <option value="">Select Warehouse...</option>
                        <option value="WH-CA-01">California Hub (LA)</option>
                        <option value="WH-NY-02">New York East Dist</option>
                        <option value="WH-TX-03">Texas Central (Austin)</option>
                     </select>
                 </div>
             )}
        </div>

        {/* Item List Section */}
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <PackageCheck className="w-4 h-4" /> Line Items ({items.length})
                </h3>
                <button 
                    onClick={onAddProduct}
                    className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <Plus className="w-3 h-3" /> Add Product
                </button>
            </div>
            
            {items.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed border-slate-100 rounded-2xl">
                    <p className="text-slate-400 text-xs font-bold">No items in this order.</p>
                </div>
            ) : (
                items.map((item) => {
                    const isParent = !item.isAccessory;
                    const canSwap = isParent && item.candidates && item.candidates.length > 0;
                    
                    return (
                        <div key={item.id} className={`flex gap-3 p-3 rounded-2xl border transition-all ${
                            isParent ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-transparent ml-8 opacity-80'
                        }`}>
                            <div className="w-12 h-12 rounded-lg bg-slate-100 shrink-0 overflow-hidden">
                                {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">{item.displayName}</p>
                                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">{item.itemCode}</p>
                                    </div>
                                    {!item.isAutoAdded && (
                                        <button onClick={() => onRemoveItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-2 py-1 border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Qty</span>
                                        <input 
                                            type="number" 
                                            min="1"
                                            value={item.purchasedQty || 0}
                                            onChange={(e) => onUpdateItem(item.id, parseInt(e.target.value) || 0)}
                                            className="w-12 bg-transparent text-xs font-bold text-slate-800 text-center focus:outline-none"
                                        />
                                    </div>
                                    
                                    {canSwap && (
                                        <button 
                                            onClick={() => handleItemClick(item)}
                                            className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <RefreshCw className="w-3 h-3" /> Swap / Match
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  );

  const renderSwap = () => {
      if (!selectedItem) return null;
      return (
        <div className="flex flex-col h-full animate-slideRight">
            {/* Nav Header */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white shrink-0">
                <button 
                    onClick={() => { setView('OVERVIEW'); setSelectedItem(null); }}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">Swap Product</h3>
                    <p className="text-[10px] text-slate-400 font-bold">Replacing: {selectedItem.displayName}</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
                {/* Current Item with Modify Button */}
                <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded-bl-xl uppercase tracking-wider">Current</div>
                    <div className="flex items-center gap-4 mb-4">
                        <img src={selectedItem.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-slate-50" />
                        <div>
                            <p className="text-sm font-bold text-slate-800">{selectedItem.displayName}</p>
                            <p className="text-xs font-mono text-slate-400">{selectedItem.itemCode}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onManualModification(selectedItem)}
                        className="w-full flex items-center justify-center gap-2 text-xs font-black text-blue-600 bg-blue-50 py-3 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                        <MessageSquarePlus className="w-4 h-4" />
                        Modify via Chat
                    </button>
                </div>
                
                <div className="flex items-center gap-2 py-2">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Matches</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="space-y-3">
                    {selectedItem.candidates && selectedItem.candidates.length > 0 ? (
                        selectedItem.candidates.map((cand, idx) => {
                            const isSelected = cand.code === selectedItem.itemCode;
                            return (
                                <button 
                                    key={idx}
                                    onClick={() => handleSwap(cand)}
                                    disabled={isSelected}
                                    className={`w-full text-left p-4 rounded-3xl border-2 transition-all group relative overflow-hidden ${
                                        isSelected 
                                        ? 'border-green-500 bg-green-50' 
                                        : 'border-white bg-white shadow-sm hover:border-blue-400 hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                                            <img src={cand.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-xs leading-tight">{cand.name}</h4>
                                                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">{cand.code}</p>
                                                </div>
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                                                    isSelected ? 'bg-green-200 text-green-800' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {cand.score}% Match
                                                </span>
                                            </div>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">Stock: {cand.stock}</span>
                                                {cand.accessories && (
                                                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                        <Puzzle className="w-3 h-3" /> +Acc
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute right-0 bottom-0 bg-green-500 text-white p-1.5 rounded-tl-xl">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-slate-400 text-xs">No similar matches found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn p-0 md:p-4">
      <div className="bg-white w-full max-w-lg md:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-[85vh] animate-slideUp">
        
        {/* Main Modal Header */}
        <div className="p-4 md:p-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 z-10">
          <div>
             <h2 className="text-lg font-black text-slate-800">Order Details</h2>
             <p className="text-xs text-slate-400 font-bold mt-0.5">PO: {formData.poNumber || 'Unassigned'}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all"><X className="w-5 h-5" /></button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative bg-slate-50">
            {view === 'OVERVIEW' ? renderOverview() : renderSwap()}
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;
