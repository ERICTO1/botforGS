
import React from 'react';
import { CustomerInfo, LineItem, SaleOrderMeta, ShippingMethod } from '../types';
import { X, FileDown, Printer } from 'lucide-react';

interface PdfPreviewModalProps {
  meta: SaleOrderMeta;
  info: CustomerInfo;
  items: LineItem[];
  onClose: () => void;
  onDownload: () => void;
}

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ meta, info, items, onClose, onDownload }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Order Preview</h2>
          <div className="flex items-center gap-2">
            <button onClick={onDownload} className="p-2 text-slate-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
              <FileDown className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100">
          <div className="bg-white shadow-md mx-auto min-h-full p-10 text-slate-800 flex flex-col max-w-[210mm]">
            {/* Document Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-3xl font-black text-blue-600 tracking-tight">SALES ORDER</h1>
                <p className="text-sm font-mono text-slate-400 mt-1 uppercase tracking-widest">Confidential</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-500">ORDER NO.</p>
                <p className="text-lg font-black font-mono">{meta.orderId}</p>
                <p className="text-xs text-slate-400 mt-1">{meta.orderTime}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-12 mb-12 border-y border-slate-100 py-8">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Customer Details</h4>
                <div className="space-y-1 text-sm">
                  <p className="font-bold text-slate-900">{info.companyName}</p>
                  <p className="text-slate-600">{info.recipientName || 'No Recipient Name'}</p>
                  <p className="text-slate-600">{info.emailAddress}</p>
                  <p className="text-slate-600">{info.recipientPhone || 'No Phone provided'}</p>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order Specifics</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Method:</span>
                    <span className="font-bold">{info.shippingMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Req. Date:</span>
                    <span className="font-bold">{info.requestedDate}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Address / Warehouse</p>
                    <p className="text-xs italic text-slate-600 leading-tight">
                        {info.shippingMethod === ShippingMethod.DELIVERY ? info.shippingAddress : info.pickupWarehouse}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="pb-3 w-12">#</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3 w-32">Item Code</th>
                    <th className="pb-3 w-16 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="text-sm">
                      <td className="py-4 text-slate-400">{idx + 1}</td>
                      <td className="py-4 font-bold text-slate-800">{item.displayName}</td>
                      <td className="py-4 font-mono text-xs text-slate-500">{item.itemCode}</td>
                      <td className="py-4 text-right font-black">{item.purchasedQty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-slate-900">
              <div className="flex justify-between items-end">
                <div className="max-w-xs">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Notes</p>
                  <p className="text-[10px] leading-relaxed text-slate-500">
                    This is an automated sales draft generated by the AI Sale Admin assistant. 
                    The final pricing and availability will be confirmed by a human representative.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Authorized By</p>
                  <p className="text-xl font-black text-blue-600 italic">SaleAdminBot</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex gap-3">
            <button 
                onClick={onDownload}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
                <FileDown className="w-5 h-5" />
                Download PDF
            </button>
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;
