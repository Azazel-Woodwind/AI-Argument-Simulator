const express = require("express");
const router = express.Router();
const {
  getNextArgument,
  getArguments,
  deleteArgument,
  saveArgument,
} = require("../controllers/argumentController");
const protect = require("../middleware/authMiddleware");

router.route("/next-argument").post(getNextArgument);
router
  .route("/")
  .post(protect, saveArgument)
  .get(protect, getArguments)
  .delete(protect, deleteArgument);

module.exports = router;
