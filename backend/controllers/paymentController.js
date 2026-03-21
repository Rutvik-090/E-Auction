import razorpay from "../config/razorpay.js";
import Auction from "../models/Auction.js";

export const createOrder = async (req, res) => {
  try {
    const { auctionId } = req.body;

    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (
      !auction.winner ||
      auction.winner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only winner can pay",
      });
    }

    if (auction.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Already paid",
      });
    }

    const options = {
      amount: auction.finalPrice * 100, // in paise
      currency: "INR",
      receipt: `receipt_${auction._id}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      auctionId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const auction = await Auction.findById(auctionId);

    auction.paymentStatus = "paid";
    auction.paymentId = razorpay_payment_id;

    await auction.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
