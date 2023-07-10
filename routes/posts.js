const router = require("express").Router();
const authenticate = require("../authenticate");
const Post = require("../models/Post");
const User = require("../models/User");
const getDataUri = require("../utils/getDataUri");
const singleUpload = require("../utils/singleUpload");
const cloudinary = require('cloudinary')

//CREATE
router.post("/", singleUpload, async (req,res)=>{
    let file = req.file
    let toUpload = getDataUri(file)
    let img =  await cloudinary.v2.uploader.upload(toUpload.content)    

   const newPost = new Post({...req.body, photo: {
    public_id: img.public_id,
    url: img.secure_url
   }});
   try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
   }catch(err){
    res.status(500).json({message:"Something went wrong"});
   }
 });

 //UPDATE
 router.put("/:id",async (req,res)=>{
     try{
    const post = await Post.findById(req.params.id);
    if(post.username === req.body.username) {
        try{
            const updatedpost = await Post.findByIdAndUpdate(req.params.id,{
                $set:req.body,},{new:true})
            res.status(200).json(updatedpost);
        } catch(err){
            res.status(500).json({message:"Something went wrong"});
        }
    }
    else{
        res.status(401).json("You can only update your post!");
    }
         
    }catch(err){
     res.status(500).json(err);
    }
  });

//DELETE
router.delete("/:id",async (req,res)=>{
    try{
   const post = await Post.findById(req.params.id);
   if(post.username === req.body.username) {
       try{
        await cloudinary.v2.uploader.destroy(post.photo.public_id)
         await Post.findByIdAndDelete(req.params.id);
         res.status(200).json("Post deleted....");
       }catch(err){
           res.status(500).json(err);
       }
   }
   else{
       res.status(401).json("You can delete only your post!");
   }
        
   }catch(err){
    res.status(500).json(err);
   }
 });
//GET POST
router.get("/:id", async (req,res) =>{
    try{
       const post = await Post.findById(req.params.id);
       res.status(200).json(post);
    }catch (err) {
     res.status(500).json({message:"Something went wrong"});
    }
}
)

//GET ALL POSTS
router.get("/", async (req,res) =>{
    const {username,catName} = req.query;
    try{
        let posts;
       if(username) {
        posts = await Post.find({username});
       }
       else if(catName) {
            posts=await Post.find({"categories": {
                $in:[catName],
            }});
        }
        else {
           posts = await Post.find();
        }
        res.status(200).json(posts);
    }catch (err) {
     res.status(500).json({message:"Something went wrong"});
    }
}
)

module.exports = router;