import marketPrices from '@/data/market_prices.json';
import materialProperties from '@/data/material_properties.json';

/**
 * Interface representing the structure of a Market Price entry.
 */
export interface MarketPrice {
  wasteType: string;
  region: string;
  season?: string;
  pricePerTon: number;
  lastUpdated: string;
}

/**
 * Interface representing the structure of a Material Property entry.
 */
export interface MaterialProperty {
  wasteType: string;
  typicalCalorificValue: string;
  ashContent: string;
  moistureDensityFactor: number;
}

/**
 * Fetches live market data from Agmarknet API (data.gov.in)
 * Returns null if API call fails or no data found.
 */
async function fetchLiveMarketPrice(wasteType: string, location: string): Promise<MarketPrice | null> {
  const API_KEY = process.env.AGMARKNET_API_KEY;
  if (!API_KEY) {
    console.warn("Agmarknet API Key missing. Falling back to local data.");
    return null;
  }

  try {
    // Note: This is specifically structured for the data.gov.in Agmarknet resource.
    // RESOURCE_ID: 9ef273ef-bdde-4143-9828-5696f018e6c4 (Daily market rates)
    const baseUrl = "https://api.data.gov.in/resource/9ef273ef-bdde-4143-9828-5696f018e6c4";
    const params = new URLSearchParams({
      "api-key": API_KEY,
      "format": "json",
      "limit": "1",
      "filters[commodity]": wasteType, // Mapping search term to API field
    });

    // Attempt to add state filter if location is specific
    if (location && location !== "India") {
        params.append("filters[state]", location);
    }

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const data = await response.json();

    if (data && data.records && data.records.length > 0) {
      const record = data.records[0];
      return {
        wasteType: record.commodity,
        region: record.state || record.district || "Live API",
        season: "Current",
        pricePerTon: Number(record.modal_price) * 10, // Assuming modal_price is per quintal, convert to ton
        lastUpdated: record.arrival_date || new Date().toISOString()
      };
    }
  } catch (error) {
    console.error("Error fetching live market data:", error);
  }
  return null;
}

/**
 * Finds the most relevant market price based on type and location.
 * Attempts Live API first, falls back to local dataset.
 */
export async function getMarketPriceRef(wasteType: string, location: string): Promise<MarketPrice | null> {
  // 1. Attempt Live API Fetch
  const livePrice = await fetchLiveMarketPrice(wasteType, location);
  if (livePrice) return livePrice;

  // 2. Fallback to local data
  const normalizedType = wasteType.toLowerCase();
  const normalizedLoc = location.toLowerCase();

  const matches = (marketPrices as MarketPrice[]).filter(p => 
    p.wasteType.toLowerCase().includes(normalizedType) || normalizedType.includes(p.wasteType.toLowerCase())
  );

  if (matches.length === 0) return null;

  const regionMatch = matches.find(p => normalizedLoc.includes(p.region.toLowerCase()));
  if (regionMatch) return regionMatch;

  const avgPrice = matches.reduce((sum, p) => sum + p.pricePerTon, 0) / matches.length;
  return {
    ...matches[0],
    region: 'Generic/National',
    pricePerTon: Math.round(avgPrice)
  };
}

/**
 * Retrieves material properties for a specific waste type from local catalog.
 */
export function getMaterialProps(wasteType: string): MaterialProperty | null {
  const normalizedType = wasteType.toLowerCase();
  return (materialProperties as MaterialProperty[]).find(p => 
    p.wasteType.toLowerCase().includes(normalizedType) || normalizedType.includes(p.wasteType.toLowerCase())
  ) || null;
}

