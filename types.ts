
// Enums
export enum ShippingMethod {
  PICKUP = 'PICKUP',
  DELIVERY = 'DELIVERY',
}

export enum ItemStatus {
  UNKNOWN_ITEM = 'UNKNOWN_ITEM',
  CHECK_REQUIRED = 'CHECK_REQUIRED',
  AVAILABLE = 'AVAILABLE',
  QTY_MISSING = 'QTY_MISSING',
}

export interface SaleOrderMeta {
  orderId: string;
  orderTime: string;
  poNumber?: string;
}

export interface OrderEntry {
  id: string;
  poNumber: string;
  productDescription: string;
  shippingMethod: ShippingMethod;
  shippingAddress?: string;
  recipientName?: string;
  recipientPhone?: string;
  pickupWarehouse?: string;
  requestedDate: string;
  pickupTimeSlot?: string;
}

export interface MatchOption {
  code: string;
  name: string;
  image: string;
  score: number;
  stock: number;
  accessories?: string[]; // List of inventory codes for accessories
}

export interface LineItem {
  id: string; 
  purchasedName: string;
  purchasedQty?: number;
  itemCode?: string;
  displayName?: string;
  itemStatus: ItemStatus;
  imageUrl?: string; 
  stockAvailable?: number;
  poReference?: string;
  candidates?: MatchOption[]; // Top matches from database
  // Accessory Logic
  isAccessory?: boolean;
  parentId?: string; // ID of the parent line item
  isAutoAdded?: boolean; // True if added by system logic, False if extracted from user input
}

export interface ProjectData {
  id: string;
  address: string;
  status: 'Sent' | 'Signed' | 'In Progress' | 'Ordered' | 'Closed';
  date: string;
  user?: string;
  image: string;
  tags?: string[];
  isDemo?: boolean;
  isNew?: boolean;
}

export interface CustomerInfo {
  emailAddress: string;
  companyName: string;
  orderEntries: OrderEntry[];
  // Added optional fields used in PdfPreviewModal to avoid property access errors
  recipientName?: string;
  recipientPhone?: string;
  shippingMethod?: ShippingMethod;
  requestedDate?: string;
  shippingAddress?: string;
  pickupWarehouse?: string;
}

export interface RawExtractedItem {
  purchasedName: string;
  purchasedQty?: number;
}

export type MessageComponentType = 'TEXT' | 'FORM' | 'SUMMARY' | 'CONFIRMATION' | 'RESULT_LIST' | 'SALE_ORDER' | 'INTENT_START';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content?: string;
  componentType?: MessageComponentType;
  // Context data for specific component types
  image?: string; 
  isError?: boolean;
  timestamp: number;
  orderMeta?: SaleOrderMeta;
}

export interface BatchAnalysisResult {
  validIds: string[];
  exceptionIds: string[];
  details: Record<string, {
    status: 'VALID' | 'EXCEPTION';
    reasons: string[];
  }>;
}

export interface FinalizedOrder {
  entryId: string;
  poNumber: string;
  items: LineItem[];
  status: 'CONFIRMED' | 'DRAFT';
  meta: SaleOrderMeta;
  reasons?: string[];
}
