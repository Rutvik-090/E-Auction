import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    startingBid: Number,
    currentBid: {
      type: Number,
      default: 0,
    },
    reservePrice: Number,
    image: String,
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    endTime: Date,
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    finalPrice: { type: Number },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Auction", auctionSchema);
