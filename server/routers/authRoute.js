const express=require('express');
const { createUser, loginUserCtrl,getallUser, getaUser,deleteaUser, updatedUser } = require("../controller/userCtrl");
const { authMiddleware,isAdmin } = require('../middlewares/authMiddleware');
const router=express.Router();
router.post("/register",createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users",getallUser)
router.get("/:id",authMiddleware,isAdmin,getaUser)
router.delete("/:id",deleteaUser)
router.put("/edit-user", authMiddleware, updatedUser);
module.exports=router;