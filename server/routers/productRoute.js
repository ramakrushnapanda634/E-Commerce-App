const express = require('express')
const router=express.Router()
const {
  createProduct,
  getaProduct,
  getallProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", authMiddleware, isAdmin, getaProduct);
router.get("/", authMiddleware, isAdmin, getallProduct);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);


module.exports =router;