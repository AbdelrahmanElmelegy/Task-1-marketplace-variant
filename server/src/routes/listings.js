import { Router } from "express";

import {
  getAllListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";

const router = Router();

// GET all listings
router.get("/", getAllListings);

// GET one listing
router.get("/:id", getListing);

// Create a new listing
router.post("/", createListing);

// Update a listing
router.patch("/:id", updateListing);

// Soft delete a listing
router.delete("/:id", deleteListing);

export default router;
