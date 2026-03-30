// import { Clock, Gavel } from "lucide-react";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useParams } from "react-router-dom";
// import API from "../../api/axios";
// import { socket } from "../../socket.js";

// export const AuctionDetails = () => {
//   const { id } = useParams();

//   const [auction, setAuction] = useState(null);
//   const [bidAmount, setBidAmount] = useState("");
//   const [currentBid, setCurrentBid] = useState(0);
//   const [bids, setBids] = useState([]);
//   const [timeLeft, setTimeLeft] = useState("");

//   // Fetch auction
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

//   // Fetch bid history
//   useEffect(() => {
//     if (!id) return;

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

//   // Live countdown
//   useEffect(() => {
//     if (!auction?.endTime) return;

//     const interval = setInterval(() => {
//       const diff = new Date(auction.endTime) - new Date();

//       if (diff <= 0) {
//         setTimeLeft("Ended");
//         clearInterval(interval);
//         return;
//       }

//       const h = Math.floor(diff / (1000 * 60 * 60));
//       const m = Math.floor((diff / (1000 * 60)) % 60);
//       const s = Math.floor((diff / 1000) % 60);

//       setTimeLeft(`${h}h ${m}m ${s}s`);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [auction]);

//   // Socket logic
//   useEffect(() => {
//     if (!id) return;

//     const user = JSON.parse(localStorage.getItem("user"));

//     socket.emit("joinAuction", id);

//     if (user?._id) {
//       socket.emit("joinUserRoom", user._id);
//     }

//     // Outbid toast
//     socket.on("outbidNotification", (data) => {
//       toast.error(data.message || "You have been outbid!");
//     });

//     // Bid updates
//     socket.on("bidUpdated", (data) => {
//       setCurrentBid(data.amount);

//       setBids((prev) => {
//         if (prev[0]?.amount === data.amount) return prev;

//         return [
//           {
//             _id: Date.now(),
//             bidder: { name: data.bidder },
//             amount: data.amount,
//           },
//           ...prev,
//         ];
//       });
//     });

//     return () => {
//       socket.off("bidUpdated");
//       socket.off("outbidNotification");
//     };
//   }, [id]);

//   // Place Bid (Optimistic UI)
//   const handleBid = async () => {
//     try {
//       if (timeLeft === "Ended") {
//         return alert("Auction has ended");
//       }

//       const newBid = Number(bidAmount);

//       if (newBid <= currentBid) {
//         return alert("Bid must be higher than current bid");
//       }

//       // 🔥 instant UI update
//       setCurrentBid(newBid);

//       setBids((prev) => [
//         {
//           _id: Date.now(),
//           bidder: { name: "You" },
//           amount: newBid,
//         },
//         ...prev,
//       ]);

//       await API.post("/bids/place", {
//         auctionId: id,
//         amount: newBid,
//       });

//       toast.success("Bid placed successfully!");

//       setBidAmount("");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to place bid");
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
//             <span>{timeLeft}</span>
//           </div>

//           <div className="mt-6">
//             <p className="text-sm text-gray-500">Current Highest Bid</p>
//             <h2 className="text-4xl font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg inline-block mt-2">
//               ₹{currentBid}
//             </h2>
//           </div>

//           {/* Starting Bid */}
//           <div className="mt-3">
//             <p className="text-sm text-gray-500">Starting Bid</p>
//             <p className="text-lg font-semibold text-gray-700">
//               ₹{auction.startingBid}
//             </p>
//           </div>

//           {/* Bid Section */}
//           <div className="mt-6">
//             <input
//               type="number"
//               placeholder="Enter your bid"
//               value={bidAmount}
//               onChange={(e) => setBidAmount(e.target.value)}
//               disabled={timeLeft === "Ended"}
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//             />

//             <button
//               onClick={handleBid}
//               disabled={timeLeft === "Ended"}
//               className="mt-4 w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
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
//           {bids.map((bid, index) => (
//             <p
//               key={bid._id}
//               className={index === 0 ? "font-bold text-green-600" : ""}
//             >
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
  const [isHighestBidder, setIsHighestBidder] = useState(false);

  // 🎉 Winner popup state
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [winnerData, setWinnerData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  //  LOAD RAZORPAY SCRIPT
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  //  HANDLE PAYMENT
  const handlePayment = async () => {
    const res = await loadRazorpay();

    if (!res) {
      return toast.error("Razorpay SDK failed to load");
    }

    try {
      const { data } = await API.post("/payment/create-order", {
        auctionId: id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: "INR",
        name: "E-Auction",
        description: "Auction Payment",
        order_id: data.order.id,

        handler: async function (response) {
          await API.post("/payment/verify", {
            ...response,
            auctionId: id,
          });

          toast.success("Payment successful 🎉");
          setShowWinnerPopup(false);
        },

        prefill: {
          name: user?.name,
          email: user?.email,
        },

        theme: {
          color: "#000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  // Fetch auction
  useEffect(() => {
    if (!id) return;

    const fetchAuction = async () => {
      const res = await API.get(`/auctions/${id}`);
      setAuction(res.data.auction);
      setCurrentBid(res.data.auction.currentBid);
    };

    fetchAuction();
  }, [id]);

  // Fetch bids
  useEffect(() => {
    if (!id) return;

    const fetchBids = async () => {
      const res = await API.get(`/bids/${id}`);
      setBids(res.data.bids);

      if (res.data.bids.length > 0) {
        const topBid = res.data.bids[0];
        setIsHighestBidder(topBid.bidder?._id === user?._id);
      }
    };

    fetchBids();
  }, [id]);

  // Countdown
  useEffect(() => {
    if (!auction?.endTime) return;

    const interval = setInterval(() => {
      const diff = new Date(auction.endTime) - new Date();

      if (diff <= 0) {
        setTimeLeft("Ended");
        clearInterval(interval);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  // 🔌 Socket
  useEffect(() => {
    if (!id) return;

    socket.emit("joinAuction", id);

    // Outbid
    socket.on("outbidNotification", (data) => {
      toast.error(data.message);
      setIsHighestBidder(false);
    });

    // Bid update
    socket.on("bidUpdated", (data) => {
      setCurrentBid(data.amount);

      setBids((prev) => {
        if (prev[0]?.amount === data.amount) return prev;

        return [
          {
            _id: Date.now(),
            bidder: { name: data.bidder },
            amount: data.amount,
          },
          ...prev,
        ];
      });

      if (data.bidder === user?.name) {
        setIsHighestBidder(true);
      } else {
        setIsHighestBidder(false);
      }
    });

    //  Auction ended
    socket.on("auctionEnded", (data) => {
      setTimeLeft("Ended");
      setWinnerData(data);

      if (data.winner === user?.name) {
        setShowWinnerPopup(true);
      } else {
        toast("Auction ended");
      }
    });

    return () => {
      socket.off("bidUpdated");
      socket.off("outbidNotification");
      socket.off("auctionEnded");
    };
  }, [id]);

  // Place bid
  const handleBid = async () => {
    try {
      if (timeLeft === "Ended") return alert("Auction ended");

      const newBid = Number(bidAmount);

      if (newBid <= currentBid) {
        return alert("Bid must be higher than current bid");
      }

      setCurrentBid(newBid);
      setIsHighestBidder(true);

      setBids((prev) => [
        {
          _id: Date.now(),
          bidder: { name: "You" },
          amount: newBid,
        },
        ...prev,
      ]);

      await API.post("/bids/place", {
        auctionId: id,
        amount: newBid,
      });

      toast.success("You are highest bidder 🚀");
      setBidAmount("");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  if (!auction) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {/*  WINNER POPUP */}
      {showWinnerPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              🎉 Congratulations!
            </h2>
            <p className="text-gray-700">
              You won the auction <b>{auction.title}</b>
            </p>
            <p className="mt-2 text-lg font-semibold">
              Final Price: ₹{winnerData?.finalPrice}
            </p>

            <button
              onClick={() => setShowWinnerPopup(false)}
              className="mt-6 bg-black text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
          <h1 className="text-3xl font-bold">{auction.title}</h1>

          <p className="mt-4 text-gray-600">{auction.description}</p>

          <div className="mt-6 flex items-center gap-2">
            <Clock size={18} />
            <span>{timeLeft}</span>
          </div>

          <h2 className="text-4xl mt-6 text-green-600 font-bold">
            ₹{currentBid}
          </h2>

          {isHighestBidder && (
            <span className="mt-2 text-green-600 font-semibold">
              You are highest bidder
            </span>
          )}

          <div className="mt-6">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />

            <button
              onClick={handleBid}
              className="mt-4 w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Gavel size={18} /> Place Bid
            </button>
          </div>
        </div>
      </div>

      {/*  BID HISTORY  */}
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
