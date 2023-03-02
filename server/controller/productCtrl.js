const Product=require('../models/productModel')
const asyncHandler=require('express-async-handler')
const slugify=require('slugify')
//create
const createProduct=asyncHandler(async(req,res)=>{
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
const newProduct=await Product.create(req.body)
        res.json(newProduct);
    }catch(err){
        throw new Error(err)
    }

})
//product updation
const updateProduct=asyncHandler(async(req,res)=>{
    const id=req.params
    try{
if (req.body.title) {
  req.body.slug = slugify(req.body.title);
}
const updateProduct = await Product.findOneAndUpdate({id}, req.body,
    {new:true}
    );
    res.json(updateProduct);
    }catch(err){
        throw new Error(err)
    }
}
)
//delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    
    const deleteProduct = await Product.findByIdAndDelete(id)
    
    res.json(deleteProduct);
  } catch (err) {
    throw new Error(err);
  }
});
// get a product
const getaProduct=asyncHandler(async(req,res)=>{
    try{
const findProduct=await Product.findById(req.params.id)
res.json(findProduct)
    }catch(err){
         throw new Error(err)
    }
})
//getall products
const getallProduct=asyncHandler(async(req,res)=>{
  
    // console.log(req.query)
try{
    //const products=await Product.find(req.query)
//   const products=await Product.find(
//     {
//       brand: req.query.brand,
//       category: req.query.category
//   }
//  )
//filtering
const queryObj={...req.query};
//console.log(queryObj)
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((el)=>delete queryObj[el])
  console.log(queryObj);
  let queryStr=JSON.stringify(queryObj)
  queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`)
 // console.log(JSON.parse(queryStr))
 let query=Product.find(JSON.parse(queryStr))
//console.log(queryObj,req.query);
//const products=await Product.find(queryObj)
//  const products=await Product.where("category").equals(req.query.category)
   //sorting

   if(req.query.sort){
const sortBy=req.query.sort.split(',').join(' ')
query=query.sort(sortBy)
   }else{
query=query.sort('-createdAt')
   }
   //limiting the fields
   if(req.query.fields){
const fields = req.query.fields.split(",").join(" ");
query = query.select(fields);
   }else{
query=query.select('-__v')
   }
   //pagination
   const page=req.query.page;
   const limit=req.query.limit;
   const skip=(page-1)*limit
   query=query.skip(skip).limit(limit);
   if(req.query.page){
     const productCount = await Product.countDocuments();
     if (skip >= productCount) throw new Error("This page does not exist");
   
   }
   console.log(page,limit,skip)
const products=await query;
 const length = await Product.find(query).count();
  res.json({ TotalProducts: products,Length:length });
}catch(err){
    throw new Error(err)
}
})
module.exports = {
  createProduct,
  getaProduct,
  getallProduct,
  updateProduct,
  deleteProduct,
};