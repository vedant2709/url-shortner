const User = require("../models/user");
const {v4: uuidv4}=require("uuid")
const {setUser}=require("../service/auth");

async function handleUserSignup(req,res){
  const {name,email,password}=req.body;
  await User.create({
    name,
    email,
    password
  })
  return res.redirect("/login")
}
async function handleUserLogin(req,res){
  const {email,password}=req.body;
  const user=await User.findOne({
    email,
    password
  })
  if(!user) return res.render("login",{
    error:"Invalid Username or Password"
  })
  const token=setUser(user)
  res.cookie("token",token)
  return res.redirect("/")
}

function handleUserLogout(req,res){
  res.clearCookie('token',{path:'/'});
  return res.redirect("/login",)
}

module.exports={
  handleUserSignup,
  handleUserLogin,
  handleUserLogout
}