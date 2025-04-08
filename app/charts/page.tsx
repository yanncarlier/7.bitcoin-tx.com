import { Header } from "@/components/header";
import { CryptoChart } from "@/components/crypto-chart";

export default async function CryptoCharts() {
  return (
    <>
      <section className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[80%] h-[80vh] flex flex-col gap-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              BTC/USD Chart
            </h1>
          </div>

          {/* Chart Container */}
          <div className="flex-1 min-h-0">
            <CryptoChart
              exchange="KRAKEN"
              pair="BTCUSD"
              interval="1H"
              theme="dark"
            />
          </div>
        </div>
      </section>
    </>
  );
}
