const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const getDataUri = require("../utils/getDataUri");
const singleUpload = require("../utils/singleUpload");
const cloudinary = require('cloudinary')

//Update
// router.put("/:id",async (req,res)=>{
//     if(req.body.userId === req.params.id){
//         try{
//        const updatedUser = await User.findByIdAndUpdate(
//         req.params.id,{
//             $set: req.body,
//         },{new:true} ) ;
//         res.status(200).json(updatedUser);
//         } catch (err) {
//             res.status(500).json({message:"Something went wrong"});
//         }
//     }else{
//         res.status(401).json("You can update only your account!");
//     }
// });

router.put("/:id", singleUpload, async (req,res)=>{
  if(req.body.userId === req.params.id){
      try{
        let user = await User.findById(req.params.id)
        if(!user){
          return res.status(500).json({message: 'Something went wrong'})
        }
        let {username, email, password} = req.body
        let file = req.file
        if(!username && !email && !password && !file){
          return res.status(500).json({message: 'There is nothing to update'})
        }
        if(username) user.username = username
        if(email) user.email = email
        if(password) user.password = password
        if(file){
          let toUpload = await getDataUri(file)
          let img = await cloudinary.v2.uploader.upload(toUpload.content)
          user.profilePic = {
            public_id: img.public_id,
            url: img.secure_url
          }
        }
        await user.save()
        res.status(200).json({
          message: 'Profile updated successfully',
          user
        })
      } catch (err) {
          res.status(500).json({message:"Something went wrong"});
      }
  }else{
      res.status(401).json("You can update only your account!");
  }
});
//DELETE
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        try {
          await Post.deleteMany({ username: user.username });
          await User.findByIdAndDelete(req.params.id);
          res.status(200).json("User has been deleted...");
        } catch (err) {
          res.status(500).json({message:"Something went wrong"});
        }
      } catch (err) {
        res.status(404).json("User not found!");
      }
    } else {
      res.status(401).json("You can delete only your account!");
    }
  });

//GET USER
router.get("/:id", async (req,res) =>{
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    }catch (err) {
     res.status(500).json({message:"Something went wrong"});
    }
}
)

module.exports = router;