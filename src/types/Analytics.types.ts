// src\types\Analytics.types.ts
export type CountryStat = {
  country: string;
  value: number;
};

export type HourStat = {
  hour: number;
  visits: number;
};

export type DeviceStat = {
  deviceType: string;
  count: number;
};

export type BrowserStat = {
  browser: string;
  value: number;
};

export type DateStat = { 
  date: string; 
  count: number;
};

export type FunnelStat = { 
  event: string; 
  count: number;
};
