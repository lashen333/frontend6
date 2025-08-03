// src\app\connect\page.tsx
"use client";

import { useState, useEffect } from "react";
import { FaFacebook } from "react-icons/fa";

export default function ConnectPage() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [adAccounts, setAdAccounts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [fetchingCampaigns, setFetchingCampaigns] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  /**
   * Step 1: Trigger OAuth flow
   */
  const handleConnect = () => {
    setLoading(true);
    window.location.href = `${apiUrl}/api/auth/facebook`;
  };

  /**
   * Step 2: Read accessToken + adAccounts from query params after redirect
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("accessToken");
    const accounts = params.get("adAccounts");

    if (token && accounts) {
      setAccessToken(token);
      setAdAccounts(JSON.parse(decodeURIComponent(accounts)));
      setConnected(true);
      setLoading(false);

      // Clean up URL so params don't stay
      window.history.replaceState({}, document.title, "/connect");
    }
  }, []);

  /**
   * Step 3: Fetch campaigns from backend and save to MongoDB
   */
  const handleFetchCampaigns = async (adAccountId: string) => {
    if (!accessToken) return;

    try {
      setFetchingCampaigns(true);

      // Trigger backend to fetch and store campaigns
      const res = await fetch(`${apiUrl}/api/facebook/fetch-ads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, adAccountId }),
      });

      const data = await res.json();

      if (res.ok) {
        // Now fetch campaigns from MongoDB
        const campaignsRes = await fetch(
          `${apiUrl}/api/campaigns?adAccountId=${adAccountId}`
        );
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData);
      } else {
        alert(data.error || "Failed to fetch campaigns");
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setFetchingCampaigns(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Connect Platforms
      </h1>

      {/* Step 1: Show Connect Button */}
      {!connected && (
        <>
          <p className="text-gray-600 mb-8 text-center max-w-md">
            Connect your Facebook account to sync campaigns, ad sets, and
            creatives directly with your landing page optimization tool.
          </p>

          <button
            onClick={handleConnect}
            disabled={loading}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="loader border-2 border-t-2 border-white rounded-full w-5 h-5 animate-spin"></span>
            ) : (
              <FaFacebook size={20} />
            )}
            {loading ? "Connecting..." : "Connect Facebook"}
          </button>
        </>
      )}

      {/* Step 2: Show Ad Accounts */}
      {connected && campaigns.length === 0 && (
        <div className="w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-4">Select Ad Account:</h2>
          <div className="space-y-2">
            {adAccounts.map((acc: any) => (
              <button
                key={acc.id}
                onClick={() => handleFetchCampaigns(acc.id)}
                disabled={fetchingCampaigns}
                className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-left"
              >
                {acc.name || acc.account_id}
              </button>
            ))}
          </div>
          {fetchingCampaigns && (
            <p className="mt-4 text-gray-500">Fetching campaigns...</p>
          )}
        </div>
      )}

      {/* Step 3: Show Campaigns from MongoDB */}
      {campaigns.length > 0 && (
        <div className="w-full max-w-4xl mt-8">
          <h2 className="text-2xl font-bold mb-4">Saved Campaigns</h2>
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-white shadow-md p-4 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {campaign.name}{" "}
                  <span className="text-sm text-gray-500">
                    ({campaign.status})
                  </span>
                </h3>
                <p className="text-gray-600 text-sm">
                  Campaign ID: {campaign.campaignId}
                </p>

                {/* Ad Sets */}
                <div className="mt-3 space-y-4">
                  {campaign.adSets.map((adSet: any) => (
                    <div
                      key={adSet.adSetId}
                      className="bg-gray-50 rounded-md p-3"
                    >
                      <h4 className="font-medium">
                        {adSet.name}{" "}
                        <span className="text-sm text-gray-500">
                          ({adSet.status})
                        </span>
                      </h4>
                      {/* Ads */}
                      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
                        {adSet.ads.map((ad: any) => (
                          <li key={ad.adId}>
                            <span className="font-semibold">{ad.name}</span>{" "}
                            - {ad.status}
                            {ad.headline && (
                              <>
                                <br />
                                Headline: {ad.headline}
                              </>
                            )}
                            {ad.cta && (
                              <>
                                <br />
                                CTA: {ad.cta}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
