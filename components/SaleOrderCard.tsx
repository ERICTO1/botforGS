import React from 'react';
import { CustomerInfo, LineItem, SaleOrderMeta } from '../types';
import { Printer, ArrowLeft, Truck, Check, ChevronDown } from 'lucide-react';

interface SaleOrderCardProps {
  meta: SaleOrderMeta;
  info: CustomerInfo;
  items: LineItem[];
  onPreview: () => void;
  isDraft?: boolean;
  title?: string;
}

const SaleOrderCard: React.FC<SaleOrderCardProps> = ({ 
  meta, 
  info, 
  items, 
  onPreview, 
  isDraft = false,
  title
}) => {
  // Mock logic calculations
  const subtotal = items.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
  const deliveryFee = 50.00;
  const gst = (subtotal + deliveryFee) * 0.1;
  const total = subtotal + deliveryFee + gst;
  const saved = 0.00; 

  // Formatting dates and fields
  const orderDateObj = new Date(meta.orderTime || Date.now());
  const orderDate = orderDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const etaDate = new Date(orderDateObj.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const orderFrom = "Online";
  const orderBranch = "Sydney HQ"; // Mock
  const poRef = meta.poNumber || "N/A";
  
  const entry = info.orderEntries[0] || {};
  const recipientName = entry.recipientName || info.companyName;
  const recipientPhone = entry.recipientPhone || "N/A";
  const addressStr = entry.shippingAddress || "N/A";
  const addressParts = addressStr.split(',');

  const handleDownload = (type: 'packing_slip' | 'invoice') => {
      // Generate mock content based on type
      let content = '';
      let filename = '';

      if (type === 'packing_slip') {
          content = `PACKING SLIP\n\nOrder #: ${meta.orderId || 'OSW698429'}\nDate: ${orderDate}\n\nShip To:\n${recipientName}\n${addressStr}\n\nItems:\n${items.map(i => `- ${i.purchasedQty}x ${i.purchasedName}`).join('\n')}\n\nThank you for your order!`;
          filename = `Packing_Slip_${meta.orderId || 'OSW698429'}.txt`;
      } else {
          content = `TAX INVOICE\n\nOrder #: ${meta.orderId || 'OSW698429'}\nDate: ${orderDate}\n\nBill To:\n${info.companyName}\n\nSubtotal: $${subtotal.toFixed(2)}\nDelivery: $${deliveryFee.toFixed(2)}\nGST: $${gst.toFixed(2)}\n\nTotal Due: $${total.toFixed(2)}\n\nPayment Status: Available Credit`;
          filename = `Invoice_${meta.orderId || 'OSW698429'}.txt`;
      }

      // Create a Blob and trigger download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200 overflow-hidden w-full text-slate-800 font-sans animate-slideUp">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {meta.orderId || 'OSW698429'}
                </h2>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="px-10 py-8 border-b border-slate-100">
            <div className="relative flex items-center justify-between max-w-4xl mx-auto">
                {/* Connecting Lines */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center z-0">
                    <div className={`flex-1 h-[2px] ${isDraft ? 'bg-slate-200 border-t-[2px] border-dashed' : 'bg-blue-600'}`}></div>
                    <div className="flex-1 h-[2px] border-t-[2px] border-dashed border-slate-200"></div>
                </div>

                {/* Steps */}
                <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-3">
                    <p className="text-xs font-bold text-slate-500 absolute -top-6 whitespace-nowrap">Created</p>
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-[6px] ring-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-3">
                    <p className={`text-xs font-bold absolute -top-6 whitespace-nowrap ${isDraft ? 'text-amber-600' : 'text-slate-900'}`}>
                        {isDraft ? 'Reviewing' : 'Processing'}
                    </p>
                    <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center ring-[6px] ring-white ${isDraft ? 'bg-amber-500' : 'bg-blue-600'}`}>
                        {isDraft ? <span className="w-2 h-2 bg-white rounded-full"></span> : <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-3">
                    <p className="text-xs font-bold text-slate-400 absolute -top-6 whitespace-nowrap">Completed</p>
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-white flex items-center justify-center ring-[6px] ring-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content Split */}
        <div className="flex flex-col lg:flex-row">
            {/* Left Column (Order Details) */}
            <div className="flex-1 flex flex-col">
                {/* Details Header */}
                <div className="bg-slate-50/80 px-6 py-5 flex flex-wrap gap-8 text-sm border-b border-slate-100 justify-between items-start">
                    <div className="flex flex-wrap gap-x-12 gap-y-4">
                        <div>
                            <p className="text-slate-600 font-medium mb-1">Order Date</p>
                            <p className="font-bold text-slate-900">{orderDate}</p>
                        </div>
                        <div>
                            <p className="text-slate-600 font-medium mb-1">PO Reference</p>
                            <p className="font-bold text-slate-900">{poRef}</p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-slate-600 font-medium mb-1 flex items-center justify-end">
                            Order #: <span className="font-bold text-slate-900 ml-1">{meta.orderId || 'OSW698429'}</span>
                        </p>
                        <button 
                            onClick={() => handleDownload('invoice')}
                            className="text-blue-600 hover:underline text-[13px] font-bold flex items-center gap-0.5 justify-end ml-auto"
                        >
                            Invoices <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Details Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 h-full">
                    {/* Ship To */}
                    <div>
                        <h3 className="font-bold text-slate-900 mb-3">Ship to</h3>
                        <div className="text-slate-500 text-sm leading-relaxed mb-8">
                            <p>{recipientName}</p>
                            <p>{recipientPhone}</p>
                            <p>{info.companyName}</p>
                            {addressParts.map((line, i) => <p key={i}>{line.trim()}</p>)}
                            <p className="mt-1">Business</p>
                        </div>

                        <h3 className="font-bold text-slate-900 mb-3">Delivery options</h3>
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-wider">
                            <Truck className="w-5 h-5 text-slate-400" />
                            {entry.shippingMethod === 'PICKUP' ? 'PICKUP AT WAREHOUSE' : 'STANDARD TRUCK'}
                        </div>
                    </div>

                    {/* ETA & Service */}
                    <div className="md:border-l border-dashed border-slate-200 md:pl-8 space-y-6">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1">Expected ETA</h3>
                            <p className="text-slate-500 text-sm">{entry.requestedDate || etaDate}</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-full">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">Payment <span className="text-slate-500 font-medium text-sm">Available Credit</span></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column (Summary) */}
            <div className="w-full lg:w-80 p-5 m-4 bg-[#f0f7ff] rounded-xl flex flex-col justify-between shrink-0 border border-blue-100">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-5">Order Summary</h3>
                    
                    <div className="space-y-3.5 text-sm">
                        <div className="flex justify-between text-slate-700">
                            <span>Subtotal</span>
                            <span className="font-bold">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                            <span>Strategic Discount</span>
                            <span className="text-red-500 font-bold">-$0.00</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                            <span>Delivery Fee</span>
                            <span className="font-bold">${deliveryFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-slate-700 pb-4 border-b border-slate-200">
                            <span>GST</span>
                            <span className="font-bold">${gst.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        
                        <div className="flex justify-between text-slate-900 pt-2">
                            <span>Amount to Pay</span>
                            <span className="font-black text-base">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-slate-900 items-baseline">
                            <span>Total <span className="text-slate-500 font-normal text-[10px] ml-0.5">(incl. GST)</span></span>
                            <span className="font-black text-base">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <button 
                        onClick={() => handleDownload('packing_slip')}
                        className="w-full py-2.5 bg-white border border-blue-200 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-sm"
                    >
                        Download Packing Slip
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default SaleOrderCard;