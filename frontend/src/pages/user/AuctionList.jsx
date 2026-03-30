import { useEffect, useState } from "react";
import API from "../../api/axios";
import { AuctionCard } from "../../components/auction/AuctionCard";

export const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Filters state
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  // 🚀 Fetch auctions with filters
  const fetchAuctions = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        keyword,
        minPrice,
        maxPrice,
        sort,
      }).toString();

      const res = await API.get(`/auctions?${query}`);

      setAuctions(res.data.auctions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [keyword, minPrice, maxPrice, sort]);

  const getTimeLeft = (endTime) => {
    const diff = new Date(endTime) - new Date();

    if (diff <= 0) return "Ended";

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);

    return `${h}h ${m}m left`;
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Live Auctions</h1>

        {/* 🔍 FILTER BAR */}
        <div className="bg-white p-4 rounded-xl shadow mb-8 grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search auctions..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="p-2 border rounded-lg"
          />

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="p-2 border rounded-lg"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="p-2 border rounded-lg"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="ending_soon">Ending Soon</option>
          </select>
        </div>

        {/* 🧾 AUCTION GRID */}
        {loading ? (
          <p className="text-center">Loading auctions...</p>
        ) : auctions.length === 0 ? (
          <p className="text-center text-gray-500">No auctions found 😢</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <AuctionCard
                key={auction._id}
                auction={{
                  ...auction,
                  id: auction._id,
                  timeLeft: getTimeLeft(auction.endTime),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
