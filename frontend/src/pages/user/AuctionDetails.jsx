// import { Clock, Gavel } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import API from "../../api/axios";
// import { socket } from "../../socket.js";

// export const AuctionDetails = () => {
//   const { id } = useParams();

//   const [auction, setAuction] = useState(null);
//   const [bidAmount, setBidAmount] = useState("");
//   const [currentBid, setCurrentBid] = useState(0);
//   const [bids, setBids] = useState([]);

//   //  Time Left
//   const getTimeLeft = (endTime) => {
//     const diff = new Date(endTime) - new Date();

//     if (diff <= 0) return "Ended";

//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff / (1000 * 60)) % 60);

//     return `${hours}h ${minutes}m left`;
//   };

//   //  Fetch auction
//   useEffect(() => {
//     if (!id) return;

//     const fetchAuction = async () => {
//       try {
//         const res = await API.get(`/auctions/${id}`);
//         setAuction(res.data.auction);
//         setCurrentBid(res.data.auction.currentBid);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchAuction();
//   }, [id]);

//   //  Fetch bid history
//   useEffect(() => {
//     const fetchBids = async () => {
//       try {
//         const res = await API.get(`/bids/${id}`);
//         setBids(res.data.bids);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchBids();
//   }, [id]);

//   //  Socket real-time
//   useEffect(() => {
//     socket.emit("joinAuction", id);

//     socket.on("bidUpdated", (data) => {
//       setCurrentBid(data.amount);
//     });

//     return () => {
//       socket.off("bidUpdated");
//     };
//   }, [id]);

//   // 💰 Place Bid
//   const handleBid = async () => {
//     try {
//       if (Number(bidAmount) <= currentBid) {
//         return alert("Bid must be higher than current bid");
//       }

//       await API.post("/bids/place", {
//         auctionId: id,
//         amount: bidAmount,
//       });

//       setBidAmount("");
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to place bid");
//     }
//   };

//   if (!auction) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gray-100 px-6 py-10">
//       <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
//         {/* Image */}
//         <div className="bg-white p-6 rounded-xl shadow">
//           <img
//             src={auction.image}
//             alt={auction.title}
//             className="w-full h-100 object-cover rounded-lg"
//           />
//         </div>

//         {/* Details */}
//         <div className="bg-white p-6 rounded-xl shadow flex flex-col">
//           <h1 className="text-3xl font-bold text-gray-800">{auction.title}</h1>

//           <p className="text-gray-600 mt-4">{auction.description}</p>

//           <div className="mt-6 flex items-center gap-3 text-gray-500">
//             <Clock size={18} />
//             <span>{getTimeLeft(auction.endTime)}</span>
//           </div>

//           <div className="mt-6">
//             <p className="text-sm text-gray-500">Current Highest Bid</p>
//             <h2 className="text-3xl font-bold text-green-600">₹{currentBid}</h2>
//           </div>

//           {/* Bid Section */}
//           <div className="mt-6">
//             <input
//               type="number"
//               placeholder="Enter your bid"
//               value={bidAmount}
//               onChange={(e) => setBidAmount(e.target.value)}
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//             />

//             <button
//               onClick={handleBid}
//               className="mt-4 w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
//             >
//               <Gavel size={18} />
//               Place Bid
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Bid History */}
//       <div className="max-w-6xl mx-auto mt-12 bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-semibold mb-4">Bid History</h2>

//         <div className="space-y-3 text-sm text-gray-600">
//           {bids.map((bid) => (
//             <p key={bid._id}>
//               {bid.bidder?.name} bid ₹{bid.amount}
//             </p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

import { Clock, Gavel } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { socket } from "../../socket.js";

export const AuctionDetails = () => {
  const { id } = useParams();

  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [currentBid, setCurrentBid] = useState(0);
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");

  //  Fetch auction
  useEffect(() => {
    if (!id) return;

    const fetchAuction = async () => {
      try {
        const res = await API.get(`/auctions/${id}`);
        setAuction(res.data.auction);
        setCurrentBid(res.data.auction.currentBid);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAuction();
  }, [id]);

  //  Fetch bid history
  useEffect(() => {
    if (!id) return;

    const fetchBids = async () => {
      try {
        const res = await API.get(`/bids/${id}`);
        setBids(res.data.bids);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBids();
  }, [id]);

  //  Live countdown timer
  useEffect(() => {
    if (!auction?.endTime) return;

    const interval = setInterval(() => {
      const diff = new Date(auction.endTime) - new Date();

      if (diff <= 0) {
        setTimeLeft("Ended");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  //  Socket real-time updates
  useEffect(() => {
    if (!id) return;

    const user = JSON.parse(localStorage.getItem("user"));

    // join auction room
    socket.emit("joinAuction", id);

    // join personal notification room
    if (user?._id) {
      socket.emit("joinUserRoom", user._id);
    }

    //  Outbid notification
    socket.on("outbidNotification", (data) => {
      toast.error(data.message || "You have been outbid!");
    });

    //  Bid update
    socket.on("bidUpdated", (data) => {
      setCurrentBid(data.amount);

      // optional: update bid history instantly
      setBids((prev) => [
        {
          _id: Date.now(),
          bidder: { name: data.bidder },
          amount: data.amount,
        },
        ...prev,
      ]);
    });
    return () => {
      socket.off("bidUpdated");
      socket.off("outbidNotification");
    };
  }, [id]);

  //  Place Bid
  const handleBid = async () => {
    try {
      if (timeLeft === "Ended") {
        return alert("Auction has ended");
      }

      if (Number(bidAmount) <= currentBid) {
        return alert("Bid must be higher than current bid");
      }

      await API.post("/bids/place", {
        auctionId: id,
        amount: Number(bidAmount),
      });

      setBidAmount("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place bid");
    }
  };

  if (!auction) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-white p-6 rounded-xl shadow">
          <img
            src={auction.image}
            alt={auction.title}
            className="w-full h-100 object-cover rounded-lg"
          />
        </div>

        {/* Details */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800">{auction.title}</h1>

          <p className="text-gray-600 mt-4">{auction.description}</p>

          <div className="mt-6 flex items-center gap-3 text-gray-500">
            <Clock size={18} />
            <span>{timeLeft}</span>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">Current Highest Bid</p>
            <h2 className="text-4xl font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg inline-block mt-2">
              ₹{currentBid}
            </h2>
          </div>

          {/* Starting Bid */}
          <div className="mt-3">
            <p className="text-sm text-gray-500">Starting Bid</p>
            <p className="text-lg font-semibold text-gray-700">
              ₹{auction.startingBid}
            </p>
          </div>

          {/* Bid Section */}
          <div className="mt-6">
            <input
              type="number"
              placeholder="Enter your bid"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              disabled={timeLeft === "Ended"}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              onClick={handleBid}
              disabled={timeLeft === "Ended"}
              className="mt-4 w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
            >
              <Gavel size={18} />
              Place Bid
            </button>
          </div>
        </div>
      </div>

      {/* Bid History */}
      <div className="max-w-6xl mx-auto mt-12 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Bid History</h2>

        <div className="space-y-3 text-sm text-gray-600">
          {bids.map((bid, index) => (
            <p
              key={bid._id}
              className={index === 0 ? "font-bold text-green-600" : ""}
            >
              {bid.bidder?.name} bid ₹{bid.amount}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
