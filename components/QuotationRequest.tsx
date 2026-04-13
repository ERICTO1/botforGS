import React, { useState } from 'react';
import { ChevronRight, Download, Plus, MapPin, Calendar, Check, Search, ChevronDown, X, Truck, Home } from 'lucide-react';

interface QuotationRequestProps {
  onCancel: () => void;
}

const QuotationRequest: React.FC<QuotationRequestProps> = ({ onCancel }) => {
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');

  // Mock product data based on screenshots
  const [products, setProducts] = useState([
    {
      id: '1',
      brand: 'AlphaESS',
      category: 'Inverter',
      name: 'SMILE-B3-PLUS III (AS4777-2 2020)',
      specs: '3kW · 1 Phase · 0 MPPT · Battery-only',
      quantity: 1,
      selected: true,
      image: 'https://via.placeholder.com/40x40?text=Inv'
    },
    {
      id: '2',
      brand: 'S', // Placeholder for brand logo
      category: 'Panel',
      name: 'JMPV-XV6/54-425~440(R)',
      specs: '440W',
      quantity: 65,
      selected: true,
      image: 'https://via.placeholder.com/40x40?text=Pan'
    },
    {
      id: '3',
      brand: 'AlphaESS',
      category: 'Battery',
      name: 'SMILE-BAT-8.2 PH',
      specs: '8.2kWh',
      quantity: 4,
      selected: true,
      image: 'https://via.placeholder.com/40x40?text=Bat'
    }
  ]);

  const toggleProductSelect = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const updateQuantity = (id: string, delta: number) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const newQty = Math.max(1, p.quantity + delta);
        return { ...p, quantity: newQty };
      }
      return p;
    }));
  };

  const totalQuantity = products.filter(p => p.selected).reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold italic">
            G
          </div>
          <ChevronRight size={16} className="text-gray-400" />
          <h1 className="text-xl font-bold text-gray-900">Quotation Request</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center">
          <div className={`flex items-center px-4 py-1.5 rounded-l-full ${step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            <div className="w-5 h-5 bg-white text-green-500 rounded-full flex items-center justify-center text-xs font-bold mr-2">1</div>
            <span className="text-sm font-medium">Select Products</span>
          </div>
          {/* Arrow shape */}
          <div className={`w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent ${step >= 1 ? 'border-l-[16px] border-l-green-500' : 'border-l-[16px] border-l-gray-200'} relative z-10`}></div>
          <div className={`flex items-center px-6 py-1.5 -ml-4 ${step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            <div className={`w-5 h-5 ${step >= 2 ? 'bg-white text-green-500' : 'bg-gray-400 text-white'} rounded-full flex items-center justify-center text-xs font-bold mr-2`}>2</div>
            <span className="text-sm font-medium">Complete Purchase Information</span>
          </div>
          <div className={`w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent ${step >= 2 ? 'border-l-[16px] border-l-green-500' : 'border-l-[16px] border-l-gray-200'} relative z-10`}></div>
          <div className={`flex items-center px-6 py-1.5 -ml-4 rounded-r-full ${step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            <div className={`w-5 h-5 ${step >= 3 ? 'bg-white text-green-500' : 'bg-gray-400 text-white'} rounded-full flex items-center justify-center text-xs font-bold mr-2`}>3</div>
            <span className="text-sm font-medium">Review & Send RFQ</span>
          </div>
        </div>
        
        <div className="w-24"></div> {/* Spacer to balance header */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 flex justify-center">
        {step === 1 && (
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full max-h-[800px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Select the products to generate your Request for Quote (RFQ)</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">Product selections can still be edited in the next step.</p>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <span className="font-bold text-gray-900">Brisbane QLD, Australia</span>
                </div>
                <div className="relative w-72">
                  <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>28.6kW Solar + 32.8kWh Battery</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} />
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-500 mb-4 px-2">
                <span>Product List</span>
                <span>Quantity</span>
              </div>

              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-start gap-4">
                      <div 
                        className={`mt-1 w-5 h-5 rounded flex items-center justify-center cursor-pointer border ${product.selected ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-white'}`}
                        onClick={() => toggleProductSelect(product.id)}
                      >
                        {product.selected && <Check size={14} strokeWidth={3} />}
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        <img src={product.image} alt={product.category} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-500">{product.brand}</span>
                        </div>
                        <div className="text-sm text-gray-900 font-medium mb-1">
                          <span className="font-bold">{product.category}:</span> {product.name}
                        </div>
                        <div className="text-xs text-gray-500">{product.specs}</div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 mt-2">
                      {product.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
              <button 
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-5xl flex gap-6 h-full max-h-[800px]">
            {/* Left side: Product List */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Product List</h2>
                <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700">
                  <Download size={16} /> Download BOM (.xlsx)
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex justify-between text-sm text-gray-500 mb-4 px-2">
                  <span>Products</span>
                  <span>Quantity</span>
                </div>

                <div className="space-y-4 mb-6">
                  {products.filter(p => p.selected).map(product => (
                    <div key={product.id} className="flex items-start justify-between py-4 border-b border-gray-100">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 w-5 h-5 rounded flex items-center justify-center border bg-green-500 border-green-500 text-white cursor-pointer" onClick={() => toggleProductSelect(product.id)}>
                          <Check size={14} strokeWidth={3} />
                        </div>
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                          <img src={product.image} alt={product.category} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-500">{product.brand}</span>
                          </div>
                          <div className="text-sm text-gray-900 font-medium mb-1">
                            <span className="font-bold">{product.category}:</span> {product.name}
                          </div>
                          <div className="text-xs text-gray-500">{product.specs}</div>
                        </div>
                      </div>
                      <div className="flex items-center border border-gray-300 rounded mt-1">
                        <button onClick={() => updateQuantity(product.id, -1)} className="px-3 py-1 text-gray-500 hover:bg-gray-50">-</button>
                        <input type="text" value={product.quantity} readOnly className="w-12 text-center text-sm font-medium outline-none border-l border-r border-gray-300 py-1" />
                        <button onClick={() => updateQuantity(product.id, 1)} className="px-3 py-1 text-gray-500 hover:bg-gray-50">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700">
                  <Plus size={16} /> Add Product
                </button>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end">
                <span className="text-gray-500 text-sm font-medium">Total quantity: {totalQuantity}</span>
              </div>
            </div>

            {/* Right side: Purchase Information */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Purchase Information</h2>
                <p className="text-sm text-gray-500">
                  Fill in the details below to auto-generate your RFQ email, or <a href="#" className="text-blue-600 hover:underline">Skip to write email directly</a>
                </p>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Vendor</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-300 text-gray-500 py-2.5 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select a Vendor</option>
                      <option value="vendor1">Vendor 1</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Shipment Info</label>
                  <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                    <button 
                      className={`flex items-center gap-2 px-6 py-1.5 rounded-md text-sm font-medium transition-colors ${shippingMethod === 'DELIVERY' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                      onClick={() => setShippingMethod('DELIVERY')}
                    >
                      <Truck size={16} /> Delivery
                    </button>
                    <button 
                      className={`flex items-center gap-2 px-6 py-1.5 rounded-md text-sm font-medium transition-colors ${shippingMethod === 'PICKUP' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                      onClick={() => setShippingMethod('PICKUP')}
                    >
                      <Home size={16} /> Pickup
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-gray-900">Delivery Address</label>
                    <button className="text-blue-600 text-sm hover:underline">Apply my company address</button>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input type="text" className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder=" " />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Expected Delivery Date (ETA)</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input type="text" className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder=" " />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Quotation Deadline Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input type="text" className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder=" " />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer for Step 2 */}
      {step === 2 && (
        <footer className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end flex-shrink-0">
          <button 
            onClick={() => setStep(3)}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <div className="w-4 h-4 bg-white/20 rounded-sm flex items-center justify-center">
              <span className="text-[10px]">✉</span>
            </div>
            Review and Send RFQ Email
          </button>
        </footer>
      )}
      
      {/* Bot Icon is present in original app but maybe we hide it in this flow? We'll leave it to App.tsx to manage */}
    </div>
  );
};

export default QuotationRequest;
