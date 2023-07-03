const express= require("express");
const { auth, authWorker , authAdmin } = require("../middlewares/auth");
const { validateStorageOrder,  StorageOrderModel} = require("../models/storageOrderModel");
const router = express.Router();

router.get("/" , authWorker ,async(req,res)=> {
  let perPage = req.query.perPage || 5;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try{
    let data = await StorageOrderModel.find({})
    .limit(perPage)
    .skip((page - 1) * perPage)
    // .sort({_id:-1}) like -> order by _id DESC
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.get("/count",authWorker, async(req,res) => {
  try{
    let count = await StorageOrderModel.countDocuments({})
    res.json({count});
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.post("/" ,auth, async(req,res) => {
  let validBody = validateStorageOrder(req.body);
  if(validBody.error){
    res.status(400).json(validBody.error.details)
  }
  try{
    let order = new StorageOrderModel(req.body);
    order.user_id = req.tokenData._id;
    await order.save();
    res.json(order);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.put("/:idEdit",authWorker ,async(req,res) => {
  let validBody = validateStorageOrder(req.body);
  if(validBody.error){
    res.status(400).json(validBody.error.details)
  }
  try{
    let idEdit= req.params.idEdit
    let data ;
    if(req.tokenData.role == "admin"){
      data = await StorageOrderModel.updateOne({_id:idEdit},req.body);
    }
    else{
      data = await StorageOrderModel.updateOne({_id:idEdit,user_id:req.tokenData._id},req.body);
    }
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})
router.patch("/updateStatus/:orderID", auth, async (req, res) => {
    if (!req.body.status) {
      return res.status(400).json({ msg: "Need to send status in body" });
    }
  
    try {
      let orderID = req.params.orderID
      if(req.tokenData.role == "admin"||req.tokenData.role == "worker"){
        let data = await StorageOrderModel.updateOne({_id:orderID,worker_id:req.tokenData._id},{ status: req.body.status });
        res.json(data);

      }
      else{
        if(req.body.status=="Cancelled"){
      let data = await StorageOrderModel.updateOne({_id:orderID,user_id:req.tokenData._id},{ status: req.body.status });
      res.json(data);
    }
    else{
        return res.status(401).json({ msg: "Just workers can change status" });
    }
      }
     
     
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  })
  

router.delete("/:idDel",authAdmin,async(req,res) => {
  try{
    let idDel= req.params.idDel
    let data ;
    
      data = await StorageOrderModel.deleteOne({_id:idDel,user_id:req.tokenData._id});
    
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})


module.exports = router;