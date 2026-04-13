import React, { useState } from 'react';
import { X, HelpCircle, Info } from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  reference: string;
  onCancel: () => void;
  onPay: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, reference, onCancel, onPay }) => {
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMM, setExpiryMM] = useState('');
  const [expiryYY, setExpiryYY] = useState('');
  const [cvv, setCvv] = useState('');

  const formattedAmount = `$${amount.toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Secure Payment</h2>
          <button onClick={onCancel} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Name on Card */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400">Name on Card</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Card Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 flex gap-1">
              <span className="text-red-500">*</span> Card Number (Austrlian Cards Only)
            </label>
            <input 
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Expiry and CVV Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 flex gap-1">
                <span className="text-red-500">*</span> Expiry Date
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="MM"
                  maxLength={2}
                  value={expiryMM}
                  onChange={(e) => setExpiryMM(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-center focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-slate-400 text-lg">/</span>
                <input 
                  type="text"
                  placeholder="YY"
                  maxLength={2}
                  value={expiryYY}
                  onChange={(e) => setExpiryYY(e.target.value)}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-center focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <span className="text-red-500">*</span> CVV <HelpCircle className="w-3 h-3 text-slate-400 ml-0.5" />
              </label>
              <input 
                type="password"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Reference */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 flex gap-1">
              <span className="text-red-500">*</span> Reference
            </label>
            <div className="w-full border border-slate-200 bg-slate-100 rounded-md px-3 py-2 flex items-center gap-2">
              <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-2">
                {reference}
                <X className="w-3 h-3 cursor-pointer hover:text-slate-900" />
              </span>
            </div>
          </div>

          {/* Amount Input (Read-only for now) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 flex gap-1">
              <span className="text-red-500">*</span> Amount
            </label>
            <input 
              type="text"
              readOnly
              value={formattedAmount}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Summary */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center text-sm">
              <span className="text-slate-800">Surcharge (Rate <HelpCircle className="w-3.5 h-3.5 inline text-slate-400 mx-0.5" />) : </span>
              <span className="ml-2 font-bold">-</span>
            </div>
            <div className="flex items-center text-base">
              <span className="font-bold text-slate-900">Total Amount <span className="text-xs font-normal">(Incl. Surcharge)</span>: </span>
              <span className="ml-2 font-black text-slate-900">{formattedAmount}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button 
            onClick={onPay}
            disabled={!cardNumber || !expiryMM || !expiryYY || !cvv}
            className="w-full bg-[#1877F2] text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:grayscale"
          >
            Pay {formattedAmount}
          </button>

          {/* Note */}
          <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
            <Info className="w-3.5 h-3.5" />
            This credit card will not be stored in our system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;