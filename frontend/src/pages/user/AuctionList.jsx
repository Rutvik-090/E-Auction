// import { AuctionCard } from "../../components/auction/AuctionCard";

// export const AuctionList = () => {
//   // Temporary dummy data
//   const auctions = [
//     {
//       id: 1,
//       title: "Luxury Watch",
//       currentBid: 25000,
//       timeLeft: "2h 15m left",
//       image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
//     },
//     {
//       id: 2,
//       title: "Gaming Laptop",
//       currentBid: 55000,
//       timeLeft: "5h 40m left",
//       image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
//     },
//     {
//       id: 3,
//       title: "Vintage Painting",
//       currentBid: 12000,
//       timeLeft: "1d 3h left",
//       image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde",
//     },
//     {
//       id: 4,
//       title: "iPhone 15 Pro",
//       currentBid: 80000,
//       timeLeft: "3h 10m left",
//       image: "https://images.unsplash.com/photo-1695048133146-7a9dcdcc6c10",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 px-6 py-10">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-gray-800">Live Auctions</h1>

//         <div className="grid md:grid-cols-3 gap-6">
//           {auctions.map((auction) => (
//             <AuctionCard key={auction.id} auction={auction} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

import { useEffect, useState } from "react";
import API from "../../api/axios";
import { AuctionCard } from "../../components/auction/AuctionCard";

export const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await API.get("/auctions");

        setAuctions(res.data.auctions);
      } catch (error) {
        console.log("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const getTimeLeft = (endTime) => {
    const diff = new Date(endTime) - new Date();

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m left`;
  };

  console.log(auctions);
  console.log("ID:", auctions._id);
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Live Auctions</h1>

        {loading ? (
          <p className="text-center">Loading auctions...</p>
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
