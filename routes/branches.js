const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { BranchModel, validateBranch,  createToken } = require("../models/branchModel")
const router = express.Router();

router.get("/", async (req, res) => {
    let perPage = req.query.perPage || 5;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? 1 : -1;
  
    try{
      let data = await BranchModel.find({})
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


router.get("/:idBranch" , async(req,res)=> {
 
    try{
      let data = await BranchModel.findOne({_id:req.params.idBranch})
      // .sort({_id:-1}) like -> order by _id DESC
      if (!data) {
        return res.status(401).json({ msg: "not found, check the id" })
      }
      res.json(data);
  
    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:"there error try again later",err})
    }
  })
  router.post("/", authAdmin , async(req,res) => {
    let validBody = validateBranch(req.body);
    if(validBody.error){
      res.status(400).json(validBody.error.details)
    }
    try{
      let branch = new BranchModel(req.body);
      await branch.save();
      res.json(branch);
    }
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }
  })
  router.put("/:idEdit",authAdmin ,async(req,res) => {
    let validBody = validateBranch(req.body);
    if(validBody.error){
      res.status(400).json(validBody.error.details)
    }
    try{
      let idEdit= req.params.idEdit
      let data ;
     
        data = await BranchModel.updateOne({_id:idEdit},req.body);
     
      res.json(data);
    }
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }
  })
  





// מאפשר לגרום למשתמש לא יכולת להוסיף מוצרים חדשים/ סוג של באן שלא מוחק את המשתמש
router.patch("/changeActive/:branchID", authAdmin, async (req, res) => {
  if (!req.body.active && req.body.active != false) {
    return res.status(400).json({ msg: "Need to send active in body" });
  }

  try {
    let branchID = req.params.userID
    // לא מאפשר ליוזר אדמין להפוך למשהו אחר/ כי הוא הסופר אדמין
    
    let data = await BranchModel.updateOne({ _id: branchID }, { active: req.body.active })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

module.exports = router;