const express = require("express");
const router = express.Router();
const getNextArgument = require("../controllers/argumentController");

router.route("/").post(getNextArgument);

module.exports = router;
