
import { ItemStatus, LineItem, RawExtractedItem, MatchOption } from '../types';

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=200&h=200';

const MOCK_INVENTORY: Record<string, { code: string; name: string; stock: number; image: string; accessories?: string[]; price: number }> = {
  'longi-450': { 
    code: 'SOL-PNL-450W', 
    name: 'Longi Hi-MO 5 450W Mono Panel', 
    stock: 200,
    image: DEFAULT_IMG,
    price: 185.50
  },
  'jinko-545': { 
    code: 'SOL-JK-545W', 
    name: 'Jinko Tiger Neo 545W Panel', 
    stock: 100,
    image: DEFAULT_IMG,
    price: 210.00
  },
  'jinko-550': { 
    code: 'SOL-JK-550W', 
    name: 'Jinko Tiger Neo 550W Panel', 
    stock: 45,
    image: DEFAULT_IMG,
    price: 215.00
  },
  'jinko-580': { 
    code: 'SOL-JK-580W', 
    name: 'Jinko Tiger Neo 580W (High Efficiency)', 
    stock: 12,
    image: DEFAULT_IMG,
    price: 240.00
  },
  'growatt-5k': { 
    code: 'INV-HYB-5KW', 
    name: 'Growatt 5kW Hybrid Inverter', 
    stock: 15,
    image: DEFAULT_IMG,
    accessories: ['wifi-module'],
    price: 850.00
  },
  'growatt-10k': { 
    code: 'INV-HYB-10KW', 
    name: 'Growatt 10kW Hybrid Inverter', 
    stock: 8,
    image: DEFAULT_IMG,
    accessories: ['wifi-module'],
    price: 1450.00
  },
  'battery-10k': { 
    code: 'BAT-LFP-10K', 
    name: 'Pylontech LiFePO4 10kWh Battery', 
    stock: 5,
    image: DEFAULT_IMG,
    accessories: ['cable-set', 'bracket-kit'],
    price: 3200.00
  },
  // Accessories
  'wifi-module': {
    code: 'ACC-WIFI-01',
    name: 'ShineWiFi-X Module',
    stock: 999,
    image: DEFAULT_IMG,
    price: 25.00
  },
  'cable-set': {
    code: 'ACC-CABLE-HV',
    name: 'HV Battery Cable Set (2m)',
    stock: 999,
    image: DEFAULT_IMG,
    price: 45.00
  },
  'bracket-kit': {
    code: 'ACC-BRACKET-05',
    name: 'Rack Mount Bracket Kit',
    stock: 999,
    image: DEFAULT_IMG,
    price: 85.00
  }
};

export const getInventoryItem = (codeOrKey: string) => {
    // Try finding by key first, then by code
    if (MOCK_INVENTORY[codeOrKey]) return MOCK_INVENTORY[codeOrKey];
    return Object.values(MOCK_INVENTORY).find(i => i.code === codeOrKey);
};

const findCandidates = (query: string): MatchOption[] => {
  const lowerQuery = query.toLowerCase();
  const tokens = lowerQuery.split(/\s+/).filter(t => t.length > 2); // Split into keywords

  return Object.values(MOCK_INVENTORY)
    .filter(item => !item.code.startsWith('ACC-')) // Filter out accessories from main search
    .map(item => {
      let score = 0;
      const nameLower = item.name.toLowerCase();
      const codeLower = item.code.toLowerCase();

      // Token matching
      tokens.forEach(token => {
        if (nameLower.includes(token)) score += 30;
        if (codeLower.includes(token)) score += 40;
      });

      // Exact phrase bonus
      if (nameLower.includes(lowerQuery)) score += 50;

      // Scramble scores slightly for demo variety
      score += Math.floor(Math.random() * 10);
      
      return { ...item, score };
    })
    .filter(item => item.score > 25) // Increase threshold to avoid hard matching unrelated terms
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

export const enrichLineItem = (rawItem: RawExtractedItem): LineItem => {
  const qty = rawItem.purchasedQty;
  
  const baseItem = {
    id: crypto.randomUUID(),
    purchasedName: rawItem.purchasedName,
    purchasedQty: qty,
    candidates: []
  };

  // HARDCODED DEMO LOGIC
  let bestMatchKey = null;
  if (rawItem.purchasedName === 'Longi Hi-MO 5 450W') {
      bestMatchKey = 'longi-450';
  } else if (rawItem.purchasedName === 'Growatt 5kW Inverter') {
      bestMatchKey = 'growatt-5k';
  } else if (rawItem.purchasedName === 'Battery 10k') {
      bestMatchKey = 'battery-10k';
  }
  // 'Jinko 999W (Not Exist)' will leave bestMatchKey as null

  if (!bestMatchKey || !MOCK_INVENTORY[bestMatchKey]) {
    return {
      ...baseItem,
      itemStatus: ItemStatus.UNKNOWN_ITEM,
      displayName: "Cannot match this product",
    };
  }

  const bestMatch = MOCK_INVENTORY[bestMatchKey];
  const stock = bestMatch.stock;
  let status = ItemStatus.AVAILABLE;
  if (qty === undefined || isNaN(qty as number)) status = ItemStatus.QTY_MISSING;
  else if (qty > stock) status = ItemStatus.CHECK_REQUIRED;

  return {
    ...baseItem,
    itemCode: bestMatch.code,
    displayName: bestMatch.name,
    stockAvailable: stock,
    imageUrl: bestMatch.image,
    itemStatus: status,
    unitPrice: bestMatch.price,
    totalPrice: qty ? qty * bestMatch.price : 0
  };
};

export const createAccessoryLineItem = (accessoryKey: string, parentItem: LineItem): LineItem | null => {
    const invItem = MOCK_INVENTORY[accessoryKey] || Object.values(MOCK_INVENTORY).find(i => i.code === accessoryKey);
    if (!invItem) return null;

    return {
        id: crypto.randomUUID(),
        purchasedName: invItem.name,
        purchasedQty: parentItem.purchasedQty, // Match parent qty
        itemCode: invItem.code,
        displayName: invItem.name,
        itemStatus: ItemStatus.AVAILABLE, // Assuming accessories are abundant for mock
        imageUrl: invItem.image,
        stockAvailable: invItem.stock,
        poReference: parentItem.poReference,
        isAccessory: true,
        parentId: parentItem.id,
        isAutoAdded: true,
        unitPrice: invItem.price,
        totalPrice: parentItem.purchasedQty ? parentItem.purchasedQty * invItem.price : 0
    };
};

export const recalculateItemStatus = (item: LineItem, newQty: number): LineItem => {
  const stock = item.stockAvailable || 0;
  let newStatus = ItemStatus.AVAILABLE;
  if (newQty <= 0 || isNaN(newQty)) newStatus = ItemStatus.QTY_MISSING;
  else if (newQty > stock) newStatus = ItemStatus.CHECK_REQUIRED;
  return { ...item, purchasedQty: newQty, itemStatus: newStatus };
};

export const getStatusLabel = (status: ItemStatus): { text: string; color: string } => {
  switch (status) {
    case ItemStatus.AVAILABLE:
      return { text: 'Available', color: 'text-green-600 bg-green-50' };
    case ItemStatus.CHECK_REQUIRED:
      return { text: 'Low Stock', color: 'text-amber-600 bg-amber-50' };
    case ItemStatus.QTY_MISSING:
      return { text: 'Need Qty', color: 'text-blue-600 bg-blue-50' };
    case ItemStatus.UNKNOWN_ITEM:
      return { text: 'Unknown', color: 'text-red-600 bg-red-50' };
    default:
      return { text: '---', color: 'text-gray-500 bg-gray-50' };
  }
};
