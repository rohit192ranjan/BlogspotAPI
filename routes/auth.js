const router = require("express").Router();
const authenticate = require("../authenticate");
const User = require("../models/User");
const getDataUri = require("../utils/getDataUri");
const singleUpload = require("../utils/singleUpload");
const cloudinary = require('cloudinary')

//Register
let options = {
    httpOnly: true,
    sameSite: 'none',
    secure: true
};

router.post("/register", singleUpload, async (req, res) => {
  try {
      let file = req.file
      console.log(file)
      let toUpload = getDataUri(file)
      console.log("lolol")
      console.log(toUpload)
      let img = await cloudinary.v2.uploader.upload(toUpload.content)
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profilePic: {
            public_id: img.public_id,
            url: img.secure_url
        }
      });
    const user = await newUser.save();
    let token = await user.getToken();
    res.status(200).cookie('token', token, options).json({
      message: "user created successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong Credentials!!");
    const validated = (await req.body.password) === user.password;
    !validated && res.status(400).json("Wrong Credentials!!");
    let token = await user.getToken();
    
    res.status(200).cookie('token', token, options).json(user);
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get('/logout', async(req, res) => {
    res.status(200).cookie('token', '', options).json({
        message: 'Logged out successfully'
    })
})

router.get("/profile", authenticate, async (req, res) => {
    try {
        res.json({
            user: req.user
        })
    } catch {
      res.status(500).json({ message: "Something went wrong" });
    }
  });

module.exports = router;
