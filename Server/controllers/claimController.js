const Claim = require("../models/Claim");
const Item = require("../models/Item");

// Create a new claim
const createClaim = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    if (!itemId || !message) {
      return res.status(400).json({
        success: false,
        message: "Item ID and message are required"
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    if (item.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This item is no longer available for claiming"
      });
    }

    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot claim your own item"
      });
    }

    const existingClaim = await Claim.findOne({
      itemId,
      claimantId: req.user._id,
      status: "pending"
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a claim for this item"
      });
    }

    const claim = await Claim.create({
      itemId,
      claimantId: req.user._id,
      message
    });

    res.status(201).json({
      success: true,
      message: "Claim submitted successfully",
      data: claim
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create claim",
      error: error.message
    });
  }
};

module.exports = {
  createClaim
};