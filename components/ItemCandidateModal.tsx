
import React from 'react';
import { LineItem, MatchOption } from '../types';
import { X, CheckCircle2, PackageCheck, Puzzle } from 'lucide-react';

interface ItemCandidateModalProps {
  item: LineItem;
  onClose: () => void;
  onSwap: (candidate: MatchOption) => void;
}

const ItemCandidateModal: React.FC<ItemCandidateModalProps> = ({ item, onClose, onSwap }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg md:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slideUp">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
             <h2 className="text-lg font-black text-slate-800">Similar Products</h2>
             <p className="text-xs text-slate-400 font-bold mt-0.5">Select a replacement for "{item.purchasedName}"</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-800 shadow-sm border border-slate-100 transition-all"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
             {/* Current Selection */}
             <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 opacity-60">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Current Selection</p>
                <div className="flex items-center gap-3">
                    <img src={item.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-white" alt="Current" />
                    <div>
                        <p className="text-sm font-bold text-slate-800">{item.displayName}</p>
                        <p className="text-xs font-mono text-slate-500">{item.itemCode}</p>
                    </div>
                </div>
             </div>

             <div className="relative">
                 <div className="absolute inset-0 flex items-center" aria-hidden="true">
                     <div className="w-full border-t border-slate-200"></div>
                 </div>
                 <div className="relative flex justify-center">
                     <span className="bg-white px-3 text-xs font-black text-slate-400 uppercase tracking-widest">Available Matches</span>
                 </div>
             </div>

             {/* Candidates */}
             <div className="space-y-3">
                 {item.candidates && item.candidates.length > 0 ? (
                     item.candidates.map((cand, idx) => {
                         const isSelected = cand.code === item.itemCode;
                         return (
                            <button 
                                key={idx}
                                onClick={() => {
                                    if (!isSelected) {
                                        onSwap(cand);
                                        onClose();
                                    }
                                }}
                                disabled={isSelected}
                                className={`w-full text-left p-4 rounded-3xl border-2 transition-all group relative overflow-hidden ${
                                    isSelected 
                                    ? 'border-green-500 bg-green-50' 
                                    : 'border-slate-100 bg-white hover:border-blue-500 hover:shadow-lg'
                                }`}
                            >
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                                        <img src={cand.image} className="w-full h-full object-cover" alt={cand.name} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm leading-tight">{cand.name}</h4>
                                                <p className="text-xs font-mono text-slate-400 mt-1">{cand.code}</p>
                                            </div>
                                            <div className={`text-right px-2 py-1 rounded-lg ${isSelected ? 'bg-green-200 text-green-700' : 'bg-blue-50 text-blue-600'}`}>
                                                <p className="text-xs font-black">{cand.score}% Match</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                                                <PackageCheck className="w-3.5 h-3.5" />
                                                Stock: {cand.stock}
                                            </div>
                                            {cand.accessories && cand.accessories.length > 0 && (
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                                                    <Puzzle className="w-3.5 h-3.5" />
                                                    + Accessories
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {isSelected && (
                                    <div className="absolute right-0 bottom-0 bg-green-500 text-white p-2 rounded-tl-2xl">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                )}
                            </button>
                         );
                     })
                 ) : (
                     <div className="text-center p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                         <p className="text-slate-400 font-medium text-sm">No other similar products found.</p>
                     </div>
                 )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCandidateModal;
