const express = require("express");
const URL = require("../models/url");
const { restrictTo } = require("../middlewares/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
  const allurls = await URL.find({});
  // console.log(allurls)
  const path=req.path;
  console.log(path)
  const user = await User.findOne({ email: req.user.email });
  return res.render("home", {
    urls: allurls,
    username: user.name,
    userRole: user.role,
    path:path,
  });
});

router.get("/", restrictTo(["NORMAL", "ADMIN"]), async (req, res) => {
  const allurls = await URL.find({ createdBy: req.user._id });
  const user = await User.findOne({ email: req.user.email });
  const path=req.path;
  return res.render("home", {
    urls: allurls,
    username: user.name,
    userRole: user.role,
    path:path
  });
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = router;
