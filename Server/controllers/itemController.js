const Item = require("../models/Item");

// Create a new item
const createItem = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      location,
      date,
      photoUrl,
      claimQuestion,
      tags
    } = req.body;

    const item = await Item.create({
      type,
      title,
      description,
      category,
      location,
      date,
      photoUrl,
      claimQuestion,
      tags,
      postedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: error.message
    });
  }
};

// Get all items with search and filters
const getItems = async (req, res) => {
  try {
    const { type, category, location, status } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = location;
    }

    if (status) {
      filter.status = status;
    }

    const items = await Item.find(filter).populate(
      "postedBy",
      "name email"
    );

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: error.message
    });
  }
};
// Get a single item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch item",
      error: error.message
    });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById
};