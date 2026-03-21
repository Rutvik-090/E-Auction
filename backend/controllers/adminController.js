import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import User from "../models/User.js";

// ============================
// DASHBOARD STATS
// ============================
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAuctions = await Auction.countDocuments();
    const activeAuctions = await Auction.countDocuments({ status: "active" });
    const endedAuctions = await Auction.countDocuments({ status: "ended" });

    const totalBids = await Bid.countDocuments();

    // Revenue (sum of paid auctions)
    const revenueData = await Auction.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$finalPrice" } } },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAuctions,
        activeAuctions,
        endedAuctions,
        totalBids,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");

  res.json({
    success: true,
    users,
  });
};

// DELETE USER
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: "User deleted",
  });
};

// GET ALL AUCTIONS
export const getAllAuctionsAdmin = async (req, res) => {
  const auctions = await Auction.find()
    .populate("seller", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    auctions,
  });
};

// FORCE END AUCTION
export const forceEndAuction = async (req, res) => {
  const auction = await Auction.findById(req.params.id);

  if (!auction) {
    return res.status(404).json({ message: "Auction not found" });
  }

  auction.status = "ended";
  await auction.save();

  res.json({
    success: true,
    message: "Auction ended by admin",
  });
};

export const getAllBids = async (req, res) => {
  const bids = await Bid.find()
    .populate("bidder", "name email")
    .populate("auction", "title");

  res.json({
    success: true,
    bids,
  });
};
