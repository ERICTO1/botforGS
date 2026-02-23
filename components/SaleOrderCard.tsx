
import React from 'react';
import { CustomerInfo, LineItem, SaleOrderMeta } from '../types';
import { FileCheck, Eye, Mail, FileText, AlertCircle } from 'lucide-react';

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
  return (
    <div className={`shadow-xl rounded-[2.5rem] w-full overflow-hidden border animate-slideUp ${
      isDraft ? 'bg-white border-amber-200' : 'bg-slate-900 border-slate-700'
    }`}>
      {/* Header */}
      <div className={`p-6 flex items-center justify-between border-b ${
        isDraft ? 'bg-amber-50 border-amber-100' : 'bg-slate-800/50 border-white/5'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${
            isDraft ? 'bg-amber-100 text-amber-600' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {isDraft ? <AlertCircle className="w-6 h-6" /> : <FileCheck className="w-6 h-6" />}
          </div>
          <div>
            <h3 className={`text-lg font-black tracking-tight ${isDraft ? 'text-amber-950' : 'text-white'}`}>
                {title || (isDraft ? 'Draft Order (Review)' : 'Sale Order Confirmed')}
            </h3>
            <p className={`text-xs font-mono uppercase tracking-wider ${isDraft ? 'text-amber-700/60' : 'text-slate-400'}`}>
                {meta.orderId}
            </p>
          </div>
        </div>
        <div className="text-right">
           <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
               isDraft ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
           }`}>
              {isDraft ? 'Exception Draft' : 'Processing'}
           </span>
        </div>
      </div>

      {/* Body */}
      <div className={`p-6 md:p-8 ${isDraft ? 'bg-white' : 'bg-slate-900'}`}>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className={`text-[10px] uppercase font-black tracking-widest mb-1 ${isDraft ? 'text-slate-400' : 'text-slate-500'}`}>Customer</p>
            <p className={`text-sm font-bold truncate ${isDraft ? 'text-slate-800' : 'text-white'}`}>{info.companyName}</p>
          </div>
          <div>
            <p className={`text-[10px] uppercase font-black tracking-widest mb-1 ${isDraft ? 'text-slate-400' : 'text-slate-500'}`}>Created</p>
            <p className={`text-sm font-bold ${isDraft ? 'text-slate-800' : 'text-white'}`}>{meta.orderTime}</p>
          </div>
          <div>
            <p className={`text-[10px] uppercase font-black tracking-widest mb-1 ${isDraft ? 'text-slate-400' : 'text-slate-500'}`}>Line Items</p>
            <p className={`text-sm font-bold ${isDraft ? 'text-slate-800' : 'text-white'}`}>{items.length} Products</p>
          </div>
          <div>
             <p className={`text-[10px] uppercase font-black tracking-widest mb-1 ${isDraft ? 'text-slate-400' : 'text-slate-500'}`}>Status</p>
             <p className={`text-sm font-bold ${isDraft ? 'text-amber-600' : 'text-white'}`}>
                {isDraft ? 'Pending Admin Review' : 'Sent to Fulfillment'}
             </p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onPreview}
            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all text-sm uppercase tracking-widest shadow-lg ${
                isDraft 
                ? 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20' 
                : 'bg-white text-slate-900 hover:bg-slate-100 shadow-white/10'
            }`}
          >
            <Eye className="w-5 h-5" />
            {isDraft ? 'Download Draft PDF' : 'Preview & Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaleOrderCard;
