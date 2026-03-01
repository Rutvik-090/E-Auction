import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: Number,
  },
  { timestamps: true },
);

export default mongoose.model("Bid", bidSchema);
