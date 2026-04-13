import React from 'react';
import { Printer, ChevronDown, ChevronLeft, Battery, Check, Image as ImageIcon } from 'lucide-react';

interface OrderDetailsViewProps {
  orderId: string;
  onBack: () => void;
}

const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({ orderId, onBack }) => {
  const order = {
    id: orderId,
    orderDate: 'April 10, 2026',
    orderFrom: 'Online',
    orderBranch: '',
    poReference: '',
    pickupFrom: {
      name: 'Brisbane OSW Warehouse',
      address: '55 Rai Dr, Crestmead QLD 4132',
      phone: '(07) 3387 1888'
    },
    expectedETP: {
      date: 'Apr 14, 2026 6:30 am - 7:30 am',
      note: 'Wait until all the items are available.'
    },
    summary: {
      subtotal: '18,236.00',
      gst: '1,823.60',
      amountToPay: '20,059.60',
      total: '20,059.60',
      saved: '0.00',
      status: 'Awaiting Payment'
    },
    capacity: '852.00kW',
    processingDate: 'Apr 14, 2026',
    items: [
      {
        id: 1,
        name: 'Alpha-Smile 5-13.3kWh-Secondary battery, w/o Alpha-Smile5 extension box, w/o inverter (SMILE-BAT-13.3P / Outdoor)',
        sku: 'ES-Alpha-Smile 5-13.3kWh-Secondary',
        qty: 4,
        price: '4,559.00',
        total: '18,236.00'
      },
      {
        id: 2,
        name: 'Extension Box for Alpha-Smile 5-13.3kWh-Secondary battery',
        sku: 'ES-Alpha-Smile 5-13.3kWh-Extension Box',
        qty: 4,
        price: '0.00',
        total: '0.00'
      }
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#f9fafc] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors font-bold text-lg"
        >
          <div className="border border-gray-300 rounded p-1">
            <ChevronLeft size={20} />
          </div>
          {order.id}
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold text-sm">
          <Printer size={16} />
          Print
        </button>
      </div>

      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Progress Bar */}
        <div className="px-10 py-6 mb-2">
          <div className="relative flex items-center justify-between w-full">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[33%] h-0.5 bg-blue-600"></div>
            
            <div className="relative flex flex-col items-center gap-2 z-10">
              <span className="text-xs font-bold text-gray-500 absolute -top-6">Created</span>
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white border-2 border-white shadow-sm">
                <Check size={12} strokeWidth={3} />
              </div>
            </div>

            <div className="relative flex flex-col items-center gap-2 z-10">
              <span className="text-xs font-bold text-gray-900 absolute -top-6">Processing</span>
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white border-2 border-white shadow-sm">
                <Check size={12} strokeWidth={3} />
              </div>
            </div>

            <div className="relative flex flex-col items-center gap-2 z-10">
              <span className="text-xs font-bold text-gray-400 absolute -top-6 whitespace-nowrap">Ready For Pickup</span>
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-white border-2 border-white shadow-sm">
                <Check size={12} strokeWidth={3} />
              </div>
            </div>

            <div className="relative flex flex-col items-center gap-2 z-10">
              <span className="text-xs font-bold text-gray-400 absolute -top-6">Completed</span>
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-white border-2 border-white shadow-sm">
                <Check size={12} strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Order Details */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 bg-[#fdfdfd]">
                <div className="flex gap-8 text-xs">
                  <div>
                    <p className="text-gray-500 font-bold mb-1">Order Date</p>
                    <p className="font-bold text-gray-900">{order.orderDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-bold mb-1">Order From</p>
                    <p className="font-bold text-gray-900">{order.orderFrom}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-bold mb-1">PO Reference</p>
                    <p className="font-bold text-gray-900">{order.poReference || '-'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900">Order #: {order.id}</p>
                  <button className="text-blue-600 font-bold text-xs flex items-center gap-1 mt-1 ml-auto hover:underline">
                    Invoices <ChevronDown size={12} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                <div className="flex-1 p-5">
                  <h3 className="font-bold text-gray-900 mb-2">Pick up from</h3>
                  <p className="text-sm font-bold text-blue-600">{order.pickupFrom.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{order.pickupFrom.address}</p>
                  <p className="text-sm text-gray-500 mt-0.5">T: {order.pickupFrom.phone}</p>
                </div>
                <div className="flex-1 p-5">
                  <h3 className="font-bold text-gray-900 mb-2">Expected ETP</h3>
                  <p className="text-sm text-gray-500">{order.expectedETP.date}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{order.expectedETP.note}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-[#fdfdfd]">
                <h3 className="font-bold text-gray-900 text-lg">Order Summary</h3>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-bold">Subtotal</span>
                  <span className="font-bold text-gray-900">${order.summary.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-bold">GST</span>
                  <span className="font-bold text-gray-900">$ {order.summary.gst}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-bold">Amount to Pay</span>
                  <span className="font-bold text-gray-900">${order.summary.amountToPay}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-900 font-bold">Total (incl. GST)</span>
                  <span className="font-bold text-gray-900">${order.summary.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-bold">You've saved</span>
                  <span className="font-bold text-gray-900 bg-yellow-300 px-2 py-0.5 rounded">$ {order.summary.saved}</span>
                </div>
                
                <div className="pt-4 text-center">
                  <p className="text-orange-500 font-bold text-sm mb-3">{order.summary.status}</p>
                  <div className="space-y-2">
                    <button className="w-full bg-[#1a73e8] hover:bg-blue-700 text-white font-bold py-2.5 rounded transition-colors">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-[#fdfdfd]">
            <h3 className="font-bold text-[#1a4a8d]">Processing {order.processingDate}</h3>
          </div>
          <div className="divide-y divide-gray-100 p-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4">
                <div className="flex flex-col items-center gap-1 w-20 shrink-0">
                  <div className="w-16 h-16 border border-gray-200 rounded flex items-center justify-center bg-gray-50 overflow-hidden">
                    <div className="text-[#e2e8f0] font-black italic text-2xl tracking-tighter">OSW</div>
                  </div>
                  <div className="w-10 h-6 border border-gray-200 rounded flex items-center justify-center bg-gray-50 text-gray-400">
                    <ImageIcon size={12} />
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800 leading-tight">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.sku}</p>
                </div>
                
                <div className="w-12 text-center shrink-0">
                  <span className="text-sm font-bold text-gray-800">{item.qty}</span>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-800 relative">
                    {item.price}
                    {/* Watermark overlay */}
                    <span className="absolute inset-0 flex items-center justify-center -rotate-12 opacity-20 pointer-events-none text-[8px] whitespace-nowrap font-bold text-gray-400 tracking-widest uppercase">
                      Viking Group Pty Ltd<br/>eric.tu@client.com.au
                    </span>
                  </p>
                </div>
                
                <div className="w-32 text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900 relative">
                    <span className="text-lg">${item.total.split('.')[0]}</span>
                    <span className="text-xs">.{item.total.split('.')[1]}</span>
                    <span className="text-[10px] font-normal text-gray-500 ml-1">ex GST</span>
                    {/* Watermark overlay */}
                    <span className="absolute inset-0 flex items-center justify-center -rotate-12 opacity-20 pointer-events-none text-[8px] whitespace-nowrap font-bold text-gray-400 tracking-widest uppercase">
                      Viking Group Pty Ltd<br/>eric.tu@client.com.au
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsView;
