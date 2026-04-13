import React from 'react';
import { CustomerInfo, LineItem, ShippingMethod, OrderEntry } from '../types';
import { getStatusLabel } from '../services/inventoryService';
import { FileText, Trash2, ImageOff, Pencil, Truck, MapPin, Calendar, Link, ArrowRight, User, Phone, MapPinned, Settings2, Package, Sparkles, Clock } from 'lucide-react';

interface OrderCardProps {
  info: CustomerInfo;
  items: LineItem[];
  onRemoveItem: (id: string) => void;
  onSubmitOrder: () => void;
  onManageOrder: (entry: OrderEntry) => void;
  onSwapItem: (item: LineItem) => void;
  onChangeShippingMethod?: (entryId: string, method: ShippingMethod) => void;
  isSubmitted?: boolean;
  pendingPayment?: boolean;
  paymentTimeLeft?: number;
}

const OrderCard: React.FC<OrderCardProps> = ({ 
  info, 
  items, 
  onRemoveItem, 
  onSubmitOrder, 
  onManageOrder,
  onSwapItem,
  onChangeShippingMethod,
  isSubmitted = false,
  pendingPayment = false,
  paymentTimeLeft = 0
}) => {
  const getItemsForPO = (poNumber: string) => items.filter(item => item.poReference === poNumber);

  return (
    <div className="w-full flex flex-col relative">
      {pendingPayment && (
        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-3xl pb-16">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center max-w-sm text-center border border-orange-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-400"></div>
                <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4 ring-8 ring-orange-50/50">
                    <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Pending Payment</h3>
                <p className="text-sm text-slate-500 mb-5 px-4">
                    This order is locked while waiting for payment. Please complete it within the time limit.
                </p>
                <div className="text-4xl font-black text-orange-500 tracking-wider font-mono">
                    {Math.floor(paymentTimeLeft / 60).toString().padStart(2, '0')}:{(paymentTimeLeft % 60).toString().padStart(2, '0')}
                </div>
                <button 
                    onClick={onSubmitOrder}
                    className="mt-8 w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95"
                >
                    Resume Payment
                </button>
            </div>
        </div>
      )}
      <div className={`space-y-6 pb-8 transition-opacity duration-300 ${pendingPayment ? 'pointer-events-none opacity-40 grayscale-[0.5]' : ''}`}>
        {info.orderEntries.map((entry, idx) => {
          const poItems = getItemsForPO(entry.poNumber);
          const rootItems = poItems.filter(item => !item.isAccessory);

          return (
            <div key={entry.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group">
              {/* Summary Header Section (Logistics) */}
              <div className="p-5 border-b border-slate-100">
                 <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-800 text-white flex items-center justify-center rounded-xl text-xs font-black">{idx + 1}</span>
                        <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Project Name</p>
                             <p className="text-sm font-black text-slate-800">{entry.projectName || (entry.shippingAddress ? entry.shippingAddress.split(',')[0] : 'Unknown Project')} <span className="text-slate-400 text-xs font-medium ml-1">#{entry.poNumber || 'Unassigned'}</span></p>
                        </div>
                    </div>
                    {!isSubmitted && (
                        <button 
                            onClick={() => onManageOrder(entry)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[10px] font-black uppercase tracking-wide transition-colors"
                        >
                            <Pencil className="w-3 h-3" /> Edit
                        </button>
                    )}
                 </div>

                 {/* Logistics Snapshot */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs relative z-10 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    {/* Column 1: Method Toggle & Warehouse/Address */}
                    <div className="space-y-2">
                        <div className="flex bg-white p-1 rounded-lg w-fit border border-slate-200 shadow-sm">
                            <button 
                                onClick={() => onChangeShippingMethod && onChangeShippingMethod(entry.id, ShippingMethod.DELIVERY)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-colors ${entry.shippingMethod === ShippingMethod.DELIVERY ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Truck className="w-3 h-3" /> Delivery
                            </button>
                            <button 
                                onClick={() => onChangeShippingMethod && onChangeShippingMethod(entry.id, ShippingMethod.PICKUP)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-colors ${entry.shippingMethod === ShippingMethod.PICKUP ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <MapPin className="w-3 h-3" /> Pickup
                            </button>
                        </div>
                        
                        {entry.shippingMethod === ShippingMethod.DELIVERY ? (
                            <div className="space-y-1 mt-2">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Shipping Address</p>
                                <p className="text-slate-700 leading-tight font-medium">{entry.shippingAddress || 'No address provided'}</p>
                                <p className="text-slate-700 font-medium">{entry.recipientName || '-'} • {entry.recipientPhone || '-'}</p>
                            </div>
                        ) : (
                            <div className="space-y-1 mt-2">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Pick Up from</p>
                                <p className="text-slate-700 leading-tight font-medium">{entry.pickupWarehouse || 'Please select a warehouse...'}</p>
                            </div>
                        )}
                    </div>

                    {/* Column 2: Date & PO */}
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <p className="flex items-center gap-1.5 font-bold text-slate-500">
                                <Calendar className="w-3.5 h-3.5" /> {entry.shippingMethod === ShippingMethod.PICKUP ? 'ETP' : 'ETA'}
                            </p>
                            <p className="text-slate-700 pl-5 font-medium">{entry.requestedDate || 'Not set'}</p>
                        </div>

                        <div className="space-y-1 border-t border-slate-200 pt-2">
                            <p className="flex items-center gap-1.5 font-bold text-slate-500 mb-1">
                                <FileText className="w-3.5 h-3.5" /> PO Reference
                            </p>
                            <p className="text-slate-700 pl-5 font-medium">{entry.poNumber || 'Unassigned'}</p>
                        </div>
                    </div>

                    {/* Row 3: Ship From (Delivery) or Slot (Pickup) */}
                    <div className="col-span-full pt-2 border-t border-slate-200">
                        {entry.shippingMethod === ShippingMethod.DELIVERY ? (
                            <div className="flex items-center justify-between">
                                <p className="flex items-center gap-1 text-slate-500 text-[11px]">
                                    <MapPinned className="w-3 h-3" /> Ship from: <span className="text-slate-700 font-bold ml-1">{entry.shipFromWarehouse || 'Not set'}</span>
                                </p>
                                {entry.deliveryOption && (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border border-blue-200">
                                        {entry.deliveryOption}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <p className="flex items-center gap-1 text-slate-500 text-[11px]">
                                <MapPinned className="w-3 h-3" /> Slot: <span className="text-slate-700 font-bold ml-1">{entry.pickupTimeSlot || 'Any Time'}</span>
                            </p>
                        )}
                    </div>
                 </div>
              </div>
              
              {/* NEW PRODUCT LIST DESIGN */}
              <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                         <Package className="w-5 h-5 text-slate-800" />
                         <h4 className="text-base font-bold text-slate-800">Products list</h4>
                         <span className="text-slate-400 text-sm">{poItems.length}</span>
                     </div>
                     <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[10px] font-black uppercase tracking-wide transition-colors">
                         <Link className="w-3 h-3" />
                         from OSW
                     </button>
                  </div>

                  <div className="flex flex-col">
                    {poItems.length === 0 ? (
                        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                            <p className="text-xs text-slate-400 font-bold">No items listed. Type in chat to add products.</p>
                        </div>
                    ) : (
                        <>
                            {rootItems.map((item, index) => {
                            const children = poItems.filter(child => child.parentId === item.id);
                            const isFirst = index === 0;

                            return (
                                <div key={item.id} className={`pt-4 pb-2 ${!isFirst ? 'border-t border-dashed border-slate-200 mt-4' : ''}`}>
                                    {/* Purchased Name */}
                                    <div className="flex items-center justify-between text-sm mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <Sparkles className="w-4 h-4 text-teal-500" />
                                            <span className="text-slate-500">Product {index + 1}:</span>
                                            <span className="font-bold text-slate-900">"{item.purchasedName}"</span>
                                        </div>
                                        {!isSubmitted && (
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => onSwapItem(item)}
                                                    className="text-slate-400 hover:text-blue-600 transition-colors"
                                                    title="Edit Product"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Remove Product"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Main Item */}
                                    <div className="flex gap-4 items-center">
                                        <div className={`w-20 h-20 rounded-lg border p-1 flex-shrink-0 overflow-hidden ${item.itemStatus === 'UNKNOWN_ITEM' ? 'border-orange-200 bg-orange-50/50' : 'border-slate-200 bg-white'}`}>
                                            {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-contain" /> : <ImageOff className={`w-8 h-8 mx-auto mt-5 ${item.itemStatus === 'UNKNOWN_ITEM' ? 'text-orange-300' : 'text-slate-300'}`} />}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className={`text-[15px] leading-snug ${item.itemStatus === 'UNKNOWN_ITEM' ? 'text-orange-500 font-medium' : 'text-slate-900'}`}>{item.displayName || 'Cannot match this product'}</h4>
                                                    {item.itemStatus !== 'UNKNOWN_ITEM' && <p className="text-sm text-slate-400 mb-1">{item.itemCode || '---'}</p>}
                                                </div>
                                                <div className="flex flex-col items-end shrink-0 ml-4">
                                                    <div className="flex items-center">
                                                        <span className="text-slate-400 text-sm mr-1">Qty:</span>
                                                        <span className="text-orange-500 font-bold">{item.purchasedQty || '?'}</span>
                                                    </div>
                                                    {item.unitPrice !== undefined && (
                                                        <div className="text-[11px] text-slate-400 mt-1">
                                                            ${item.unitPrice.toFixed(2)}/ea
                                                        </div>
                                                    )}
                                                    {item.totalPrice !== undefined && (
                                                        <div className="text-sm font-black text-slate-700 mt-0.5">
                                                            ${item.totalPrice.toFixed(2)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mt-1">
                                                {item.itemStatus === 'QTY_MISSING' && (
                                                    <span className="text-[11px] px-2 py-0.5 rounded text-red-500 bg-red-50 border border-red-100 font-medium">Enter QTY</span>
                                                )}
                                                {item.itemStatus === 'CHECK_REQUIRED' && (
                                                    <span className="text-[11px] px-2 py-0.5 rounded text-red-500 bg-red-50 border border-red-100 font-medium">Out of Stock</span>
                                                )}
                                                {item.itemStatus === 'UNKNOWN_ITEM' && (
                                                    <span className="text-[11px] px-2 py-0.5 rounded text-orange-600 bg-orange-100 border border-orange-200 font-medium">Unmatched</span>
                                                )}
                                                {item.itemStatus === 'AVAILABLE' && (
                                                    <span className="text-[11px] px-2 py-0.5 rounded text-teal-600 bg-teal-50 border border-teal-100 font-medium">Available</span>
                                                )}
                                                
                                                {item.stockAvailable !== undefined && item.itemStatus !== 'AVAILABLE' && item.itemStatus !== 'UNKNOWN_ITEM' && (
                                                    <span className="text-green-500 text-[12px] font-medium">Available stock: {item.stockAvailable}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Unmatched State Notice */}
                                    {item.itemStatus === 'UNKNOWN_ITEM' && (
                                        <div className="mt-3 bg-orange-50 border border-orange-100 rounded-xl p-3 flex justify-between items-center ml-[5.5rem]">
                                            <p className="text-xs text-orange-700 font-medium">This product couldn't be matched. Please update it manually.</p>
                                            <button 
                                                onClick={() => onSwapItem(item)}
                                                className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-white border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                                            >
                                                Match Manually
                                            </button>
                                        </div>
                                    )}

                                    {/* Accessories */}
                                    {children.length > 0 && (
                                        <div className="mt-4 pl-1">
                                            <p className="text-slate-400 text-[13px] mb-3">Accessories:</p>
                                            <div className="space-y-3">
                                                {children.map(child => (
                                                    <div key={child.id} className="flex gap-3 items-center">
                                                        <div className="w-14 h-14 rounded-lg border border-slate-200 p-1 flex-shrink-0 bg-white overflow-hidden">
                                                            {child.imageUrl ? <img src={child.imageUrl} className="w-full h-full object-contain" /> : <ImageOff className="w-6 h-6 text-slate-300 mx-auto mt-3" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0 flex justify-between items-center">
                                                            <div>
                                                                <h4 className="text-[14px] text-slate-800 leading-snug">{child.displayName}</h4>
                                                                <p className="text-[12px] text-slate-400 mb-1">{child.itemCode}</p>
                                                                <span className="text-[10px] px-2 py-0.5 rounded text-teal-600 bg-teal-50 border border-teal-100 font-medium">Available</span>
                                                            </div>
                                                            <div className="flex flex-col items-end shrink-0 ml-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex items-center">
                                                                        <span className="text-slate-400 text-[13px] mr-1">Qty:</span>
                                                                        <span className="text-slate-800 font-bold">{child.purchasedQty || 0}</span>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => onRemoveItem(child.id)}
                                                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                        title="Remove accessory"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                                {child.unitPrice !== undefined && (
                                                                    <div className="text-[10px] text-slate-400 mt-1">
                                                                        ${child.unitPrice.toFixed(2)}/ea
                                                                    </div>
                                                                )}
                                                                {child.totalPrice !== undefined && (
                                                                    <div className="text-[13px] font-black text-slate-700 mt-0.5">
                                                                        ${child.totalPrice.toFixed(2)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        
                        {/* Order Total Section */}
                         <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-end gap-6">
                             <div>
                                 <button 
                                 onClick={() => {
                                     // Prevent submission if there are UNKNOWN_ITEMs
                                     const hasUnknown = poItems.some(item => item.itemStatus === 'UNKNOWN_ITEM');
                                     if (hasUnknown) {
                                         alert("You cannot submit an order with unmatched items. Please remove or match them first.");
                                         return;
                                     }
                                     onSubmitOrder();
                                 }}
                                 disabled={items.length === 0}
                                 className="bg-green-600 text-white font-black px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95"
                                 >
                                 <span>Confirm & Submit</span>
                                 <ArrowRight className="w-4 h-4" />
                                 </button>
                             </div>
                             <div className="flex flex-col gap-2 w-48">
                                 <div className="flex justify-between items-center text-slate-500">
                                     <span className="text-sm font-medium">Subtotal</span>
                                     <span className="font-bold">${poItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0).toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-slate-500">
                                     <span className="text-sm font-medium">Delivery Fee</span>
                                     <span className="font-bold">$50.00</span>
                                 </div>
                                 <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-100">
                                     <span className="text-sm font-medium">GST (10%)</span>
                                     <span className="font-bold">${(poItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0) * 0.1).toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between items-end mt-1">
                                     <div className="text-left">
                                         <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Total</p>
                                         <p className="text-xs font-bold text-slate-500">{poItems.reduce((acc, item) => acc + (item.purchasedQty || 0), 0)} items</p>
                                     </div>
                                     <div className="text-right">
                                         <p className="text-2xl font-black text-slate-900 tracking-tight">
                                             ${(poItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0) * 1.1 + 50).toFixed(2)}
                                         </p>
                                     </div>
                                 </div>
                             </div>
                         </div>
                         </>
                     )}
                   </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderCard;