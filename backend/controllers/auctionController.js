import Auction from "../models/Auction.js";

//------------------
//Create Auction (Seller)
//------------------
export const createAuction = async (req, res) => {
  try {
    const { title, description, startingBid, reservePrice, endTime } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

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
      seller: req.user._id,
      image: req.file.path, // Cloudinary URL
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
    let queryObj = {};

    // Hide expired auctions
    queryObj.endTime = { $gt: new Date() };

    // 🔍 Keyword Search
    if (req.query.keyword) {
      queryObj.$or = [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ];
    }

    // Price Filter
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.currentBid = {};

      if (req.query.minPrice) {
        queryObj.currentBid.$gte = Number(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        queryObj.currentBid.$lte = Number(req.query.maxPrice);
      }
    }

    // Sorting
    let sortOption = {};

    if (req.query.sort === "price_asc") {
      sortOption.currentBid = 1;
    } else if (req.query.sort === "price_desc") {
      sortOption.currentBid = -1;
    } else if (req.query.sort === "ending_soon") {
      sortOption.endTime = 1;
    } else {
      sortOption.createdAt = -1;
    }

    const auctions = await Auction.find(queryObj)
      .populate("seller", "name")
      .sort(sortOption);

    res.status(200).json({
      success: true,
      auctions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//--------------
//Get one auction
//--------------
export const getSingleAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate(
      "seller",
      "name email",
    );

    if (!auction) {
      return res
        .status(404)
        .json({ success: false, message: "Auction not found" });
    }

    res.status(200).json({ success: true, auction });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//-------------------
//Update Auction (Seller only)
//-------------------
export const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res
        .status(404)
        .json({ success: false, message: "Auction not found" });
    }

    //check ownership
    if (auction.seller.toString() !== req.user._id.toString()) {
      return res
        .status(500)
        .json({ success: false, message: "You are not authorized" });
    }

    // Cannot update ended auction
    if (auction.status === "ended") {
      return res.status(400).json({
        success: false,
        message: "Cannot update ended auction",
      });
    }

    const updatedAuction = await Auction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Auction updated successfully",
      updatedAuction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//-----------------
//Delete auction
//-----------------
export const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    if (auction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await auction.deleteOne();

    res.status(200).json({
      success: true,
      message: "Auction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//-------------------
//Auto end auction
//-------------------
export const checkAndEndAuctions = async () => {
  const now = new Date();

  await Auction.updateMany(
    { endTime: { $lt: now }, status: "active" },
    { status: "ended" },
  );
};
