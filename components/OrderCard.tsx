
import React from 'react';
import { CustomerInfo, LineItem, ShippingMethod, OrderEntry } from '../types';
import { getStatusLabel } from '../services/inventoryService';
import { FileText, Trash2, ImageOff, Pencil, Truck, MapPin, Calendar, Link, ArrowRight, User, Phone, MapPinned, Settings2 } from 'lucide-react';

interface OrderCardProps {
  info: CustomerInfo;
  items: LineItem[];
  onRemoveItem: (id: string) => void;
  onSubmitOrder: () => void;
  onManageOrder: (entry: OrderEntry, initialItemToSwap?: LineItem) => void;
  isSubmitted?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ 
  info, 
  items, 
  onRemoveItem, 
  onSubmitOrder, 
  onManageOrder,
  isSubmitted = false 
}) => {
  const getItemsForPO = (poNumber: string) => items.filter(item => item.poReference === poNumber);

  const renderItem = (item: LineItem, entry: OrderEntry, isChild = false) => {
    const status = getStatusLabel(item.itemStatus);
    const canModify = !item.isAutoAdded && !isSubmitted;

    return (
        <div key={item.id} className={`${isChild ? 'ml-12 border-l-4 border-slate-200 pl-4 mt-2' : 'bg-white p-4 rounded-3xl shadow-sm border border-slate-200 space-y-3 group'}`}>
             <div className="flex gap-4 relative">
                {isChild && (
                    <div className="absolute -left-[29px] top-6 w-5 h-[2px] bg-slate-200"></div>
                )}
                
                <div className={`shrink-0 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 ${isChild ? 'w-12 h-12 bg-slate-50 opacity-80' : 'w-16 h-16 bg-slate-50'}`}>
                    {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <ImageOff className="w-6 h-6 text-slate-300" />}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="min-w-0 pr-2">
                             {isChild && (
                                 <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-wider mb-1">
                                    <Link className="w-2.5 h-2.5" /> Included Accessory
                                 </span>
                             )}
                             <h4 className={`font-bold text-slate-800 leading-tight uppercase tracking-tight truncate ${isChild ? 'text-[11px]' : 'text-xs'}`}>
                                 {item.displayName}
                             </h4>
                             <p className="text-[9px] text-slate-400 font-mono mt-0.5">{item.itemCode}</p>
                        </div>
                        {canModify && (
                            <button onClick={() => onRemoveItem(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors bg-slate-50 rounded-lg shrink-0">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <div className={`text-[8px] px-2 py-0.5 rounded-full font-black border uppercase ${status.color}`}>
                            {status.text}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Qty</span>
                            <span className="text-sm font-black text-slate-800">{item.purchasedQty || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="bg-white shadow-xl rounded-[2.5rem] w-full border border-slate-200 overflow-hidden flex flex-col">
      <div className="p-6 md:p-8 bg-slate-900 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/20"><FileText className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Batch Review</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{info.companyName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-8 bg-slate-50/50 pb-8">
        {info.orderEntries.map((entry, idx) => {
          const poItems = getItemsForPO(entry.poNumber);
          const rootItems = poItems.filter(item => !item.isAccessory);

          return (
            <div key={entry.id} className="space-y-4">
              {/* Summary Header Section */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                 <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-800 text-white flex items-center justify-center rounded-xl text-xs font-black">{idx + 1}</span>
                        <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PO Reference</p>
                             <p className="text-sm font-black text-slate-800">{entry.poNumber || 'Unassigned'}</p>
                        </div>
                    </div>
                    {!isSubmitted && (
                        <button 
                            onClick={() => onManageOrder(entry)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[10px] font-black uppercase tracking-wide transition-colors"
                        >
                            <Settings2 className="w-3 h-3" /> Manage Order
                        </button>
                    )}
                 </div>

                 {/* Logistics Snapshot */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs relative z-10 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="space-y-1">
                        <p className="flex items-center gap-1.5 font-bold text-slate-500">
                            {entry.shippingMethod === ShippingMethod.DELIVERY ? <Truck className="w-3.5 h-3.5"/> : <MapPin className="w-3.5 h-3.5"/>}
                            {entry.shippingMethod}
                        </p>
                        <p className="text-slate-700 pl-5 leading-tight font-medium">
                            {entry.shippingMethod === ShippingMethod.DELIVERY ? entry.shippingAddress : entry.pickupWarehouse}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="flex items-center gap-1.5 font-bold text-slate-500">
                            <Calendar className="w-3.5 h-3.5"/> Requested Date
                        </p>
                        <p className="text-slate-700 pl-5 font-medium">{entry.requestedDate}</p>
                    </div>
                    {entry.shippingMethod === ShippingMethod.DELIVERY && (
                         <div className="col-span-full pt-2 border-t border-slate-200 flex gap-4">
                            <p className="flex items-center gap-1 text-slate-500"><User className="w-3 h-3"/> <span className="text-slate-700 font-bold">{entry.recipientName}</span></p>
                            <p className="flex items-center gap-1 text-slate-500"><Phone className="w-3 h-3"/> <span className="text-slate-700 font-bold">{entry.recipientPhone}</span></p>
                         </div>
                    )}
                    {entry.shippingMethod === ShippingMethod.PICKUP && (
                        <div className="col-span-full pt-2 border-t border-slate-200">
                           <p className="flex items-center gap-1 text-slate-500"><MapPinned className="w-3 h-3"/> Slot: <span className="text-slate-700 font-bold">{entry.pickupTimeSlot || 'Any Time'}</span></p>
                        </div>
                    )}
                 </div>
              </div>
              
              <div className="flex items-center justify-between px-2">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Product List</h4>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {poItems.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                        <p className="text-xs text-slate-400 font-bold">No items listed. Type in chat to add products.</p>
                    </div>
                ) : (
                    rootItems.map((item) => {
                        const children = poItems.filter(child => child.parentId === item.id);
                        return (
                            <React.Fragment key={item.id}>
                                {renderItem(item, entry, false)}
                                {children.map(child => renderItem(child, entry, true))}
                            </React.Fragment>
                        );
                    })
                )}
              </div>
            </div>
          );
        })}

        <div className="pt-6 border-t border-slate-200">
            <button 
            onClick={onSubmitOrder}
            disabled={items.length === 0}
            className="w-full bg-green-600 text-white font-black py-5 rounded-[1.8rem] shadow-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-widest text-sm flex items-center justify-center gap-2 active:scale-95"
            >
            <span>Confirm & Submit</span>
            <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
