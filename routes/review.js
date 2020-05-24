const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { getreviews,getreview,addreview,updateReview,deleteeReview } = require("../controllers/review");
const Review = require("../models/Review");

const advanceResults = require("../middleware/adavanceResults");

const router = express.Router({ mergeParams: true });

router.route('/')
.get(
  advanceResults(Review, {
    path: "BootCamp",
    select: "name description",
  }),
  getreviews
)
.post(protect, authorize('user','admin') ,addreview);

router.route('/:id')
.get(getreview)
.put(protect, authorize('user','admin') ,updateReview)
.delete(protect, authorize('user','admin'), deleteeReview);
module.exports = router;
