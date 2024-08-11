const express = require("express");
const app = express();
const path=require("path")
const cookieParser=require("cookie-parser")
const { connectToMongoDB } = require("./connect");
const {checkForAuthentication,restrictTo}=require("./middlewares/auth")


const urlRoute = require("./routes/url");
const staticRoute=require("./routes/staticRouter")
const userRoute=require("./routes/user");


const URL = require("./models/url");
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/url-shortner").then(() =>
  console.log("Mongodb Connected")
);

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.use(checkForAuthentication);

app.use("/url",restrictTo(['NORMAL','ADMIN']),urlRoute);
app.use("/",staticRoute);
app.use("/user",userRoute)

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
    { new: true } // This ensures that the updated document is returned
  );

  if (!entry) {
    // If no matching entry is found, return a 404 error
    return res.status(404).json({ error: "Short URL not found" });
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
