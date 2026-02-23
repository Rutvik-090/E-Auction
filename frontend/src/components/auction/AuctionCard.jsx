import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

export const AuctionCard = ({ auction }) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
      {/* Image */}
      <div className="h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
        <img
          src={auction.image}
          alt={auction.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold">{auction.title}</h3>

      <p className="text-gray-500 text-sm mt-2">
        Current Bid: ₹{auction.currentBid}
      </p>

      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
        <Clock size={16} />
        <span>{auction.timeLeft}</span>
      </div>

      <Link
        to={`/auction/${auction.id}`}
        className="mt-4 bg-black text-white py-2 rounded-lg text-center hover:opacity-90 transition"
      >
        View Auction
      </Link>
    </div>
  );
};
