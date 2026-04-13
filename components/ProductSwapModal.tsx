import React from 'react';
import { X, ChevronLeft, Sparkles, ImageOff } from 'lucide-react';
import { LineItem, MatchOption } from '../types';

interface ProductSwapModalProps {
  item: LineItem;
  onClose: () => void;
  onSwapItem: (itemId: string, candidate: MatchOption) => void;
}

const ProductSwapModal: React.FC<ProductSwapModalProps> = ({ 
  item, 
  onClose, 
  onSwapItem 
}) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn p-0 md:p-4">
      <div className="bg-white w-full max-w-lg md:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white shrink-0">
            <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
                <h3 className="text-sm font-bold text-slate-800">Swap Product</h3>
                <p className="text-[10px] text-slate-400 font-bold truncate max-w-[250px]">Replacing: {item.purchasedName}</p>
            </div>
        </div>

        {/* Current Item Display */}
        <div className="p-6 bg-white border-b border-slate-100 shrink-0">
            <div className="flex gap-4 items-center">
                <div className={`w-16 h-16 rounded-xl border p-1 flex-shrink-0 overflow-hidden ${item.itemStatus === 'UNKNOWN_ITEM' ? 'border-orange-200 bg-orange-50/50' : 'border-slate-200 bg-white'}`}>
                    {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-contain" /> : <ImageOff className={`w-6 h-6 mx-auto mt-4 ${item.itemStatus === 'UNKNOWN_ITEM' ? 'text-orange-300' : 'text-slate-300'}`} />}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className={`text-sm font-bold leading-snug mb-1 ${item.itemStatus === 'UNKNOWN_ITEM' ? 'text-orange-500' : 'text-slate-900'}`}>{item.displayName}</h4>
                    {item.itemStatus !== 'UNKNOWN_ITEM' && <p className="text-xs text-slate-400 font-mono">{item.itemCode || '---'}</p>}
                </div>
            </div>
        </div>

        {/* Recommended Products Section */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Recommended Matches</h3>
            </div>
            
            <div className="space-y-3">
                {/* Hardcoded Recommended Item */}
                <button 
                    onClick={() => {
                        // Hardcoded match swap
                        onSwapItem(item.id, {
                            code: 'SOL-JK-545W',
                            name: 'Jinko Tiger Neo 545W Panel',
                            stock: 100,
                            image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=200&h=200',
                            score: 95,
                            price: 210.00
                        });
                        onClose();
                    }}
                    className="w-full text-left p-4 rounded-2xl border-2 border-transparent bg-white shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
                >
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 p-1">
                            <img src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=200&h=200" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">Jinko Tiger Neo 545W Panel</h4>
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-mono text-slate-400">SOL-JK-545W</p>
                                <p className="text-sm font-black text-blue-600">$210.00</p>
                            </div>
                        </div>
                    </div>
                </button>

                {/* Hardcoded Recommended Item 2 */}
                <button 
                    onClick={() => {
                        onSwapItem(item.id, {
                            code: 'SOL-PNL-450W',
                            name: 'Longi Hi-MO 5 450W Mono Panel',
                            stock: 200,
                            image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=200&h=200',
                            score: 85,
                            price: 185.50
                        });
                        onClose();
                    }}
                    className="w-full text-left p-4 rounded-2xl border-2 border-transparent bg-white shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
                >
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100 p-1">
                            <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=200&h=200" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">Longi Hi-MO 5 450W Mono Panel</h4>
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-mono text-slate-400">SOL-PNL-450W</p>
                                <p className="text-sm font-black text-blue-600">$185.50</p>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSwapModal;