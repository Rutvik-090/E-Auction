import { Clock, Gavel } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const AuctionDetails = () => {
  const { id } = useParams();

  // Temporary dummy data
  const auction = {
    id,
    title: "Luxury Watch",
    description:
      "A premium luxury watch with stainless steel body and sapphire glass. Excellent condition.",
    currentBid: 25000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    endTime: "2h 15m left",
  };

  const [bidAmount, setBidAmount] = useState("");
  const [currentBid, setCurrentBid] = useState(auction.currentBid);

  const handleBid = () => {
    if (Number(bidAmount) > currentBid) {
      setCurrentBid(Number(bidAmount));
      setBidAmount("");
      alert("Bid placed successfully!");
    } else {
      alert("Bid must be higher than current bid.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Left - Image */}
        <div className="bg-white p-6 rounded-xl shadow">
          <img
            src={auction.image}
            alt={auction.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>

        {/* Right - Details */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800">{auction.title}</h1>

          <p className="text-gray-600 mt-4">{auction.description}</p>

          <div className="mt-6 flex items-center gap-3 text-gray-500">
            <Clock size={18} />
            <span>{auction.endTime}</span>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">Current Highest Bid</p>
            <h2 className="text-3xl font-bold text-green-600">₹{currentBid}</h2>
          </div>

          {/* Bid Section */}
          <div className="mt-6">
            <input
              type="number"
              placeholder="Enter your bid"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              onClick={handleBid}
              className="mt-4 w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              <Gavel size={18} />
              Place Bid
            </button>
          </div>
        </div>
      </div>

      {/* Bid History Section */}
      <div className="max-w-6xl mx-auto mt-12 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Bid History</h2>

        <div className="space-y-3 text-sm text-gray-600">
          <p>John bid ₹20,000</p>
          <p>Sarah bid ₹22,500</p>
          <p>You bid ₹25,000</p>
        </div>
      </div>
    </div>
  );
};
