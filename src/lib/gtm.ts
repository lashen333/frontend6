// src\lib\gtm.ts

declare global {
  interface Window {
    dataLayer?: { push: (event: any) => void };
  }
}

export const GTM_ID = "GTM-PZL8G7SS"; // replace with your real ID

export const pageview = (url: string) => {
  window.dataLayer?.push({
    event: "pageview",
    page: url,
  });
};
