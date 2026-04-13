
import React, { useState, useEffect } from 'react';
import { OrderEntry, ShippingMethod, LineItem, MatchOption, ItemStatus } from '../types';
import { X, Save, MapPin, Truck, Calendar, User, Phone, MapPinned, ChevronLeft, PackageCheck, Puzzle, CheckCircle2, ArrowRight, Trash2, RefreshCw, MessageSquarePlus, Plus, Sparkles } from 'lucide-react';

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
  const [addressParts, setAddressParts] = useState({
      street: '',
      suburb: '',
      state: '',
      postcode: ''
  });

  // Sync internal form state if entry prop updates externally
  useEffect(() => {
    setFormData(prev => ({ ...prev, ...entry }));
    if (entry.shippingAddress) {
        const parts = entry.shippingAddress.split(',').map(s => s.trim());
        setAddressParts({
            street: parts[0] || '',
            suburb: parts[1] || '',
            state: parts[2] || '',
            postcode: parts[3] || ''
        });
    }
  }, [entry]);

  const handleFormChange = (field: keyof OrderEntry, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    // Real-time save: immediately propagate changes
    onUpdateEntry(entry.id, updated);
  };

  const handleAddressChange = (field: keyof typeof addressParts, value: string) => {
      const newParts = { ...addressParts, [field]: value };
      setAddressParts(newParts);
      const combined = [newParts.street, newParts.suburb, newParts.state, newParts.postcode].filter(Boolean).join(', ');
      handleFormChange('shippingAddress', combined);
  };

  const handleSave = () => {
      onUpdateEntry(entry.id, formData);
      onClose();
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
    <div className="flex flex-col h-full animate-fadeIn bg-slate-50 p-6 overflow-y-auto space-y-6">
        
        {/* Row 1: PO Number */}
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center rounded text-xs font-black">1</div>
            <span className="text-red-500 font-bold">*</span>
            <span className="text-sm font-bold text-slate-700 w-16">PO#</span>
            <input 
                className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                value={formData.poNumber}
                onChange={(e) => handleFormChange('poNumber', e.target.value)}
            />
        </div>

        {/* Row 2: Logistics Method, ETA, Ship from */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    <span className="text-red-500">*</span> Logistics Method
                </label>
                <div className="bg-white p-1 rounded-lg border border-slate-200 flex shadow-sm">
                    <button
                        onClick={() => handleFormChange('shippingMethod', ShippingMethod.DELIVERY)}
                        className={`flex-1 py-2 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            formData.shippingMethod === ShippingMethod.DELIVERY ? 'bg-slate-100 text-slate-900 border border-slate-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Truck className="w-4 h-4" /> Delivery
                    </button>
                    <button
                        onClick={() => handleFormChange('shippingMethod', ShippingMethod.PICKUP)}
                        className={`flex-1 py-2 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            formData.shippingMethod === ShippingMethod.PICKUP ? 'bg-slate-100 text-slate-900 border border-slate-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <MapPin className="w-4 h-4" /> Pickup
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    <span className="text-red-500">*</span> {formData.shippingMethod === ShippingMethod.PICKUP ? 'ETP' : 'ETA'}
                </label>
                <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input 
                        type="date"
                        className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                        value={formData.requestedDate}
                        onChange={(e) => handleFormChange('requestedDate', e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    <span className="text-red-500">*</span> {formData.shippingMethod === ShippingMethod.PICKUP ? 'Pick Up from' : 'Ship from'}
                </label>
                <select 
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition-colors shadow-sm appearance-none"
                    value={formData.shippingMethod === ShippingMethod.PICKUP ? (formData.pickupWarehouse || '') : (formData.shipFromWarehouse || '')}
                    onChange={(e) => {
                        if (formData.shippingMethod === ShippingMethod.PICKUP) {
                            handleFormChange('pickupWarehouse', e.target.value);
                        } else {
                            handleFormChange('shipFromWarehouse', e.target.value);
                        }
                    }}
                >
                    <option value="">Select Warehouse...</option>
                    <option value="NSW Warehouse">NSW Warehouse</option>
                    <option value="VIC Warehouse">VIC Warehouse</option>
                    <option value="QLD Warehouse">QLD Warehouse</option>
                </select>
            </div>
        </div>

        {/* Shipping Address Block (Only if Delivery) */}
        {formData.shippingMethod === ShippingMethod.DELIVERY && (
            <div className="bg-slate-100 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h4 className="font-bold text-slate-800 text-sm">Shipping Address</h4>
                    <button className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors shadow-sm">
                        <MapPinned className="w-3 h-3" /> Select from Address Book
                    </button>
                </div>

                <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-600 flex items-center gap-1"><span className="text-red-500">*</span> Street Address</label>
                        <input 
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                            value={addressParts.street}
                            onChange={(e) => handleAddressChange('street', e.target.value)}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600 flex items-center gap-1"><span className="text-red-500">*</span> City Suburb</label>
                            <input 
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                                value={addressParts.suburb}
                                onChange={(e) => handleAddressChange('suburb', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600 flex items-center gap-1"><span className="text-red-500">*</span> State</label>
                            <select 
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm appearance-none"
                                value={addressParts.state}
                                onChange={(e) => handleAddressChange('state', e.target.value)}
                            >
                                <option value="">Select State</option>
                                <option value="QLD">QLD</option>
                                <option value="NSW">NSW</option>
                                <option value="VIC">VIC</option>
                                <option value="WA">WA</option>
                                <option value="SA">SA</option>
                                <option value="TAS">TAS</option>
                                <option value="ACT">ACT</option>
                                <option value="NT">NT</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600 flex items-center gap-1"><span className="text-red-500">*</span> Postcode</label>
                            <input 
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                                value={addressParts.postcode}
                                onChange={(e) => handleAddressChange('postcode', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Pickup Warehouse Block (Only if Pickup) */}
        {/* We merged this into the 'Pick Up from' field above to match the screenshot, so no extra block is needed here */}

        {/* Recipient Details (Only if Delivery) */}
        {formData.shippingMethod === ShippingMethod.DELIVERY && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1"><span className="text-red-500">*</span> Recipient Name</label>
                    <input 
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                        value={formData.recipientName || ''}
                        onChange={(e) => handleFormChange('recipientName', e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1"><span className="text-red-500">*</span> Phone Number</label>
                    <input 
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
                        value={formData.recipientPhone || ''}
                        onChange={(e) => handleFormChange('recipientPhone', e.target.value)}
                    />
                </div>
            </div>
        )}

        {/* Delivery Options (Only if Delivery) */}
        {formData.shippingMethod === ShippingMethod.DELIVERY && (
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1"><span className="text-red-500">*</span> Delivery Options</label>
                <div className="flex flex-wrap gap-3">
                    {['Standard', 'Tailgate', 'Crane', 'Hand Unload'].map(opt => {
                        const isSelected = (formData.deliveryOption || 'Standard') === opt;
                        return (
                            <button
                                key={opt}
                                onClick={() => handleFormChange('deliveryOption', opt)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold transition-all shadow-sm ${
                                    isSelected 
                                    ? 'border-blue-600 bg-white text-slate-800' 
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-600' : 'border-slate-300'}`}>
                                    {isSelected && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                                </div>
                                <Truck className="w-4 h-4 text-slate-500" />
                                {opt}
                            </button>
                        );
                    })}
                </div>
            </div>
        )}
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
      <div className="bg-white w-full max-w-3xl md:rounded-[2rem] rounded-t-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] animate-slideUp">
        
        {/* Main Modal Header */}
        <div className="p-4 md:p-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 z-10 md:rounded-t-[2rem] rounded-t-[2.5rem]">
          <div>
             <h2 className="text-lg font-black text-slate-800">Order Details</h2>
             <p className="text-xs text-slate-400 font-bold mt-0.5">PO: {formData.poNumber || 'Unassigned'}</p>
          </div>
          <button onClick={handleSave} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all"><X className="w-5 h-5" /></button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative bg-slate-50">
            {renderOverview()}
        </div>

        {/* Footer Action */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0 md:rounded-b-[2rem]">
            <button 
                onClick={handleSave}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all"
            >
                Save Changes
            </button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;
