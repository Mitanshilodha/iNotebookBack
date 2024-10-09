const express= require('express');
const User=require('../models/User');
const router= express.Router();
const{body,validationResult}=require('express-validator');
const bcrypt= require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/fetchUser');

const JWT_SECRET= "Mitanshilodha09"


//Route1:Create a user using: POST "/api/auth/createuser".NO login required
router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be of atleast 5 characters').isLength({min:5})
],async(req,res)=>{
   let success= false;
   //If there are errors, return bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    //Check whether the user with this email exists already
    try{
    let user= await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({success,error: "Sorry a user with this email already exist"});
    }

    //Creating salt using bcrptjs package which is a nodejs package.
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);

     //Create a new user
    user= await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
    })
        const data={
            user:{
                id: user.id
            }
        }


     const authtoken= jwt.sign(data, JWT_SECRET);
     

        // res.json(user)
        success=true;
        res.json({success,authtoken});
} catch(error){
    console.error(error.message);
    res.status(500).send("Internal server Error");
}
    
    
   
})

//Route2:Authenticate a user using" POST "/api/auth/login"
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
   
],async(req,res)=>{
    let success= false;
    //If there are errors, return bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   const {email,password} = req.body;
   try {
     let user = await User.findOne({email});
     if(!user){
        return res.status(400).json({success,error: "Please try to login with correct credentials"});
     }

    const passwordCompare= await bcrypt.compare(password,user.password);
    if(!passwordCompare){
        return res.status(400).json({success,error: "Please try to login with correct credentials"});
    }
    const data={
        user:{
            id: user.id
        }
    }


 const authtoken= jwt.sign(data, JWT_SECRET);
 

    // res.json(user)
    success= true;
    res.json({success,authtoken});

   } catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})

//Route3:Get loggedIn user details using" POST "/api/auth/getuser. Login Required"
router.post('/getuser',fetchuser,async(req,res)=>{
  
try {
  const userId= req.user.id;
  const user= await User.findById(userId).select("-password");
  res.send(user);
} catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})




module.exports= router;