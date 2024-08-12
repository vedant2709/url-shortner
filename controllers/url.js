const URL = require("../models/url");
const User = require("../models/user");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: 'url is required' });

  // Dynamically import nanoid
  const { nanoid } = await import('nanoid');
  const allurls = await URL.find({ createdBy: req.user._id });

  const shortID = nanoid(6);
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy:req.user._id
  });
  const user = await User.findOne({ email: req.user.email });

  return res.render("home",{
    urls: allurls,
    id: shortID ,
    username:user.name,
    userRole: user.role,
  })
}

async function handleGetAnalytics(req,res){
  const shortId=req.params.shortId;
  const result=await URL.findOne({shortId})
  return res.json({totalClicks:result.visitHistory.length,analytics:result.visitHistory})
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics
};
