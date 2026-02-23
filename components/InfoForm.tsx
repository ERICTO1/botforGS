
import React, { useState, useRef } from 'react';
import { CustomerInfo, ShippingMethod, OrderEntry } from '../types';
// Added Loader2 to the imports
import { Truck, MapPin, User, Building, FileText, Mail, FileUp, Plus, Trash2, ShoppingBag, Calendar, Phone, Zap, Loader2 } from 'lucide-react';

interface InfoFormProps {
  initialData: Partial<CustomerInfo>;
  onSubmit: (data: CustomerInfo) => void;
}

const InfoForm: React.FC<InfoFormProps> = ({ initialData, onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createNewEntry = (): OrderEntry => ({
    id: crypto.randomUUID(),
    poNumber: '',
    productDescription: '',
    shippingMethod: ShippingMethod.DELIVERY,
    requestedDate: new Date().toISOString().split('T')[0],
    shippingAddress: '',
    recipientName: '',
    recipientPhone: '',
    pickupWarehouse: '',
  });

  const [formData, setFormData] = useState<CustomerInfo>({
    companyName: initialData.companyName || '',
    emailAddress: initialData.emailAddress || '',
    orderEntries: [createNewEntry()]
  });

  const [isMocking, setIsMocking] = useState(false);

  // MOCK UPLOAD LOGIC
  const handleMockUpload = () => {
    setIsMocking(true);
    setTimeout(() => {
      setFormData({
        companyName: 'GreenPower Logistics LLC',
        emailAddress: 'order@greenpower.com',
        orderEntries: [
          {
            id: 'mock-1',
            poNumber: 'PO-2025-ALPHA',
            productDescription: '10x Jinko Tiger Panels, 5x Growatt Inverters',
            shippingMethod: ShippingMethod.DELIVERY,
            requestedDate: '2025-06-15',
            recipientName: 'Alice Logistics',
            recipientPhone: '555-0100',
            shippingAddress: '123 Solar Blvd, Los Angeles, CA 90001'
          },
          {
            id: 'mock-2',
            poNumber: 'PO-2025-BETA',
            productDescription: '25x Longi Solar Panels',
            shippingMethod: ShippingMethod.PICKUP,
            requestedDate: '2025-06-20',
            pickupWarehouse: 'California Hub (LA)'
          }
        ]
      });
      setIsMocking(false);
    }, 800);
  };

  const handleGlobalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateOrderEntry = (id: string, updates: Partial<OrderEntry>) => {
    setFormData(prev => ({
      ...prev,
      orderEntries: prev.orderEntries.map(oe => oe.id === id ? { ...oe, ...updates } : oe)
    }));
  };

  const addOrderEntry = () => {
    setFormData(prev => ({
      ...prev,
      orderEntries: [...prev.orderEntries, createNewEntry()]
    }));
  };

  const removeOrderEntry = (id: string) => {
    if (formData.orderEntries.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      orderEntries: prev.orderEntries.filter(oe => oe.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white shadow-2xl rounded-[2.5rem] w-full border border-slate-200 overflow-hidden flex flex-col animate-slideUp">
        {/* Header with PO Upload */}
        <div className="bg-blue-600 p-6 md:p-8 text-white shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold flex items-center gap-3">
              <User className="w-6 h-6" /> 
              Customer Profile
            </h1>
            <button 
              type="button"
              onClick={handleMockUpload}
              disabled={isMocking}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all border border-white/20 active:scale-95 shadow-lg"
            >
              {isMocking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileUp className="w-4 h-4" />
              )}
              {isMocking ? 'Extracting...' : 'Upload PO Order'}
            </button>
          </div>
          <p className="text-blue-100 text-sm font-medium opacity-80">Manual entry or upload a PO to auto-fill multiple destinations.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 overflow-y-auto max-h-[70vh]">
          
          {/* Global Customer Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-200">
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
                <Building className="w-4 h-4 text-blue-500" />
                <input 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleGlobalChange}
                  placeholder="e.g. Acme Energy Corp"
                  required
                  className="bg-transparent w-full text-sm font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
                <Mail className="w-4 h-4 text-blue-500" />
                <input 
                  type="email"
                  name="emailAddress" 
                  value={formData.emailAddress} 
                  onChange={handleGlobalChange}
                  placeholder="procurement@company.com"
                  required
                  className="bg-transparent w-full text-sm font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Multi-Order Sections */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Order Batch ({formData.orderEntries.length})
              </h3>
              <button
                type="button"
                onClick={addOrderEntry}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all border border-blue-100"
              >
                <Plus className="w-4 h-4" />
                Add Destination
              </button>
            </div>

            <div className="space-y-8">
              {formData.orderEntries.map((entry, index) => (
                <div key={entry.id} className="p-6 bg-white border-2 border-slate-100 rounded-[2rem] relative group transition-all hover:border-blue-200 shadow-sm">
                  <div className="absolute -left-3 top-6 bg-slate-800 text-white text-xs font-black w-8 h-8 flex items-center justify-center rounded-2xl shadow-xl ring-4 ring-white">
                    {index + 1}
                  </div>
                  
                  {formData.orderEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOrderEntry(entry.id)}
                      className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  
                  <div className="space-y-5 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">PO Reference</label>
                        <input
                          type="text"
                          placeholder="e.g. PO-7782"
                          value={entry.poNumber}
                          onChange={(e) => updateOrderEntry(entry.id, { poNumber: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:outline-none bg-slate-50 font-mono transition-all font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Requested Date</label>
                        <input
                          type="date"
                          value={entry.requestedDate}
                          onChange={(e) => updateOrderEntry(entry.id, { requestedDate: e.target.value })}
                          className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:outline-none bg-slate-50 transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Needed</label>
                      <textarea
                        rows={2}
                        placeholder="List items like: 10x Solar Panels, 5x Inverters..."
                        value={entry.productDescription}
                        onChange={(e) => updateOrderEntry(entry.id, { productDescription: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:outline-none bg-slate-50 resize-none transition-all font-medium"
                      />
                    </div>

                    {/* Logistics Config */}
                    <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Zap className="w-3 h-3" /> Logistics
                         </span>
                         <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                            <button
                                type="button"
                                onClick={() => updateOrderEntry(entry.id, { shippingMethod: ShippingMethod.DELIVERY })}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2 transition-all ${
                                    entry.shippingMethod === ShippingMethod.DELIVERY ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400'
                                }`}
                            >
                                <Truck className="w-3.5 h-3.5" /> DELIVERY
                            </button>
                            <button
                                type="button"
                                onClick={() => updateOrderEntry(entry.id, { shippingMethod: ShippingMethod.PICKUP })}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2 transition-all ${
                                    entry.shippingMethod === ShippingMethod.PICKUP ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400'
                                }`}
                            >
                                <MapPin className="w-3.5 h-3.5" /> PICKUP
                            </button>
                         </div>
                      </div>

                      {entry.shippingMethod === ShippingMethod.DELIVERY ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
                          <input
                              type="text"
                              placeholder="Recipient Name"
                              value={entry.recipientName}
                              onChange={(e) => updateOrderEntry(entry.id, { recipientName: e.target.value })}
                              className="w-full px-4 py-2 border border-white rounded-xl text-xs focus:border-blue-400 focus:outline-none shadow-sm font-bold"
                          />
                          <input
                              type="tel"
                              placeholder="Phone Number"
                              value={entry.recipientPhone}
                              onChange={(e) => updateOrderEntry(entry.id, { recipientPhone: e.target.value })}
                              className="w-full px-4 py-2 border border-white rounded-xl text-xs focus:border-blue-400 focus:outline-none shadow-sm font-bold"
                          />
                          <input
                              type="text"
                              placeholder="Full Shipping Address"
                              value={entry.shippingAddress}
                              onChange={(e) => updateOrderEntry(entry.id, { shippingAddress: e.target.value })}
                              className="md:col-span-2 w-full px-4 py-2 border border-white rounded-xl text-xs focus:border-blue-400 focus:outline-none shadow-sm font-bold"
                          />
                        </div>
                      ) : (
                        <select
                          value={entry.pickupWarehouse}
                          onChange={(e) => updateOrderEntry(entry.id, { pickupWarehouse: e.target.value })}
                          className="w-full px-4 py-2 border border-white rounded-xl text-xs focus:border-blue-400 focus:outline-none bg-white shadow-sm font-bold animate-fadeIn"
                        >
                          <option value="">-- Choose Pickup Warehouse --</option>
                          <option value="WH-CA-01">California Hub (LA)</option>
                          <option value="WH-NY-02">New York East Dist</option>
                          <option value="WH-TX-03">Texas Central (Austin)</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 sticky bottom-0 bg-white/95 backdrop-blur-md -mx-6 px-6 pb-2">
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-6 rounded-3xl shadow-2xl shadow-blue-600/30 transition-all active:scale-[0.98] text-sm uppercase tracking-widest flex items-center justify-center gap-3"
            >
                Confirm Batch & Extract Items
            </button>
          </div>
        </form>
    </div>
  );
};

export default InfoForm;
