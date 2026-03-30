import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Active bids (auctions still running)
    const activeBids = await Bid.countDocuments({
      bidder: userId,
    });

    // Won auctions
    const wonAuctions = await Auction.find({
      winner: userId,
    });

    const wonCount = wonAuctions.length;

    // Total spent
    const totalSpent = wonAuctions.reduce(
      (acc, item) => acc + (item.finalPrice || 0),
      0,
    );

    // Recent activity (last 5 bids)
    const recentBids = await Bid.find({ bidder: userId })
      .populate("auction", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentActivity = recentBids.map(
      (bid) => `You placed a bid on "${bid.auction?.title}"`,
    );

    res.json({
      activeBids,
      wonAuctions: wonCount,
      totalSpent,
      recentActivity,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
