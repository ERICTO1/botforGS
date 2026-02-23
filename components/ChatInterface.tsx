
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LineItem, CustomerInfo, SaleOrderMeta, ShippingMethod, MessageComponentType, OrderEntry, MatchOption, BatchAnalysisResult, ItemStatus, ProjectData } from '../types';
import { Send, Paperclip, Bot, User, Loader2, FileUp, RotateCcw, X, Quote, Sparkles, Keyboard, MapPin } from 'lucide-react';
import { parseUserMessage } from '../services/geminiService';
import { enrichLineItem } from '../services/inventoryService';
import InfoForm from './InfoForm';
import OrderCard from './OrderCard';
import SaleOrderCard from './SaleOrderCard';
import PdfPreviewModal from './PdfPreviewModal';
import OrderDetailsModal from './OrderDetailsModal';
import OrderConfirmationModal from './OrderConfirmationModal';

interface ChatInterfaceProps {
  defaultInfo: Partial<CustomerInfo>;
  customerInfo: CustomerInfo | null;
  lineItems: LineItem[];
  selectedProjects?: ProjectData[];
  onInfoSubmit: (data: CustomerInfo) => void;
  onItemsExtracted: (items: LineItem[]) => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, qty: number) => void;
  onDownloadPdf: (meta: SaleOrderMeta) => void;
  onResetAll: () => void;
  onUpdateOrderEntry?: (entryId: string, updates: Partial<OrderEntry>) => void;
  onSwapItem?: (itemId: string, candidate: MatchOption) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  defaultInfo, 
  customerInfo, 
  lineItems,
  selectedProjects,
  onInfoSubmit, 
  onItemsExtracted,
  onRemoveItem,
  onUpdateItem, 
  onDownloadPdf,
  onResetAll,
  onUpdateOrderEntry,
  onSwapItem
}) => {
  const getInitialMessages = (): ChatMessage[] => {
    // If we have selected projects from dashboard, show them for confirmation
    if (selectedProjects && selectedProjects.length > 0) {
        return [
            {
                id: 'welcome-projects',
                role: 'assistant',
                content: `I see you've selected **${selectedProjects.length} projects** for ordering. Please confirm if you'd like to proceed with these locations.`,
                timestamp: Date.now(),
            },
            {
                id: 'project-selection',
                role: 'assistant',
                content: '',
                componentType: 'PROJECT_SELECTION',
                timestamp: Date.now(),
            }
        ];
    }

    // If we have data on load, show the summary immediately
    if (customerInfo && lineItems.length > 0) {
      return [
        {
          id: 'welcome',
          role: 'assistant',
          content: `Welcome back! I've loaded your draft for **${customerInfo.companyName}**. Review the combined list below.`,
          timestamp: Date.now(),
        },
        {
          id: 'initial-summary',
          role: 'assistant',
          content: '',
          componentType: 'SUMMARY',
          timestamp: Date.now(),
        }
      ];
    }
    
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I can help you process a new sales order. Please upload a PO file or describe your order.',
        timestamp: Date.now(),
      }
    ];
  };

  const [isInfoConfirmed, setIsInfoConfirmed] = useState(!!customerInfo);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages());
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewMeta, setPreviewMeta] = useState<SaleOrderMeta | null>(null);
  
  // Validation & Analysis State
  const [analysisResult, setAnalysisResult] = useState<BatchAnalysisResult | null>(null);

  // Form Defaults State - Allows pre-filling form after upload/chat analysis
  const [formDefaults, setFormDefaults] = useState<Partial<CustomerInfo>>(defaultInfo);
  const [hasShownForm, setHasShownForm] = useState(false);

  // New State for "Replying To" context
  const [replyingToItem, setReplyingToItem] = useState<LineItem | null>(null);
  const [replyingToOrder, setReplyingToOrder] = useState<OrderEntry | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Unified Order Modal State
  const [activeOrderModal, setActiveOrderModal] = useState<{
      entry: OrderEntry;
      initialItemToSwap?: LineItem;
  } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, lineItems.length]);

  const handleReset = () => {
    if (!isOrderSubmitted && lineItems.length > 0) {
      if (!window.confirm("Are you sure you want to discard this draft and start a new order?")) {
        return;
      }
    }
    
    setIsOrderSubmitted(false);
    setIsInfoConfirmed(false);
    setHasShownForm(false);
    setFormDefaults(defaultInfo);
    setAnalysisResult(null);
    setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Hello! I can help you process a new sales order. Please upload a PO file or describe your order.',
          timestamp: Date.now(),
        }
    ]);
    setInputText('');
    setSelectedImage(null);
    setReplyingToItem(null);
    setReplyingToOrder(null);
    onResetAll();
  };

  const handleFormSubmit = async (data: CustomerInfo) => {
      // Deprecated in this version but kept for type safety if needed
      onInfoSubmit(data);
  };

  const handleSimulateUpload = () => {
    if (isLoading || isOrderSubmitted) return;
    
    setIsLoading(true);
    setTimeout(() => {
        let orderEntries: OrderEntry[] = [];
        let isProjectSelection = false;

        if (selectedProjects && selectedProjects.length > 0) {
            isProjectSelection = true;
            orderEntries = selectedProjects.map((project) => ({
                id: crypto.randomUUID(),
                poNumber: `PO-${new Date().getFullYear()}-${project.id.padStart(3, '0')}`,
                productDescription: '10x Jinko Tiger Panels, 5x Growatt Inverters',
                shippingMethod: ShippingMethod.DELIVERY,
                requestedDate: '2025-06-15',
                recipientName: project.user || 'Unknown Recipient',
                recipientPhone: '555-0100',
                shippingAddress: project.address
            }));
        } else {
             orderEntries = [
              {
                id: crypto.randomUUID(),
                poNumber: 'PO-2025-ALPHA',
                productDescription: '10x Jinko Tiger Panels, 5x Growatt Inverters',
                shippingMethod: ShippingMethod.DELIVERY,
                requestedDate: '2025-06-15',
                recipientName: 'Alice Logistics',
                recipientPhone: '555-0100',
                shippingAddress: '123 Solar Blvd, Los Angeles, CA 90001'
              }
            ];
        }

        const mockCustomerInfo: CustomerInfo = {
            companyName: 'GreenPower Logistics LLC',
            emailAddress: 'procurement@example.com',
            orderEntries: orderEntries
        };
        
        onInfoSubmit(mockCustomerInfo);
        setIsInfoConfirmed(true);

        let allEnrichedItems: LineItem[] = [];
        
        orderEntries.forEach(entry => {
             const mockRawItems = [
                { purchasedName: 'Longi Hi-MO 5 450W', purchasedQty: 10 }, 
                { purchasedName: 'Growatt 5kW Inverter', purchasedQty: 2 }, 
            ];
            
            const enriched = mockRawItems.map(raw => {
                const item = enrichLineItem(raw);
                item.poReference = entry.poNumber;
                return item;
            });
            allEnrichedItems = [...allEnrichedItems, ...enriched];
        });
        
        onItemsExtracted(allEnrichedItems);

        setMessages(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                role: 'user',
                content: isProjectSelection 
                    ? `Confirmed selection of ${selectedProjects!.length} projects.`
                    : '📂 Uploaded: purchase_order_scan.pdf',
                timestamp: Date.now()
            },
            {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: isProjectSelection
                    ? `I've created **${orderEntries.length} orders** for the selected projects and populated them with standard equipment.`
                    : `📂 **File Processed:** "purchase_order_scan.pdf"\n\nI've extracted the order details for **${mockCustomerInfo.companyName}**.`,
                timestamp: Date.now(),
            },
            {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: '',
                componentType: 'SUMMARY',
                timestamp: Date.now(),
            }
        ]);
        setIsLoading(false);
    }, 1500);
  };

  // --- EXCEPTION DRAFT LOGIC ---
  const analyzeBatch = (): BatchAnalysisResult => {
      const validIds: string[] = [];
      const exceptionIds: string[] = [];
      const details: Record<string, { status: 'VALID' | 'EXCEPTION'; reasons: string[] }> = {};

      if (!customerInfo) return { validIds: [], exceptionIds: [], details: {} };

      customerInfo.orderEntries.forEach(entry => {
          const entryItems = lineItems.filter(i => i.poReference === entry.poNumber);
          const reasons: string[] = [];
          
          if (entryItems.length === 0) {
              reasons.push("No items added to this order.");
          }

          entryItems.forEach(item => {
              if (item.itemStatus === ItemStatus.CHECK_REQUIRED) reasons.push(`Low Stock: ${item.displayName}`);
              if (item.itemStatus === ItemStatus.UNKNOWN_ITEM) reasons.push(`Unknown Item: ${item.displayName}`);
              if (item.itemStatus === ItemStatus.QTY_MISSING) reasons.push(`Missing Qty: ${item.displayName}`);
          });

          if (reasons.length > 0) {
              exceptionIds.push(entry.id);
              details[entry.id] = { status: 'EXCEPTION', reasons };
          } else {
              validIds.push(entry.id);
              details[entry.id] = { status: 'VALID', reasons: [] };
          }
      });

      return { validIds, exceptionIds, details };
  };

  const handleInitialSubmit = () => {
    if (isOrderSubmitted) return;
    
    // Run Validation
    const analysis = analyzeBatch();
    
    // If we have exceptions (or explicit errors), we show the confirmation modal
    if (analysis.exceptionIds.length > 0) {
        setAnalysisResult(analysis);
    } else {
        // If everything is perfect, proceed directly
        handleFinalizeSubmission(analysis);
    }
  };

  const handleFinalizeSubmission = (analysis?: BatchAnalysisResult) => {
      setAnalysisResult(null); // Close modal if open
      setIsLoading(true);

      // Use provided analysis or re-run it
      const finalAnalysis = analysis || analyzeBatch();
      const hasExceptions = finalAnalysis.exceptionIds.length > 0;

      setTimeout(() => {
        const orderIdBase = `SO-${new Date().getFullYear()}`;
        const orderTime = new Date().toLocaleString();
        
        setIsOrderSubmitted(true);

        const newMessages: ChatMessage[] = [];

        // 1. Success Message
        if (hasExceptions) {
            newMessages.push({
                id: crypto.randomUUID(),
                role: 'assistant',
                content: `⚠️ **Partial Submission:**\nI've confirmed ${finalAnalysis.validIds.length} orders. However, ${finalAnalysis.exceptionIds.length} orders have been flagged as **Drafts** due to inventory/data issues. Please review below.`,
                timestamp: Date.now(),
            });
        } else {
            newMessages.push({
                id: crypto.randomUUID(),
                role: 'assistant',
                content: "✅ **Sales Order Generated:** Your order has been successfully created. A sales admin will contact you shortly. Please check your email for further details.",
                timestamp: Date.now(),
            });
        }

        // 2. Confirmed Order Cards (for each valid entry)
        finalAnalysis.validIds.forEach((entryId, index) => {
            const entry = customerInfo?.orderEntries.find(e => e.id === entryId);
            const poNumber = entry?.poNumber;
            
            newMessages.push({
                id: crypto.randomUUID(),
                role: 'assistant',
                content: '',
                componentType: 'SALE_ORDER',
                orderMeta: { 
                    orderId: `${orderIdBase}-${index + 1}`, 
                    orderTime,
                    poNumber: poNumber
                },
                timestamp: Date.now() + (index * 50),
            });
        });

        // 3. Draft/Exception Order Cards (for each exception entry)
        finalAnalysis.exceptionIds.forEach((entryId, index) => {
            const entry = customerInfo?.orderEntries.find(e => e.id === entryId);
            const poNumber = entry?.poNumber;

            newMessages.push({
                id: crypto.randomUUID(),
                role: 'assistant',
                content: '',
                componentType: 'SALE_ORDER',
                orderMeta: { 
                    orderId: `${orderIdBase}-DRAFT-${index + 1}`, 
                    orderTime,
                    poNumber: poNumber
                },
                timestamp: Date.now() + 100 + (index * 50),
            });
        });

        setMessages(prev => [...prev, ...newMessages]);
        setIsLoading(false);
      }, 1200);
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading || isOrderSubmitted) return;

    const userText = inputText;
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    // If this is the first interaction (no customer info yet), we mock the initial setup
    if (!customerInfo) {
        setTimeout(() => {
            // MOCK DATA - Directly apply without confirmation form
            const mockCustomerInfo: CustomerInfo = {
                companyName: 'GreenPower Logistics LLC',
                emailAddress: 'procurement@example.com',
                orderEntries: [
                  {
                    id: crypto.randomUUID(),
                    poNumber: 'PO-2025-ALPHA',
                    productDescription: userText || 'Solar Panels and Inverters',
                    shippingMethod: ShippingMethod.DELIVERY,
                    requestedDate: '2025-06-15',
                    recipientName: 'Alice Logistics',
                    recipientPhone: '555-0100',
                    shippingAddress: '123 Solar Blvd, Los Angeles, CA 90001'
                  }
                ]
            };
            
            onInfoSubmit(mockCustomerInfo);
            setIsInfoConfirmed(true);

            // Mock items based on text or just generic mock
            const mockRawItems = [
                { purchasedName: 'Jinko Tiger 450W', purchasedQty: 10 }, 
                { purchasedName: 'Sungrow 5kW Inverter', purchasedQty: 2 }, 
            ];

            const enrichedItems = mockRawItems.map(raw => {
                const item = enrichLineItem(raw);
                item.poReference = mockCustomerInfo.orderEntries[0].poNumber;
                return item;
            });
            
            onItemsExtracted(enrichedItems);

            setMessages(prev => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'user',
                    content: userText,
                    image: selectedImage || undefined,
                    timestamp: Date.now()
                },
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: `I've analyzed your request and set up the order for **${mockCustomerInfo.companyName}**.`,
                    timestamp: Date.now()
                },
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: '',
                    componentType: 'SUMMARY',
                    timestamp: Date.now()
                }
            ]);
            setIsLoading(false);
        }, 1000);
        return;
    }

    // Normal flow for subsequent messages (adding/modifying items)
    let contentToSend = userText;
    if (replyingToItem) {
        contentToSend = `[Context: Replacing "${replyingToItem.purchasedName}"] ${userText}`;
    } else if (replyingToOrder) {
        contentToSend = `[Context: Adding items to Order "${replyingToOrder.poNumber}"] ${userText}`;
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: contentToSend,
      image: selectedImage || undefined,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    const contextItemName = replyingToItem?.purchasedName;
    const targetOrderPO = replyingToOrder?.poNumber;
    setReplyingToItem(null); 
    setReplyingToOrder(null);

    try {
      // We still use the real parser for subsequent interactions if available, 
      // or we could mock this too. The user said "use mock data directly" for the initial flow.
      // Let's assume we can try to parse real text here, but if it fails/returns empty, we could fallback.
      // For now, I'll use the existing parseUserMessage which might be real.
      const extractedRaw = await parseUserMessage(userMsg.content, userMsg.image, contextItemName);
      
      if (extractedRaw.length > 0) {
        const enrichedItems = extractedRaw.map(raw => {
            const item = enrichLineItem(raw);
            if (targetOrderPO) {
                item.poReference = targetOrderPO;
            }
            return item;
        });
        onItemsExtracted(enrichedItems);
        
        const botMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Processed your request. Extracted ${enrichedItems.length} items/updates.`,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, botMsg]);

        setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: '',
            componentType: 'SUMMARY',
            timestamp: Date.now(),
        }]);

      } else {
        setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: "Sorry, I couldn't identify those products. Could you list them more clearly?",
            timestamp: Date.now(),
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Error processing the request.",
        isError: true,
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        // Automatically trigger upload simulation
        handleSimulateUpload();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualModification = (item: LineItem) => {
      setReplyingToItem(item);
      setActiveOrderModal(null);
      setTimeout(() => {
          if (inputRef.current) {
              inputRef.current.focus();
          }
      }, 100);
  };

  const handleAddProductRequest = () => {
      if (activeOrderModal) {
          setReplyingToOrder(activeOrderModal.entry);
          setActiveOrderModal(null);
          setTimeout(() => {
              if (inputRef.current) {
                  inputRef.current.focus();
              }
          }, 100);
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-none">Sale Admin Bot</h1>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Online Support
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleReset}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            isOrderSubmitted || lineItems.length > 0
            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 ring-1 ring-blue-200 shadow-sm' 
            : 'text-slate-400 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Start New Order
        </button>
      </header>

      {/* MODALS */}
      {previewMeta && customerInfo && (
        <PdfPreviewModal 
          meta={previewMeta}
          info={customerInfo}
          items={lineItems}
          onClose={() => setPreviewMeta(null)}
          onDownload={() => onDownloadPdf(previewMeta)}
        />
      )}

      {analysisResult && customerInfo && (
          <OrderConfirmationModal 
              info={customerInfo}
              analysis={analysisResult}
              onCancel={() => setAnalysisResult(null)}
              onConfirm={() => handleFinalizeSubmission(analysisResult)}
          />
      )}

      {activeOrderModal && onUpdateOrderEntry && onSwapItem && (
          <OrderDetailsModal 
             entry={activeOrderModal.entry}
             items={lineItems.filter(i => i.poReference === activeOrderModal.entry.poNumber)}
             initialItemToSwap={activeOrderModal.initialItemToSwap}
             onClose={() => setActiveOrderModal(null)}
             onUpdateEntry={(id, updates) => {
                 onUpdateOrderEntry(id, updates);
             }}
             onSwapItem={(itemId, candidate) => {
                 onSwapItem(itemId, candidate);
             }}
             onRemoveItem={onRemoveItem}
             onUpdateItem={onUpdateItem}
             onManualModification={handleManualModification}
             onAddProduct={handleAddProductRequest}
          />
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex w-full ${msg.componentType === 'FORM' || msg.componentType === 'SUMMARY' || msg.componentType === 'SALE_ORDER' || msg.componentType === 'INTENT_START' ? 'max-w-[100%] md:max-w-[85%]' : 'max-w-[85%] md:max-w-[70%]'} gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              {msg.componentType === 'PROJECT_SELECTION' && selectedProjects ? (
                  <div className="flex-1 w-full max-w-md">
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected Projects</span>
                              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{selectedProjects.length}</span>
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                              {selectedProjects.map(project => (
                                  <div key={project.id} className="p-3 border-b border-slate-100 last:border-0 flex gap-3 hover:bg-slate-50 transition-colors">
                                      <img src={project.image} alt="Project" className="w-12 h-12 rounded-lg object-cover bg-slate-200 shrink-0" />
                                      <div className="min-w-0 flex-1">
                                          <p className="text-sm font-medium text-slate-900 truncate">{project.address}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                                  project.status === 'Signed' ? 'bg-green-100 text-green-700' : 
                                                  project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                                                  'bg-orange-100 text-orange-700'
                                              }`}>
                                                  {project.status}
                                              </span>
                                              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                                  <MapPin size={10} />
                                                  {project.date}
                                              </span>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                          <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                              <button 
                                  onClick={() => handleSimulateUpload()} // Re-use the mock upload flow for now as "Confirm"
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors shadow-sm"
                              >
                                  Confirm & Create Order
                              </button>
                          </div>
                      </div>
                  </div>
              ) : msg.componentType === 'SUMMARY' ? (
                   <div className="flex-1">
                      {customerInfo && (
                        <OrderCard 
                            info={customerInfo}
                            items={lineItems}
                            onRemoveItem={onRemoveItem}
                            onSubmitOrder={handleInitialSubmit}
                            onManageOrder={(entry, initialItem) => setActiveOrderModal({ entry, initialItemToSwap: initialItem })}
                            isSubmitted={isOrderSubmitted}
                        />
                      )}
                   </div>
              ) : msg.componentType === 'SALE_ORDER' && msg.orderMeta ? (
                  <div className="flex-1">
                      {customerInfo && (
                        <SaleOrderCard 
                          meta={msg.orderMeta}
                          info={customerInfo}
                          items={lineItems.filter(i => i.poReference === msg.orderMeta?.poNumber)}
                          onPreview={() => setPreviewMeta(msg.orderMeta!)}
                          isDraft={msg.orderMeta.orderId.includes('DRAFT')}
                          title={msg.orderMeta.poNumber ? `Order: ${msg.orderMeta.poNumber}` : undefined}
                        />
                      )}
                  </div>
              ) : (
                <div className={`flex flex-col p-3 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : msg.isError 
                        ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                    {msg.image && (
                    <img src={msg.image} alt="User upload" className="max-w-full rounded-lg mb-2 max-h-48 object-cover border border-white/20" />
                    )}
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex w-full justify-start">
            <div className="flex max-w-[80%] gap-3">
               <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                 <Bot className="w-5 h-5" />
               </div>
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2">
                 <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                 <span className="text-xs text-slate-500">Processing...</span>
               </div>
            </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className={`p-4 transition-opacity ${(!isInfoConfirmed && hasShownForm) || isOrderSubmitted ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
          {isOrderSubmitted && (
              <div className="absolute -top-10 left-0 right-0 text-center pointer-events-none">
                  <span className="bg-green-600 text-white text-[10px] py-1 px-3 rounded-full shadow-lg font-bold uppercase tracking-wider">Order Session Completed</span>
              </div>
          )}
          
          {selectedImage && (
            <div className="mb-2 relative inline-block">
               <img src={selectedImage} alt="Preview" className="h-16 rounded-lg border border-slate-300 shadow-sm" />
               <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 hover:bg-slate-900 shadow-md"
               >
                 <X className="w-2.5 h-2.5" />
               </button>
            </div>
          )}

          {/* Context Bubble for Replying or Adding */}
          {(replyingToItem || replyingToOrder) && (
              <div className="mb-3 flex items-center justify-between bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-xl shadow-sm animate-slideUp">
                  <div className="flex items-center gap-3">
                      <div className="bg-blue-200 p-1.5 rounded-lg text-blue-700">
                          <Quote className="w-3 h-3" />
                      </div>
                      <div>
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                              {replyingToItem ? 'Modifying Item' : 'Adding to Order'}
                          </p>
                          <p className="text-xs font-bold text-blue-900">
                              {replyingToItem ? replyingToItem.purchasedName : (replyingToOrder?.poNumber || 'Current Order')}
                          </p>
                      </div>
                  </div>
                  <button 
                    onClick={() => { setReplyingToItem(null); setReplyingToOrder(null); }}
                    className="p-1 hover:bg-blue-100 rounded-full text-blue-400 hover:text-blue-700 transition-colors"
                  >
                      <X className="w-4 h-4" />
                  </button>
              </div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateUpload}
              className="p-2.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
              title="Simulate Excel Upload"
              disabled={(!isInfoConfirmed && hasShownForm) || isLoading || isOrderSubmitted}
            >
              <FileUp className="w-5 h-5" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
              title="Upload Image"
              disabled={(!isInfoConfirmed && hasShownForm) || isOrderSubmitted}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                isOrderSubmitted 
                ? "Order Submitted" 
                : replyingToItem 
                    ? `How would you like to change "${replyingToItem.purchasedName}"?`
                    : replyingToOrder 
                        ? `Add products to ${replyingToOrder.poNumber}...`
                        : !hasShownForm
                            ? "Describe your order to start..."
                            : isInfoConfirmed 
                                ? "Type to add products or change quantities..." 
                                : "Confirm details above..."
              }
              className={`flex-1 bg-slate-100 border rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-slate-200`}
              disabled={(!isInfoConfirmed && hasShownForm) || isOrderSubmitted}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={(!inputText && !selectedImage) || isLoading || (!isInfoConfirmed && hasShownForm) || isOrderSubmitted}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md shadow-blue-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
