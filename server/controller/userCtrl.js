const User=require("../models/userModel")
const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken")
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId=require("../utils/validateMongoDbId");
const {generateRefreshToken}=require("../config/refreshtoken");
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
  const refreshToken=await generateRefreshToken(findUser?._id)
  const updateuser=await User.findByIdAndUpdate(
    findUser.id,
    {
    refreshToken:refreshToken,
  },
  {new:true}
  )
  res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    maxAge:72*60*60*1000
  })
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
//handle refresh token
const handleRefreshToken =asyncHandler(async(req,res)=>{
const cookie=req.cookies;
//console.log("cookie",cookie)
if(!cookie?.refreshToken) throw new Error("No Refresh Token In Cookies")
const refreshToken = cookie.refreshToken
// console.log("refresh token",refreshToken)
const user=await User.findOne({refreshToken})
if(!user) throw new Error("No Refresh Token present in DB or not matched")
jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
//console.log(decoded)
if(err||user.id!==decoded.id){
  throw new Error("There is something wrong with refresh Token")
}
const accessToken = generateToken(user?._id)
res.json({accessToken})
})
//res.json(user)
})
//logout functionality
const logout=asyncHandler(async(req,res)=>{
const cookie = req.cookies;
if (!cookie?.refreshToken) throw new Error("No Refresh Token In Cookies");
const refreshToken = cookie.refreshToken;
const user = await User.findOne({ refreshToken });
if(!user){
  res.clearCookie('refreshToken',{
    httpOnly: true,
    secure:true
  });
  return res.sendStatus(204)//forbidden
}
await User.findOneAndUpdate(refreshToken,{
  refreshToken:""
})
res.clearCookie("refreshToken", {
  httpOnly: true,
  secure: true,
});
  res.sendStatus(204)//forbidden
})
//update a user
const updatedUser=asyncHandler(async(req,res)=>{
  console.log(req.user)
const {_id}=req.user;
validateMongoDbId(_id)
try{
  const updateUser=await User.findByIdAndUpdate(_id,{
firstname:req?.body?.firstname,
lastname:req?.body?.lastname,
email:req?.body?.email,
mobile:req?.body?.mobile,
// password:req?.body?.password
  },{
    
    new:true
  }
  );
  res.json(updateUser)
}catch(err){
  throw new Error(err)
}
})
//get all users
const getallUser=asyncHandler(async (req,res)=>{
try{
  const getUsers=await User.find()
  res.json(getUsers);
}catch(err){
  throw new Error(err)
}
})
const getaUser=asyncHandler(async(req,res)=>{
  validateMongoDbId(id)
  try{
    const getUser=await User.findById(req.params.id)
    res.json(getUser)
  }catch(err){
    throw new Error(err)
  }
})
const deleteaUser = asyncHandler(async (req, res) => {
  try {
    const deleteUser = await User.findById(req.params.id);
   deleteUser.remove()
   res.json("user deleted")
  } catch (err) {
    throw new Error(err);
  }
});
const blockUser=asyncHandler(async(req,res)=>{
const {id}=req.params;
validateMongoDbId(id)
try{
const block=await User.findByIdAndUpdate(id,{
  isBlocked:true,
},{
  new:true,
}
);
res.json({message:"User Blocked"})
}catch(err){
  throw new Error(err);
}
})
const unblockUser = asyncHandler(async (req, res) => {
const { id } = req.params;
validateMongoDbId(id)
try {
  const unblock = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    {
      new: true,
    }
  );
  res.json({ message: "User Unblocked" });
} catch (err) {
  throw new Error(err);
}
});
module.exports = {
  createUser,
  loginUserCtrl,
  updatedUser,
  getallUser,
  getaUser,
  deleteaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout
};