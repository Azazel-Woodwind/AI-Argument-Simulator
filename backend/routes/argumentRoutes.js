const express = require("express");
const router = express.Router();
const {
  getNextArgument,
  getArguments,
  deleteArgument,
  saveArgument,
  updateNextArgument,
} = require("../controllers/argumentController");
const protect = require("../middleware/authMiddleware");

router.route("/next-argument").post(getNextArgument);
router.route("/next-argument/:id").put(protect, updateNextArgument);
router.route("/").post(protect, saveArgument).get(protect, getArguments);

router.route("/:id").delete(protect, deleteArgument);

module.exports = router;
