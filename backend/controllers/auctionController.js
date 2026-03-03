import Auction from "../models/Auction.js";

//------------------
//Create Auction (Seller)
//------------------
export const createAuction = async (req, res) => {
  try {
    const { title, description, startingBid, reservePrice, endTime } = req.body;

    if (!title || !startingBid || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Title, Starting bid and end time are required",
      });
    }

    const auction = await Auction.create({
      title,
      description,
      startingBid,
      reservePrice,
      endTime,
    });

    return res.status(201).json({
      success: true,
      message: "Auction created successfully",
      auction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//---------------------
//Get all auctions
//---------------------
export const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: auctions.length, auctions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
