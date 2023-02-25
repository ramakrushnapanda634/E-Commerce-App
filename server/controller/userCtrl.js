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
//update a user
const updatedUser=asyncHandler(async(req,res)=>{
  console.log(req.user)
const {_id}=req.user;
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
module.exports = { createUser, loginUserCtrl,updatedUser,getallUser,getaUser,deleteaUser  };