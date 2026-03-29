import cron from "node-cron";
import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import User from "../models/User.js";
import { sendEmail } from "./sendEmail.js";

export const startAuctionCron = () => {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    const expiredAuctions = await Auction.find({
      endTime: { $lt: now },
      status: "active",
    });

    for (const auction of expiredAuctions) {
      // Find highest bid
      const highestBid = await Bid.findOne({ auction: auction._id })
        .sort({ amount: -1 })
        .populate("bidder");

      if (highestBid) {
        auction.status = "ended";
        auction.winner = highestBid.bidder._id;
        auction.finalPrice = highestBid.amount;

        const winnerUser = await User.findById(highestBid.bidder._id);

        if (winnerUser?.email) {
          await sendEmail(
            winnerUser.email,
            "🎉 You won the auction!",
            `
      <h2>Congratulations 🎉</h2>
      <p>You won the auction: <b>${auction.title}</b></p>
      <p>Final Price: ₹${highestBid.amount}</p>
      <p>Please complete your payment.</p>
    `,
          );
        }
      } else {
        auction.status = "ended";
      }

      await auction.save();

      io.to(auction._id.toString()).emit("auctionEnded", {
        winner: highestBid?.bidder?.name,
        finalPrice: highestBid?.amount,
      });

      console.log(`Auction ended: ${auction.title}`);
    }
  });
};
