// src\lib\gtm.ts

type DataLayerEvent = {
  event: string;
  [key: string]: unknown; // allows other properties, but keeps type safety
}

declare global {
  interface Window {
    dataLayer?: { push: (event: DataLayerEvent) => void };
  }
}

export const GTM_ID = "GTM-PZL8G7SS"; // replace with your real ID

export const pageview = (url: string) => {
  window.dataLayer?.push({
    event: "pageview",
    page: url,
  });
};
