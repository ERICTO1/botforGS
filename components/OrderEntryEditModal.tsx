
import React, { useState } from 'react';
import { OrderEntry, ShippingMethod } from '../types';
import { X, Save, MapPin, Truck, Calendar, User, Phone, MapPinned } from 'lucide-react';

interface OrderEntryEditModalProps {
  entry: OrderEntry;
  onClose: () => void;
  onSave: (id: string, updates: Partial<OrderEntry>) => void;
}

const OrderEntryEditModal: React.FC<OrderEntryEditModalProps> = ({ entry, onClose, onSave }) => {
  const [formData, setFormData] = useState<OrderEntry>({ ...entry });

  const handleChange = (field: keyof OrderEntry, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(entry.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg md:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
             <h2 className="text-lg font-black text-slate-800">Edit Order Details</h2>
             <p className="text-xs text-slate-400 font-bold mt-0.5">PO: {formData.poNumber || 'Unassigned'}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-800 shadow-sm border border-slate-100 transition-all"><X className="w-5 h-5" /></button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto space-y-6">
            
            {/* PO & Date */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PO Reference</label>
                    <input 
                        type="text"
                        value={formData.poNumber}
                        onChange={(e) => handleChange('poNumber', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requested Date</label>
                    <input 
                        type="date"
                        value={formData.requestedDate}
                        onChange={(e) => handleChange('requestedDate', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Shipping Method Toggle */}
            <div className="bg-blue-50/50 p-1.5 rounded-2xl flex border border-blue-100">
                <button
                    onClick={() => handleChange('shippingMethod', ShippingMethod.DELIVERY)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                        formData.shippingMethod === ShippingMethod.DELIVERY 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-slate-400 hover:bg-blue-100/50'
                    }`}
                >
                    <Truck className="w-4 h-4" /> Delivery
                </button>
                <button
                    onClick={() => handleChange('shippingMethod', ShippingMethod.PICKUP)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                        formData.shippingMethod === ShippingMethod.PICKUP 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-slate-400 hover:bg-blue-100/50'
                    }`}
                >
                    <MapPin className="w-4 h-4" /> Pickup
                </button>
            </div>

            {/* Conditional Fields */}
            {formData.shippingMethod === ShippingMethod.DELIVERY ? (
                <div className="space-y-4 animate-fadeIn">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><User className="w-3 h-3"/> Recipient</label>
                            <input 
                                type="text"
                                value={formData.recipientName}
                                onChange={(e) => handleChange('recipientName', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Phone className="w-3 h-3"/> Phone</label>
                            <input 
                                type="tel"
                                value={formData.recipientPhone}
                                onChange={(e) => handleChange('recipientPhone', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><MapPin className="w-3 h-3"/> Address</label>
                        <textarea 
                            rows={3}
                            value={formData.shippingAddress}
                            onChange={(e) => handleChange('shippingAddress', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><MapPinned className="w-3 h-3"/> Warehouse</label>
                         <select
                            value={formData.pickupWarehouse}
                            onChange={(e) => handleChange('pickupWarehouse', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select Warehouse...</option>
                            <option value="WH-CA-01">California Hub (LA)</option>
                            <option value="WH-NY-02">New York East Dist</option>
                            <option value="WH-TX-03">Texas Central (Austin)</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3"/> Time Slot</label>
                         <select
                            value={formData.pickupTimeSlot}
                            onChange={(e) => handleChange('pickupTimeSlot', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Any Time</option>
                            <option value="09:00-11:00">09:00 - 11:00</option>
                            <option value="11:00-13:00">11:00 - 13:00</option>
                            <option value="14:00-16:00">14:00 - 16:00</option>
                        </select>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white">
            <button 
                onClick={handleSave}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <Save className="w-5 h-5" />
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderEntryEditModal;
