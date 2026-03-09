import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";

//-------------------
//Place Bid
//-------------------

export const placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;

    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res
        .status(404)
        .json({ success: false, message: "Auction not found" });
    }

    // check if auction ended
    if (auction.status === "ended") {
      return res.status(400).json({
        success: false,
        message: "Auction has ended",
      });
    }

    // Check auction time
    if (new Date() > auction.endTime) {
      auction.status = "ended";
      await auction.save();

      return res.status(400).json({
        success: false,
        message: "Auction expired",
      });
    }

    // Validate bid amount
    if (amount <= auction.currentBid) {
      return res.status(400).json({
        success: false,
        message: "Bid must be higher than current bid",
      });
    }

    // Save bid
    const bid = await Bid.create({
      auction: auctionId,
      bidder: req.user._id,
      amount,
    });

    // Update auction price
    auction.currentBid = amount;
    await auction.save();

    // Real-time broadcast
    const io = req.app.get("io");

    io.to(auctionId).emit("bidUpdated", {
      auctionId,
      amount,
      bidder: req.user.name,
    });

    res.status(200).json({
      success: true,
      message: "Bid placed successfully",
      bid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//----------------------------
// Bid History
//----------------------------

export const getBidHistory = async (req, res) => {
  try {
    const bids = await Bid.find({ auction: req.params.auctionId })
      .populate("bidder", "name")
      .sort({ amount: -1 });

    res.status(200).json({
      success: true,
      bids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
