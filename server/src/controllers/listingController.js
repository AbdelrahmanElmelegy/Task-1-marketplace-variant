import { Listing } from "../models/Listing.js";
import Joi from "joi";

// Validation schema for create/update
const listingValidationSchema = Joi.object({
  title: Joi.string(),

  description: Joi.string().allow(""),

  price: Joi.number().min(0),

  category: Joi.string().valid(
    "textbooks",
    "electronics",
    "furniture",
    "clothing",
    "other",
  ),

  condition: Joi.string().valid("new", "like-new", "used", "worn"),

  status: Joi.string().valid("active", "sold", "removed"),

  seller: Joi.string(),
});

// GET /api/listings

export async function getAllListings(req, res, next) {
  try {
    const showRemoved = req.query.showRemoved === "true";

    const filter = showRemoved ? {} : { status: { $ne: "removed" } };

    const listings = await Listing.find(filter);

    return res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
}

// GET /api/listings/:id

export async function getListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    if (listing.status === "removed") {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    return res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
}

// POST /api/listings

export async function createListing(req, res, next) {
  try {
    const { error, value } = listingValidationSchema
      .fork(["title", "price"], (schema) => schema.required())
      .validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const listing = await Listing.create(value);

    return res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/listings/:id

export async function updateListing(req, res, next) {
  try {
    const { error, value } = listingValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const listing = await Listing.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    return res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/listings/:id

export async function deleteListing(req, res, next) {
  try {
    // TODO
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "removed" },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found",
      });
    }

    return res.status(200).json({
      message: "Listing removed successfully",
      listing,
    });
  } catch (err) {
    next(err);
  }
}
