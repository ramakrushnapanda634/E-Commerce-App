const User=require("../models/userModel")
const asyncHandler=require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    //Create a new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    //user alredy exist
    throw new Error('User already exists')
   // res.json({ msg: "User Alredy Exists", success: false });
  }
});
const loginUserCtrl=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
  //check if user exist or not
const findUser=await User.findOne({email})
if (findUser && ( await findUser.isPasswordMatched(password))) {
  res.json({
    _id:findUser?._id,   
    firstname:findUser?.firstname,
    lastname:findUser?.lastname,
    email:findUser?.email,
    mobile:findUser?.mobile,
token:generateToken(findUser?._id)
  });
} else {
  throw new Error("Invalid Credentials");
}
})
module.exports = { createUser, loginUserCtrl };