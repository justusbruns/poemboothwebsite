export interface Database {
  public: {
    Tables: {
      hubs: {
        Row: {
          id: string;
          name: string;
          region_code: string;
          currency: string | null;
          day_1_rate: number | null;
          day_2_rate: number | null;
          day_3_plus_rate: number | null;
          transport_rate_per_km: number | null;
          minimum_transport_fee: number | null;
          distance_unit: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}

export interface HubData {
  id: string;
  name: string;
  regionCode: string;
  currency: string;
  dayRates: {
    day1: number;
    day2: number;
    day3Plus: number;
  };
  transport: {
    ratePerUnit: number;
    minimumFee: number;
    unit: "km" | "mi";
  };
}

export type Region = "us" | "eu";

export interface RegionConfig {
  code: Region;
  label: string;
  currency: string;
  currencySymbol: string;
  distanceUnit: "km" | "mi";
  locale: string;
  hubCity: string;
  voltage: string;
}

export const REGION_CONFIGS: Record<Region, RegionConfig> = {
  us: {
    code: "us",
    label: "United States",
    currency: "USD",
    currencySymbol: "$",
    distanceUnit: "mi",
    locale: "en-US",
    hubCity: "New York",
    voltage: "110V",
  },
  eu: {
    code: "eu",
    label: "Europe",
    currency: "EUR",
    currencySymbol: "€",
    distanceUnit: "km",
    locale: "en-GB",
    hubCity: "Amsterdam",
    voltage: "230V",
  },
};
