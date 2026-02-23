
import React from 'react';
import { BatchAnalysisResult, CustomerInfo } from '../types';
import { AlertTriangle, CheckCircle2, ArrowRight, X, AlertCircle } from 'lucide-react';

interface OrderConfirmationModalProps {
  info: CustomerInfo;
  analysis: BatchAnalysisResult;
  onCancel: () => void;
  onConfirm: () => void;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ 
  info, 
  analysis, 
  onCancel, 
  onConfirm 
}) => {
  const validEntries = info.orderEntries.filter(e => analysis.validIds.includes(e.id));
  const exceptionEntries = info.orderEntries.filter(e => analysis.exceptionIds.includes(e.id));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
             <h2 className="text-xl font-black text-slate-800">Review Batch</h2>
             <p className="text-xs text-slate-400 font-bold mt-1">Found {exceptionEntries.length} exceptions in {info.orderEntries.length} orders</p>
          </div>
          <button onClick={onCancel} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-800 shadow-sm border border-slate-100 transition-all"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
            {/* Valid Orders Section */}
            {validEntries.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-xs font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Ready to Confirm ({validEntries.length})
                    </h3>
                    <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 space-y-2">
                        {validEntries.map((entry, idx) => (
                            <div key={entry.id} className="flex items-center justify-between text-sm">
                                <span className="font-bold text-slate-700">Order {idx + 1} ({entry.poNumber || 'Unassigned'})</span>
                                <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full">OK</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Exception Orders Section */}
            {exceptionEntries.length > 0 ? (
                <div className="space-y-3">
                    <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Exceptions Found ({exceptionEntries.length})
                    </h3>
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-3">
                        <p className="text-xs text-amber-800 leading-relaxed mb-2">
                            The following orders contain items with <strong>Low Stock</strong>, <strong>Unknown SKUs</strong>, or <strong>Missing Quantities</strong>.
                        </p>
                        {exceptionEntries.map((entry, idx) => {
                            const detail = analysis.details[entry.id];
                            return (
                                <div key={entry.id} className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-slate-800 text-xs">{entry.poNumber || `Order ${idx + 1}`}</span>
                                        <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">Action Needed</span>
                                    </div>
                                    <ul className="list-disc pl-4 space-y-0.5">
                                        {detail.reasons.map((reason, rIdx) => (
                                            <li key={rIdx} className="text-[10px] text-slate-500 font-medium">{reason}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="bg-green-50 p-6 rounded-3xl text-center border border-green-100">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-sm font-bold text-green-800">All orders look perfect!</p>
                    <p className="text-xs text-green-600 mt-1">Ready to submit to fulfillment system.</p>
                </div>
            )}

            <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start border border-blue-100">
                 <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                 <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Note:</strong> If you proceed, valid orders will be confirmed immediately. Exception orders will be saved as <strong>Drafts</strong> and a notification will be sent to the Sale Admin for manual review.
                 </p>
            </div>
        </div>

        <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 flex flex-col gap-3 shrink-0">
            <button 
                onClick={onConfirm}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                <span>Proceed with Submission</span>
                <ArrowRight className="w-4 h-4" />
            </button>
            <button 
                onClick={onCancel}
                className="w-full bg-white text-slate-500 font-bold py-3 rounded-2xl hover:bg-slate-100 hover:text-slate-800 transition-all border border-slate-200"
            >
                Back to Edit
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
