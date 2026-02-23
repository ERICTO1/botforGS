
import { ItemStatus, LineItem, RawExtractedItem, MatchOption } from '../types';

const MOCK_INVENTORY: Record<string, { code: string; name: string; stock: number; image: string; accessories?: string[] }> = {
  'longi-450': { 
    code: 'SOL-PNL-450W', 
    name: 'Longi Hi-MO 5 450W Mono Panel', 
    stock: 200,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=200&h=200'
  },
  'jinko-545': { 
    code: 'SOL-JK-545W', 
    name: 'Jinko Tiger Neo 545W Panel', 
    stock: 100,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=200&h=200'
  },
  'jinko-550': { 
    code: 'SOL-JK-550W', 
    name: 'Jinko Tiger Neo 550W Panel', 
    stock: 45,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=200&h=200'
  },
  'jinko-580': { 
    code: 'SOL-JK-580W', 
    name: 'Jinko Tiger Neo 580W (High Efficiency)', 
    stock: 12,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=200&h=200'
  },
  'growatt-5k': { 
    code: 'INV-HYB-5KW', 
    name: 'Growatt 5kW Hybrid Inverter', 
    stock: 15,
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=200&h=200',
    accessories: ['wifi-module']
  },
  'growatt-10k': { 
    code: 'INV-HYB-10KW', 
    name: 'Growatt 10kW Hybrid Inverter', 
    stock: 8,
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=200&h=200',
    accessories: ['wifi-module']
  },
  'battery-10k': { 
    code: 'BAT-LFP-10K', 
    name: 'Pylontech LiFePO4 10kWh Battery', 
    stock: 5,
    image: 'https://plus.unsplash.com/premium_photo-1682145930967-3392e2124cb1?auto=format&fit=crop&q=80&w=200&h=200',
    accessories: ['cable-set', 'bracket-kit']
  },
  // Accessories
  'wifi-module': {
    code: 'ACC-WIFI-01',
    name: 'ShineWiFi-X Module',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bbc7c?auto=format&fit=crop&q=80&w=100&h=100'
  },
  'cable-set': {
    code: 'ACC-CABLE-HV',
    name: 'HV Battery Cable Set (2m)',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1544724569-5f546fd6dd2d?auto=format&fit=crop&q=80&w=100&h=100'
  },
  'bracket-kit': {
    code: 'ACC-BRACKET-05',
    name: 'Rack Mount Bracket Kit',
    stock: 999,
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=100&h=100'
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
      
      return { ...item, score: Math.min(score, 99) };
    })
    .filter(item => item.score > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

export const enrichLineItem = (rawItem: RawExtractedItem): LineItem => {
  const candidates = findCandidates(rawItem.purchasedName);
  const bestMatch = candidates[0];
  const qty = rawItem.purchasedQty;
  
  const baseItem = {
    id: crypto.randomUUID(),
    purchasedName: rawItem.purchasedName,
    purchasedQty: qty,
    candidates: candidates
  };

  if (!bestMatch) {
    return {
      ...baseItem,
      itemStatus: ItemStatus.UNKNOWN_ITEM,
      displayName: rawItem.purchasedName || "Manual Check Required",
    };
  }

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
        isAutoAdded: true
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
