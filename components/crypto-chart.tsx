"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

// Extend the Window interface to include TradingView
interface TradingViewWindow extends Window {
  TradingView: any; // Use 'any' for simplicity; a specific type can be defined if known
}
declare let window: TradingViewWindow;

// Define the props interface
interface CryptoChartProps {
  exchange: string;
  pair: string;
  interval?: string;
  theme?: string;
}

// Component with typed props
export function CryptoChart({
  exchange,
  pair,
  interval = "D",
  theme = "light",
}: CryptoChartProps) {
  const [isScriptReady, setIsScriptReady] = useState(false);
  const symbol = `${exchange}:${pair}`;
  const containerId = "tradingview_chart";

  useEffect(() => {
    if (isScriptReady && window.TradingView) {
      new window.TradingView.widget({
        width: "100%",
        height: "80%",
        symbol,
        interval,
        theme,
        timezone: "Etc/UTC",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerId,
      });
    }
  }, [isScriptReady, symbol, interval, theme]);

  return (
    <>
      <Script
        src="https://s3.tradingview.com/tv.js"
        strategy="lazyOnload"
        onReady={() => setIsScriptReady(true)}
      />
      <div id={containerId} className="w-full h-[500px]" />
    </>
  );
}
