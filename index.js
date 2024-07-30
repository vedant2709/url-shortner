const express=require('express');
const app=express();
const urlRoute=require("./routes/url")
const PORT=8000;
const {connectToMongoDB}=require("./connect")
const URL =require("./models/url")

connectToMongoDB("mongodb://127.0.0.1:27017/url-shortner")
.then(()=>console.log("MonogoDB connected"))

app.use(express.json())

app.use("/url",urlRoute)

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});


app.listen(PORT,()=>console.log(`Listening on port ${PORT}`))