import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

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
    if (Number(amount) <= Number(auction.currentBid)) {
      return res.status(400).json({
        success: false,
        message: "Bid must be higher than current bid",
      });
    }

    // 1. Find previous highest bid
    const previousBid = await Bid.findOne({ auction: auctionId })
      .sort({ amount: -1 })
      .populate("bidder");

    // 2. Save new bid
    const bid = await Bid.create({
      auction: auctionId,
      bidder: req.user._id,
      amount,
    });

    // 3. Update auction
    // auction.currentBid = amount;
    // await auction.save();

    // const io = req.io;

    // if (!io) {
    //   console.log("❌ IO NOT INITIALIZED");
    // }

    // // 4. Notify previous bidder
    // if (
    //   previousBid &&
    //   previousBid.bidder._id.toString() !== req.user._id.toString()
    // ) {
    //   const notification = await Notification.create({
    //     user: previousBid.bidder._id,
    //     auction: auctionId,
    //     message: `You have been outbid on ${auction.title}`,
    //   });

    //   io.to(previousBid.bidder._id.toString()).emit("outbidNotification", {
    //     message: notification.message,
    //     auctionId,
    //   });

    //   if (io) {
    //     io.to(auctionId.toString()).emit("bidUpdated", {
    //       auctionId,
    //       amount,
    //       bidder: req.user.name,
    //     });
    //   }

    //   // email
    //   const previousUser = await User.findById(previousBid.bidder._id);

    //   await sendEmail(
    //     previousUser.email,
    //     "You've been outbid!",
    //     `<h2>Outbid Alert 🚨</h2>
    //  <p>You have been outbid on <b>${auction.title}</b></p>
    //  <p>New highest bid: ₹${amount}</p>`,
    //   );
    // }

    // // Notify previous bidder
    // if (
    //   previousBid &&
    //   previousBid.bidder._id.toString() !== req.user._id.toString()
    // ) {
    //   const notification = await Notification.create({
    //     user: previousBid.bidder._id,
    //     auction: auctionId,
    //     message: `You have been outbid on ${auction.title}`,
    //   });

    //   // Real-time notification
    //   io.to(previousBid.bidder._id.toString()).emit("outbidNotification", {
    //     message: notification.message,
    //     auctionId,
    //   });
    // }

    // Broadcast new bid to auction room
    // io.to(auctionId).emit("bidUpdated", {
    //   auctionId,
    //   amount,
    //   bidder: req.user.name,
    // });

    // // inside placeBid()

    // if (
    //   previousBid &&
    //   previousBid.bidder._id.toString() !== req.user._id.toString()
    // ) {
    //   const previousUser = await User.findById(previousBid.bidder._id);

    //   await sendEmail(
    //     previousUser.email,
    //     "You've been outbid!",
    //     `
    //   <h2>Outbid Alert 🚨</h2>
    //   <p>You have been outbid on <b>${auction.title}</b></p>
    //   <p>New highest bid: ₹${amount}</p>
    //   <a href="http://localhost:3000/auction/${auction._id}">
    //     View Auction
    //   </a>
    // `,
    //   );
    // }

    // 3. Update auction
    auction.currentBid = amount;
    await auction.save();

    // 4. Get io
    const io = req.io;

    if (!io) {
      console.log("❌ IO NOT INITIALIZED");
    }

    // 5. Notify previous bidder
    if (
      previousBid &&
      previousBid.bidder._id.toString() !== req.user._id.toString()
    ) {
      const notification = await Notification.create({
        user: previousBid.bidder._id,
        auction: auctionId,
        message: `You have been outbid on ${auction.title}`,
      });

      io.to(previousBid.bidder._id.toString()).emit("outbidNotification", {
        message: notification.message,
        auctionId,
      });

      const previousUser = await User.findById(previousBid.bidder._id);

      await sendEmail(
        previousUser.email,
        "You've been outbid!",
        `<h2>Outbid Alert 🚨</h2>
     <p>You have been outbid on <b>${auction.title}</b></p>
     <p>New highest bid: ₹${amount}</p>`,
      );
    }

    // 6. ALWAYS broadcast new bid
    io.to(auctionId.toString()).emit("bidUpdated", {
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
